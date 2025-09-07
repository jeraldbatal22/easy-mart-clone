"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import OtpInput from "./otp-input";
import { verifyOtp, resendOtp } from "../actions";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/slices/authSlice";
import { setAuthCookies } from "@/lib/utils/cookies";
import { useRouter } from "next/navigation";

interface OtpFormProps {
  identifier: string;
  type: "email" | "phone";
}

export default function OtpForm({ identifier, type }: OtpFormProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [otp, setOtp] = useState<string>("");

  const handleOtpComplete = (otpCode: string) => {
    setOtp(otpCode);
  };

  const handleVerify = () => {
    if (!otp || otp.length !== 4) return;

    setError("");
    setSuccess("");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("identifier", identifier);
      formData.append("code", otp);
      formData.append("type", type);

      const result = await verifyOtp(formData);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        // Store credentials in Redux store
        dispatch(
          setCredentials({
            user: result.data?.user,
            token: result.data?.token,
            refreshToken: result.data?.refreshToken || undefined, // Add refreshToken if available
          })
        );

        // Immediately save to cookies after successful verification
        setAuthCookies({
          token: result.data?.token,
          refreshToken: result.data?.refreshToken || undefined,
          userData: result.data?.user,
        });

        setSuccess("OTP verified successfully!");

        // Redirect to onboarding after a short delay
        setTimeout(() => {
          router.push("/onboarding");
        }, 1000);
      }

      // if (result?.success === false) {
      //   setError(result.error || "Failed to verify OTP");
      // }else if (result?.success) {
      //   router.push(`/otp?typ=email&identifier=${encodeURIComponent(values.email)}`);
      // }
    });
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    setIsResending(true);

    try {
      const formData = new FormData();
      formData.append("identifier", identifier);

      const result = await resendOtp(formData);

      if (result?.success) {
        setSuccess(result.message || "New verification code sent!");
        // Clear the OTP inputs
        if (typeof window !== "undefined" && (window as any).clearOtpInputs) {
          (window as any).clearOtpInputs();
        }
        setOtp("");
      } else {
        setError(result?.error || "Failed to resend code");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsResending(false);
    }
  };

  const isComplete = otp.length === 4;

  return (
    <div className="mt-4 rounded-2xl border border-neutral-200 p-5 shadow-sm">
      <p className="text-sm text-neutral-600">We sent a 4-digit code to</p>
      <p className="mt-1 text-sm font-medium">{identifier}</p>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="my-5 text-red-500">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert className="mt-4" variant="default">
          <AlertDescription className="text-green-700">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-5">
        <OtpInput onComplete={handleOtpComplete} disabled={isPending} />
      </div>

      <Button
        disabled={!isComplete || isPending}
        className="mt-5 w-full h-12 rounded-full"
        onClick={handleVerify}
      >
        {isPending ? "Verifying..." : "Verify"}
      </Button>

      <p className="mt-4 text-xs text-neutral-600">
        Haven&apos;t received your code?{" "}
        <button
          onClick={handleResend}
          disabled={isResending}
          className="ml-1 text-primary-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending ? "Sending..." : "Request a New Code"}
        </button>
      </p>
    </div>
  );
}
