import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import VerificationCode, { VerificationType } from "@/models/VerificationCode";
import { 
  identifierSchema, 
  getIdentifierType, 
  generateVerificationCode, 
  VERIFICATION_CODE_LENGTH,
  VERIFICATION_CODE_EXPIRY_MINUTES 
} from "@/lib/auth/validation";
import { handleApiError, ValidationError, NotFoundError } from "@/lib/auth/errors";
import { createSuccessResponse, createErrorResponse } from "@/lib/auth/response";
import { checkRateLimit, getClientIP, addSecurityHeaders, sanitizeInput } from "@/lib/auth/security";
import { logger } from "@/lib/auth/logger";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { identifier, type } = identifierSchema.parse(body);

    // Sanitize input
    const sanitizedIdentifier = sanitizeInput(identifier);

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`signin:${clientIP}`, 5, 15 * 60 * 1000)) {
      logger.rateLimitExceeded(sanitizedIdentifier, "signin", { clientIP });
      return addSecurityHeaders(createErrorResponse(
        "Too many signin attempts. Please try again later.",
        429,
        "RATE_LIMIT_EXCEEDED"
      ));
    }

    // Determine identifier type if not provided
    let identifierType: "email" | "phone";
    try {
      identifierType = type || getIdentifierType(sanitizedIdentifier);
    } catch {
      throw new ValidationError("Invalid email or phone format");
    }
    console.log(sanitizedIdentifier, "sanitizedIdentifiersanitizedIdentifier")
    // Find user by email or phone (only search the relevant field)
    let user = null;
    if (identifierType === "email") {
      user = await User.findOne({ email: sanitizedIdentifier });
    } else if (identifierType === "phone") {
      user = await User.findOne({ phone: sanitizedIdentifier });
    }

    if (!user) {
      logger.authFailure(sanitizedIdentifier, "signin", "User not found", { identifierType });
      throw new NotFoundError("User not found");
    }

    // Invalidate any existing unused verification codes for this user and type
    await VerificationCode.updateMany(
      {
        userId: user._id,
        type: identifierType === "email" ? VerificationType.EMAIL : VerificationType.PHONE,
        isUsed: false,
      },
      {
        isUsed: true, // Mark as used to invalidate
      }
    );

    // Generate verification code
    const verificationCode = generateVerificationCode(VERIFICATION_CODE_LENGTH);

    // Create verification code record
    const verificationCodeRecord = new VerificationCode({
      code: verificationCode,
      type: identifierType === "email" ? VerificationType.EMAIL : VerificationType.PHONE,
      userId: user._id,
      // expiresAt is set to VERIFICATION_CODE_EXPIRY_MINUTES (default: 10 minutes). 
      // To expire in 2 days, set VERIFICATION_CODE_EXPIRY_MINUTES = 2880 (2 days * 24 hours * 60 minutes).
      expiresAt: new Date(Date.now() + VERIFICATION_CODE_EXPIRY_MINUTES * 60 * 1000),
      isUsed: false,
    });

    await verificationCodeRecord.save();

    // Add verification code to user's verification codes array
    user.verificationCodes.push(verificationCodeRecord._id);
    await user.save();

    // In a real application, you would send the verification code via:
    // - Email service (SendGrid, AWS SES, etc.) for email
    // - SMS service (Twilio, AWS SNS, etc.) for phone
    // For now, we'll return it in the response for development

    logger.authSuccess(sanitizedIdentifier, "signin", user._id.toString(), { identifierType });

    const response = createSuccessResponse(
      {
        verificationCode: verificationCode, // Remove this in production
        expiresAt: verificationCodeRecord.expiresAt,
        identifier: sanitizedIdentifier,
        type: identifierType,
      },
      `Verification code sent to ${sanitizedIdentifier}`
    );

    return addSecurityHeaders(response);

  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}
