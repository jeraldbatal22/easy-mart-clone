"use server";

export interface SigninActionResult {
  success?: boolean;
  error?: string;
  data?: any;
}

export async function signinAction(
  formData: FormData
): Promise<SigninActionResult> {
  try {
    const identifier = formData.get("identifier") as string;
    const type = formData.get("type") as "email" | "phone";

    if (!identifier || !type) {
      return {
        error: "Missing required fields",
      };
    }

    // Validate input
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier)) {
        return {
          error: "Enter a valid email",
        };
      }
    } else if (type === "phone") {
      if (identifier.length < 8 || identifier.length > 20) {
        return {
          error: "Enter a valid phone",
        };
      }
    }

    // Make the API call to our existing signin endpoint
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/auth/signins`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          type,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || data.message || "Signin failed",
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    console.error("Signin action error:", error);
    return {
      error: error.message || "An unexpected error occurred. Please try again.",
    };
  }
}
