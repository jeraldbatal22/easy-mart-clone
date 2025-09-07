import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  code?: string;
  details?: any;
}

export function createSuccessResponse<T>(
  data: T,
  message: string = "Success",
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function createErrorResponse(
  error: string,
  status: number = 400,
  code?: string,
  details?: any
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
      code,
      details,
    },
    { status }
  );
}

export function createUserResponse(user: any, message: string = "Success") {
  return {
    success: true,
    message,
    user: {
      id: user._id.toString(),
      email: user.email,
      phone: user.phone,
      isVerified: user.isVerified,
      verifiedAt: user.verifiedAt,
    },
  };
}
