"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signinAction } from "./actions";
import { toast } from "sonner";

type SigninMethod = "email" | "phone";

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

export default function SigninPage() {
  const [method] = useState<SigninMethod>("email");
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for token expiration reason and show toast
  useEffect(() => {
    const reason = searchParams.get("reason");
    if (reason === "token_expired") {
      toast.error("Session expired", {
        richColors: true,
        position: "top-center",
        description: "Your session has expired. Please sign in again.",
        duration: 5000,
      });
    } else if (reason === "invalid_token") {
      toast.error("Invalid session", {
        richColors: true,
        position: "top-center",
        description: "Your session is invalid. Please sign in again.",
        duration: 5000,
      });
    }
  }, [searchParams]);

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
    setError("");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("identifier", values.email);
      formData.append("type", "email");

      const result = await signinAction(formData);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        router.push(
          `/otp?type=email&identifier=${encodeURIComponent(values.email)}`
        );
      }
    });
  };

  const onSubmitPhone = async (values: PhoneForm) => {
    setError("");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("identifier", values.phone);
      formData.append("type", "phone");

      const result = await signinAction(formData);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        router.push(
          `/otp?type=phone&identifier=${encodeURIComponent(values.phone)}`
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl">
            <div className="space-y-2 text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
                Welcome back
              </p>
              <h1 className="text-3xl font-semibold text-gray-900">Sign in</h1>
              <p className="text-sm text-gray-500">
                Enter your email to receive a one-time sign in link.
              </p>
            </div>
            <div className="mt-6 w-full">
              {/* <div className="flex gap-2 flex-col sm:flex-row">
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
              </div> */}
              {error && (
                <Alert variant="destructive" className="my-5 text-red-500">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {method === "email" ? (
                <form
                  onSubmit={emailForm.handleSubmit(onSubmitEmail)}
                  className="mt-5 space-y-4"
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    {...emailForm.register("email")}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-sm text-red-600">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="mt-4 h-12 w-full gap-2 rounded-full bg-purple-600 text-white hover:bg-purple-700"
                  >
                    <span>{isPending ? "Sending..." : "Continue"}</span>
                    <span aria-hidden>→</span>
                  </Button>
                </form>
              ) : (
                <form
                  onSubmit={phoneForm.handleSubmit(onSubmitPhone)}
                  className="mt-5 space-y-4"
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    {...phoneForm.register("phone")}
                    type="tel"
                    placeholder="Enter your phone"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />
                  {phoneForm.formState.errors.phone && (
                    <p className="text-sm text-red-600">
                      {phoneForm.formState.errors.phone.message}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="mt-4 w-full h-12 gap-2 rounded-full bg-purple-600 text-white hover:bg-purple-700"
                  >
                    <span>{isPending ? "Sending..." : "Continue"}</span>
                    <span aria-hidden>→</span>
                  </Button>
                </form>
              )}
            </div>
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-purple-600 hover:underline"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-gray-400">
            Trouble signing in?{" "}
            <Link
              href="/support"
              className="font-medium text-purple-500 hover:underline"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
