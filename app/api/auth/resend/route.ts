import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import VerificationCode, { VerificationType } from "@/models/VerificationCode";
import { 
  resendSchema, 
  getIdentifierType, 
  generateVerificationCode, 
  VERIFICATION_CODE_LENGTH,
  VERIFICATION_CODE_EXPIRY_MINUTES 
} from "@/lib/auth/validation";
import { handleApiError, ValidationError, NotFoundError } from "@/lib/auth/errors";
import { createSuccessResponse, createErrorResponse } from "@/lib/auth/response";
import { checkRateLimit, getClientIP, addSecurityHeaders, sanitizeInput } from "@/lib/auth/security";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { identifier } = resendSchema.parse(body);

    // Sanitize input
    const sanitizedIdentifier = sanitizeInput(identifier);

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`resend:${clientIP}`, 3, 5 * 60 * 1000)) {
      return addSecurityHeaders(createErrorResponse(
        "Too many resend attempts. Please try again later.",
        429,
        "RATE_LIMIT_EXCEEDED"
      ));
    }

    // Determine identifier type
    let identifierType: "email" | "phone";
    try {
      identifierType = getIdentifierType(sanitizedIdentifier);
    } catch {
      throw new ValidationError("Invalid email or phone format");
    }

    // Find user by email or phone (only search the relevant field)
    let user = null;
    if (identifierType === "email") {
      user = await User.findOne({ email: sanitizedIdentifier });
    } else if (identifierType === "phone") {
      user = await User.findOne({ phone: sanitizedIdentifier });
    }

    if (!user) {
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

    // Generate new verification code
    const verificationCode = generateVerificationCode(VERIFICATION_CODE_LENGTH);

    // Create new verification code record
    const verificationCodeRecord = new VerificationCode({
      code: verificationCode,
      type: identifierType === "email" ? VerificationType.EMAIL : VerificationType.PHONE,
      userId: user._id,
      expiresAt: new Date(Date.now() + VERIFICATION_CODE_EXPIRY_MINUTES * 60 * 1000),
    });

    await verificationCodeRecord.save();

    // Add verification code to user's verification codes array
    user.verificationCodes.push(verificationCodeRecord._id);
    await user.save();

    // In a real application, you would send the verification code via:
    // - Email service (SendGrid, AWS SES, etc.) for email
    // - SMS service (Twilio, AWS SNS, etc.) for phone
    // For now, we'll return it in the response for development

    const response = createSuccessResponse(
      {
        // verificationCode: verificationCode, // Remove this in production
        expiresAt: verificationCodeRecord.expiresAt,
        identifier: sanitizedIdentifier,
        type: identifierType,
      },
      `New verification code sent to ${sanitizedIdentifier}`
    );

    return addSecurityHeaders(response);

  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}
