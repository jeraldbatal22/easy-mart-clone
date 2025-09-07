import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";
import { signToken } from "@/lib/auth";
import { otpValidationSchema, getIdentifierType } from "@/lib/auth/validation";
import {
  handleApiError,
  ValidationError,
  NotFoundError,
} from "@/lib/auth/errors";
import {
  createErrorResponse,
  createSuccessResponse,
  createUserResponse,
} from "@/lib/auth/response";
import {
  checkRateLimit,
  getClientIP,
  addSecurityHeaders,
  sanitizeInput,
} from "@/lib/auth/security";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { identifier, code } = otpValidationSchema.parse(body);

    // Sanitize input
    const sanitizedIdentifier = sanitizeInput(identifier);
    const sanitizedCode = sanitizeInput(code);

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`verify:${clientIP}`, 10, 15 * 60 * 1000)) {
      return addSecurityHeaders(
        createErrorResponse(
          "Too many verification attempts. Please try again later.",
          429,
          "RATE_LIMIT_EXCEEDED"
        )
      );
    }

    // Determine identifier type
    let identifierType: "email" | "phone";
    try {
      identifierType = getIdentifierType(sanitizedIdentifier);
    } catch (error: any) {
      throw new ValidationError(error || "Invalid email or phone format");
    }

    // Find user by identifier
    let user = null;
    if (identifierType === "email") {
      user = await User.findOne({ email: sanitizedIdentifier });
    } else if (identifierType === "phone") {
      user = await User.findOne({ phone: sanitizedIdentifier });
    }

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Find the verification code
    const verificationCode = await VerificationCode.findOne({
      userId: user._id,
      code: sanitizedCode,
      isUsed: false,
      expiresAt: { $gt: new Date() }, // Not expired
    });

    if (!verificationCode) {
      throw new ValidationError("Invalid or expired verification code");
    }

    // Mark verification code as used
    verificationCode.isUsed = true;
    await verificationCode.save();

    // Mark user as verified if not already
    if (!user.isVerified) {
      user.isVerified = true;
      user.verifiedAt = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      phone: user.phone,
    });

    const response = createSuccessResponse(
      {
        ...createUserResponse(user, "Verification successful"),
        token,
      },
      "Verification successful"
    );

    return addSecurityHeaders(response);
  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}
