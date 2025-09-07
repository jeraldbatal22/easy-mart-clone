import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { validateAuthToken } from "@/lib/auth/security";
import { handleApiError, UnauthorizedError, NotFoundError } from "@/lib/auth/errors";
import { createSuccessResponse, createUserResponse } from "@/lib/auth/response";
import { addSecurityHeaders } from "@/lib/auth/security";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Validate JWT token
    const tokenPayload = await validateAuthToken(request);
    if (!tokenPayload) {
      throw new UnauthorizedError("Invalid or missing authentication token");
    }

    // Find user by ID from token
    const user = await User.findById(tokenPayload.id).select("-password -verificationCodes -refreshTokens");
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const response = createSuccessResponse(
      createUserResponse(user, "User profile retrieved successfully"),
      "User profile retrieved successfully"
    );

    return addSecurityHeaders(response);

  } catch (error) {
    return addSecurityHeaders(handleApiError(error));
  }
}