import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import VerificationCode, { VerificationType } from "@/models/VerificationCode";
import { signToken, signRefreshToken } from "@/lib/auth";
import { 
  otpValidationSchema, 
  getIdentifierType 
} from "@/lib/auth/validation";
import { handleApiError, ValidationError, NotFoundError } from "@/lib/auth/errors";
import { createSuccessResponse, createUserResponse, createErrorResponse } from "@/lib/auth/response";
import { checkRateLimit, getClientIP, addSecurityHeaders, sanitizeInput } from "@/lib/auth/security";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { identifier, code, type } = otpValidationSchema.parse(body);

    // Sanitize input
    const sanitizedIdentifier = sanitizeInput(identifier);
    const sanitizedCode = sanitizeInput(code);

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(`validate-otp:${clientIP}`, 10, 15 * 60 * 1000)) {
      return addSecurityHeaders(createErrorResponse(
        "Too many OTP validation attempts. Please try again later.",
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

    // Find user by email or phone
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
      type: identifierType === "email" ? VerificationType.EMAIL : VerificationType.PHONE,
      isUsed: false,
      expiresAt: { $gt: new Date() }, // Check if code hasn't expired
    });

    if (!verificationCode) {
      throw new ValidationError("Invalid or expired verification code");
    }

    // Mark the verification code as used
    verificationCode.isUsed = true;
    await verificationCode.save();

    // Update user verification status
    user.isVerified = true;
    user.verifiedAt = new Date();
    await user.save();

    // Generate JWT token and refresh token
    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      phone: user.phone,
    });

    const refreshToken = signRefreshToken({
      id: user._id.toString(),
      email: user.email,
      phone: user.phone,
    });

    // Return success response with user data and tokens
    const response = createSuccessResponse(
      {
        ...createUserResponse(user, "OTP validated successfully"),
        token,
        refreshToken,
      },
      "OTP validated successfully"
    );

    return addSecurityHeaders(response);

  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}
