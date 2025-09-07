"use server";

import { z } from "zod";

export interface SignupActionResult {
  success?: boolean;
  error?: string;
  data?: any;
}

// Validation schemas
const emailSignupSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

const phoneSignupSchema = z.object({
  phone: z
    .string()
    .min(8, "Enter a valid phone")
    .max(20, "Enter a valid phone"),
});

// Server action for email signup
export async function signupWithEmail(
  formData: FormData
): Promise<SignupActionResult> {
  try {
    const rawData = {
      email: formData.get("email") as string,
    };

    // Validate input
    const validatedData = emailSignupSchema.parse(rawData);

    // Make API call to register user
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: validatedData.email,
          type: "email",
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to register with email",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Email signup error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Server action for phone signup
export async function signupWithPhone(
  formData: FormData
): Promise<SignupActionResult> {
  try {
    const rawData = {
      phone: formData.get("phone") as string,
    };

    // Validate input
    const validatedData = phoneSignupSchema.parse(rawData);

    // Make API call to register user
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: validatedData.phone,
          type: "phone",
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to register with phone",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Phone signup error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
