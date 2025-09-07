import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import VerificationCode, { VerificationType } from "@/models/VerificationCode";
import {
  identifierSchema,
  getIdentifierType,
  generateVerificationCode,
  VERIFICATION_CODE_LENGTH,
  VERIFICATION_CODE_EXPIRY_MINUTES,
} from "@/lib/auth/validation";
import {
  handleApiError,
  ValidationError,
  NotFoundError,
} from "@/lib/auth/errors";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/lib/auth/response";
import {
  checkRateLimit,
  getClientIP,
  addSecurityHeaders,
  sanitizeInput,
} from "@/lib/auth/security";
import { logger } from "@/lib/auth/logger";
import { emailService } from "@/lib/services/emailService";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { identifier, type } = identifierSchema.parse(body);

    // Sanitize input
    const sanitizedIdentifier = sanitizeInput(identifier);

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`signin:${clientIP}`, 5, 1 * 60 * 1000)) {
      logger.rateLimitExceeded(sanitizedIdentifier, "signin", { clientIP });
      return addSecurityHeaders(
        createErrorResponse(
          "Too many signin attempts. Please try again later.",
          429,
          "RATE_LIMIT_EXCEEDED"
        )
      );
    }

    // Determine identifier type if not provided
    let identifierType: "email" | "phone";
    try {
      identifierType = type || getIdentifierType(sanitizedIdentifier);
    } catch {
      throw new ValidationError("Invalid email or phone format");
    }
    console.log(sanitizedIdentifier, "sanitizedIdentifiersanitizedIdentifier");
    // Find user by email or phone (only search the relevant field)
    let user = null;
    if (identifierType === "email") {
      user = await User.findOne({ email: sanitizedIdentifier });
    } else if (identifierType === "phone") {
      user = await User.findOne({ phone: sanitizedIdentifier });
    }

    if (!user) {
      logger.authFailure(sanitizedIdentifier, "signin", "User not found", {
        identifierType,
      });
      throw new NotFoundError("User not found");
    }

    // Invalidate any existing unused verification codes for this user and type
    await VerificationCode.updateMany(
      {
        userId: user._id,
        type:
          identifierType === "email"
            ? VerificationType.EMAIL
            : VerificationType.PHONE,
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
      type:
        identifierType === "email"
          ? VerificationType.EMAIL
          : VerificationType.PHONE,
      userId: user._id,
      // expiresAt is set to VERIFICATION_CODE_EXPIRY_MINUTES (default: 10 minutes).
      // To expire in 2 days, set VERIFICATION_CODE_EXPIRY_MINUTES = 2880 (2 days * 24 hours * 60 minutes).
      expiresAt: new Date(
        Date.now() + VERIFICATION_CODE_EXPIRY_MINUTES * 60 * 1000
      ),
      isUsed: false,
    });

    await verificationCodeRecord.save();

    // Add verification code to user's verification codes array
    user.verificationCodes.push(verificationCodeRecord._id);
    await user.save();

    // Send verification code via email or SMS
    let emailSent = false;
    if (identifierType === "email") {
      try {
        emailSent = await emailService.sendOTPEmail(
          sanitizedIdentifier,
          verificationCode,
          false
        );
        if (emailSent) {
          logger.info(`OTP email sent successfully to ${sanitizedIdentifier}`);
        } else {
          logger.warn(`Failed to send OTP email to ${sanitizedIdentifier}`);
        }
      } catch (error: any) {
        logger.error(
          `Error sending OTP email to ${sanitizedIdentifier}:`,
          error
        );
      }
    }
    // TODO: Implement SMS service for phone verification
    // else if (identifierType === "phone") {
    //   // Send SMS via Twilio, AWS SNS, etc.
    // }

    logger.authSuccess(sanitizedIdentifier, "signin", user._id.toString(), {
      identifierType,
    });

    const responseData: any = {
      expiresAt: verificationCodeRecord.expiresAt,
      identifier: sanitizedIdentifier,
      type: identifierType,
    };

    // Only include verification code in development or if email failed
    if (process.env.NODE_ENV === "development" || !emailSent) {
      responseData.verificationCode = verificationCode;
    }

    const response = createSuccessResponse(
      responseData,
      `Verification code ${
        emailSent ? "sent to" : "generated for"
      } ${sanitizedIdentifier}`
    );

    return addSecurityHeaders(response);
  } catch (error: any) {
    console.error("MongoDB Error (Vercel):", error, error?.message);
    return addSecurityHeaders(handleApiError(error));
  }
}
