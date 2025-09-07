"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signupWithEmail, signupWithPhone } from "./actions";
import { useRouter } from "next/navigation";

type SignupMethod = "email" | "phone";

const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

const phoneSchema = z.object({
  phone: z
    .string()
    .min(8, "Enter a valid phone")
    .max(20, "Enter a valid phone"),
});

type EmailForm = z.infer<typeof emailSchema>;
type PhoneForm = z.infer<typeof phoneSchema>;

export default function SignupPage() {
  const [method, setMethod] = useState<SignupMethod>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

  const phoneForm = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
    mode: "onSubmit",
  });

  const onSubmitEmail = async (values: EmailForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("email", values.email);

      const result = await signupWithEmail(formData);

      if (result.success) {
        // Redirect to OTP page with email parameters
        router.push(
          `/otp?type=email&identifier=${encodeURIComponent(values.email)}`
        );
      } else {
        setError(result.error || "Failed to register with email");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPhone = async (values: PhoneForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("phone", values.phone);

      const result = await signupWithPhone(formData);

      if (result.success) {
        // Redirect to OTP page with phone parameters
        router.push(
          `/otp?type=phone&identifier=${encodeURIComponent(values.phone)}`
        );
      } else {
        setError(result.error || "Failed to register with phone");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-84px)] bg-white">
      <div className="px-4 sm:px-6">
        <div className="min-h-[calc(100vh-92px)] flex items-center justify-center">
          <div className="w-full flex justify-center">
            <div className="w-full max-w-md">
              <h1 className="text-2xl font-semibold text-start">Sign up</h1>
              <div className="mt-6 w-full rounded-2xl border border-neutral-200 p-4 sm:p-6 shadow-sm">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
                <div className="flex gap-2 flex-col sm:flex-row">
                  <Button
                    variant="ghost"
                    onClick={() => setMethod("email")}
                    className={cn(
                      "w-full sm:w-auto",
                      method === "email"
                        ? "!bg-primary-50 !text-primary-500 border-1 border-primary-500"
                        : "!bg-gray-50 !text-black"
                    )}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    <span>Email</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setMethod("phone")}
                    className={cn(
                      "w-full sm:w-auto",
                      method === "phone"
                        ? "!bg-primary-50 !text-primary-500 border-1 border-primary-500"
                        : "!bg-gray-50 !text-black"
                    )}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    <span>Phone</span>
                  </Button>
                </div>

                {method === "email" ? (
                  <form
                    onSubmit={emailForm.handleSubmit(onSubmitEmail)}
                    className="mt-5 space-y-4"
                  >
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      {...emailForm.register("email")}
                      type="email"
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-[#a21caf]"
                    />
                    {emailForm.formState.errors.email && (
                      <p className="text-sm text-red-600">
                        {emailForm.formState.errors.email.message}
                      </p>
                    )}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="mt-2 h-12 w-full gap-2 rounded-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Signing up...</span>
                        </>
                      ) : (
                        <>
                          <span>Continue</span>
                          <span aria-hidden>→</span>
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <form
                    onSubmit={phoneForm.handleSubmit(onSubmitPhone)}
                    className="mt-5 space-y-4"
                  >
                    <label className="block text-sm font-medium">Phone</label>
                    <input
                      {...phoneForm.register("phone")}
                      type="tel"
                      placeholder="Enter your phone"
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-[#a21caf]"
                    />
                    {phoneForm.formState.errors.phone && (
                      <p className="text-sm text-red-600">
                        {phoneForm.formState.errors.phone.message}
                      </p>
                    )}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="mt-2 w-full h-12 gap-2 rounded-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Signing up...</span>
                        </>
                      ) : (
                        <>
                          <span>Continue</span>
                          <span aria-hidden>→</span>
                        </>
                      )}
                    </Button>
                  </form>
                )}

                <div className="relative mt-8 text-center text-sm text-neutral-500">
                  <span className="bg-white px-2">Or</span>
                  <div className="absolute inset-x-0 top-1/2 -z-10 h-px -translate-y-1/2 bg-neutral-200" />
                </div>

                <div className="mt-5 space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full h-13 bg-gray-50 hover:bg-gray-100 rounded-full px-4 py-3 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 256 256"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        fill="#633cd9"
                        d="M226.4 181.4c-11.3 0-20.6-9.9-29.8-22.3c-1.1-1.5-2.2-3.1-3.3-4.6c-12.8-17.7-26.5-36.1-41.6-36.1c-15.4 0-24.5 17.2-32.4 32.5c-8.5 16.3-16 31-28.7 31c-11.9 0-20.2-16.2-20.2-40.8c0-32.6 16.6-58.6 39.6-58.6c18.2 0 29.1 12.7 41.7 29.2l3.7 4.8c11.3 14.6 23.5 30.3 33.7 30.3c11.2 0 18.9-12.4 18.9-31.1c0-30.8-20.9-55.1-50.4-55.1c-21.7 0-40.9 13.3-55.9 27.1c-15 13.8-29.5 31.9-44.6 31.9c-10.3 0-18.3-8.4-18.3-18.8c0-9.9 7.6-18.2 17.2-18.7c3.8-.2 6.9 2.8 7.1 6.6c.2 3.8-2.8 6.9-6.6 7.1c-2.9.2-5.2 2.6-5.2 5.6c0 3.1 2.5 5.6 5.6 5.6c10.2 0 23.9-14.5 37.5-27c16.7-15.3 38.7-31.9 63.2-31.9c38.3 0 65.4 30.4 65.4 70.6c0 26.1-13.6 44.1-33.1 44.1c-12.5 0-22.2-10.5-31.8-23.7c12 19.4 25.5 45.9 44.3 45.9c4 0 7.2 3.2 7.2 7.2c0 4-3.2 7.2-7.2 7.2Z"
                      />
                    </svg>
                    <span>Sign up with Meta</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full h-13 bg-gray-50 hover:bg-gray-100 rounded-full px-4 py-3 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
                      <path
                        fill="#FFC107"
                        d="M43.6 20.5H42V20H24v8h11.3C33.6 32.4 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.7 2.9l5.7-5.7C33.7 6.1 29.1 4 24 4C12.9 4 4 12.9 4 24s8.9 20 20 20s20-8.9 20-20c0-1.2-.1-2.1-.4-3.5z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.3 14.7L12.9 19.5C14.7 15.1 19 12 24 12c3 0 5.7 1.1 7.7 2.9l5.7-5.7C33.7 6.1 29.1 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24 44c5 0 9.6-1.9 13.1-5l-6-4.9c-2.1 1.4-4.8 2.2-7.1 2.2c-5.1 0-9.5-3.6-11.1-8.4l-6.6 5.1C9.7 39.7 16.3 44 24 44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.2-4.1 5.8-7.3 7.1l.1.1l6 4.9c-.4.3 7.9-4.6 7.9-14c0-1.2-.1-2.1-.4-3.5z"
                      />
                    </svg>
                    <span>Sign up with Google</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
