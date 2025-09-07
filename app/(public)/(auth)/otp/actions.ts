"use server";

import { z } from "zod";

export interface VerfiyOtpActionResult {
  success?: boolean;
  error?: string;
  data?: any;
}

// Validation schemas
const otpValidationSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  code: z.string().length(4, "OTP code must be 4 digits"),
  type: z.enum(["email", "phone"]),
});

const resendSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
});

// Server action for OTP verification
export async function verifyOtp(formData: FormData): Promise<VerfiyOtpActionResult> {
  const rawData = {
    identifier: formData.get("identifier") as string,
    code: formData.get("code") as string,
    type: formData.get("type") as "email" | "phone",
  };

  // Validate input
  const validatedData = otpValidationSchema.parse(rawData);

  try {
    // Make API call to validate OTP
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/validate-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to verify OTP",
      };
    }
    return result;

  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }

  // Redirect after successful verification (outside try-catch)
  // redirect("/onboarding");
}

// Server action for resending OTP
export async function resendOtp(formData: FormData) {
  try {
    const rawData = {
      identifier: formData.get("identifier") as string,
    };

    // Validate input
    const validatedData = resendSchema.parse(rawData);

    // Make API call to resend OTP
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/resend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to resend OTP",
      };
    }

    return {
      success: true,
      message: result.message || "New verification code sent!",
    };
  } catch (error) {
    console.error("Resend OTP error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
