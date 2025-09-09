import { redirect } from "next/navigation";
import OtpForm from "./_components/otp-form";
import BackButton from "./_components/back-button";

interface OtpPageProps {
  searchParams: {
    type?: string;
    identifier?: string;
  };
}

export default async function OtpPage({
  searchParams,
}: {
  searchParams:
    | OtpPageProps["searchParams"]
    | Promise<OtpPageProps["searchParams"]>;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const { type, identifier } = resolvedSearchParams;

  // Validate required parameters
  if (!type || !identifier) {
    redirect("/signin");
  }

  // Validate type parameter
  if (type !== "email" && type !== "phone") {
    redirect("/signin");
  }

  return (
    <div className="w-full min-h-[calc(100vh-84px)] bg-white">
      <div className="px-4 sm:px-6">
        <div className="min-h-[calc(100vh-92px)] flex items-start justify-center">
          <div className="w-full max-w-sm pt-6">
            <BackButton />

            <h1 className="mt-6 text-2xl font-semibold">
              Check your {type === "email" ? "email" : "phone"}
            </h1>

            <OtpForm identifier={identifier} type={type as "email" | "phone"} />
          </div>
        </div>
      </div>
    </div>
  );
}
