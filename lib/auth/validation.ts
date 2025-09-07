import { z } from "zod";

// Common validation schemas
export const identifierSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),
  type: z.enum(["email", "phone"]).optional(),
});

export const otpValidationSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),
  code: z.string().min(4, "Code must be at least 4 characters").max(8, "Code must be at most 8 characters"),
  type: z.enum(["email", "phone"]).optional(),
});

export const resendSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),
});

// Validation functions
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  // Remove spaces, dashes, parentheses, and dots
  const cleaned = phone.replace(/[\s\-().]/g, "");

  // E.164 format: +[country][number], e.g., +12345678900 or +639171234567 (PH)
  const e164Regex = /^\+[1-9]\d{9,14}$/;

  // PH local format: 09XXXXXXXXX (11 digits, starts with 09)
  const phLocalRegex = /^09\d{9}$/;

  // Accept both E.164 and PH local
  return e164Regex.test(cleaned) || phLocalRegex.test(cleaned);
}

export function getIdentifierType(identifier: string): "email" | "phone" {
  if (isValidEmail(identifier)) {
    return "email";
  } else if (isValidPhone(identifier)) {
    return "phone";
  } else {
    throw new Error("Invalid email or phone format");
  }
}

export function generateVerificationCode(length: number = 4): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

// Constants
export const VERIFICATION_CODE_LENGTH = 4;
export const VERIFICATION_CODE_EXPIRY_MINUTES = 10;
export const MAX_VERIFICATION_ATTEMPTS = 3;
