"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      type="button"
      onClick={() => router.back()}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border text-black border-neutral-200 hover:bg-neutral-50"
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4 !text-red-500" />
    </Button>
  );
}
