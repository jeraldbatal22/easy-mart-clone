import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import VerificationCode, { VerificationType } from "@/models/VerificationCode";
import {
  getIdentifierType,
  generateVerificationCode,
  VERIFICATION_CODE_LENGTH,
  VERIFICATION_CODE_EXPIRY_MINUTES,
} from "@/lib/auth/validation";
import { handleApiError, ValidationError } from "@/lib/auth/errors";
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
import { z } from "zod";

// Registration validation schema
const registerSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),
  type: z.enum(["email", "phone"]).optional(),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { identifier, type } = registerSchema.parse(body);

    // Sanitize input
    const sanitizedIdentifier = sanitizeInput(identifier);

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`register:${clientIP}`, 3, 1 * 60 * 1000)) {
      return addSecurityHeaders(
        createErrorResponse(
          "Too many registration attempts. Please try again later.",
          429,
          "RATE_LIMIT_EXCEEDED"
        )
      );
    }

    // Determine identifier type if not provided
    let identifierType: "email" | "phone";
    try {
      identifierType = type || getIdentifierType(sanitizedIdentifier);
    } catch (error: any) {
      throw new ValidationError(error || "Invalid email or phone format");
    }

    // Check if user already exists
    let existingUser = null;
    if (identifierType === "email") {
      existingUser = await User.findOne({ email: sanitizedIdentifier });
    } else if (identifierType === "phone") {
      existingUser = await User.findOne({ phone: sanitizedIdentifier });
    }

    if (existingUser) {
      throw new ValidationError("User already exists with this email/phone");
    }

    // Create new user
    const user = new User({
      [identifierType]: sanitizedIdentifier,
      provider: "LOCAL",
      isVerified: false,
    });

    await user.save();

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
    console.log(identifierType, "identifierTypeidentifierTypeidentifierType")
    if (identifierType === "email") {
      try {
        emailSent = await emailService.sendOTPEmail(sanitizedIdentifier, verificationCode, false);
        if (emailSent) {
          logger.info(`Registration OTP email sent successfully to ${sanitizedIdentifier}`);
        } else {
          logger.warn(`Failed to send registration OTP email to ${sanitizedIdentifier}`);
        }
      } catch (error) {
        logger.error(`Error sending registration OTP email to ${sanitizedIdentifier}`, {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
      }
    }
    // TODO: Implement SMS service for phone verification
    // else if (identifierType === "phone") {
    //   // Send SMS via Twilio, AWS SNS, etc.
    // }

    const responseData: any = {
      expiresAt: verificationCodeRecord.expiresAt,
      identifier: sanitizedIdentifier,
      type: identifierType,
      userId: user._id.toString(),
    };

    // Only include verification code in development or if email failed
    if (process.env.NODE_ENV === 'development' || !emailSent) {
      responseData.verificationCode = verificationCode;
    }

    const response = createSuccessResponse(
      responseData,
      `User registered successfully. Verification code ${emailSent ? 'sent to' : 'generated for'} ${sanitizedIdentifier}`
    );

    return addSecurityHeaders(response);
  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}
