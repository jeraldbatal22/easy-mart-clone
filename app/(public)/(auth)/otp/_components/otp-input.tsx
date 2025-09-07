"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";

interface OtpInputProps {
  inputCount?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
}

export default function OtpInput({ 
  inputCount = 4, 
  onComplete, 
  disabled = false 
}: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(inputCount).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    Array(inputCount).fill(null)
  );

  // const isComplete = values.every((v) => v.length === 1);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // allow single digit only

    const next = [...values];
    next[index] = value;
    setValues(next);

    if (value && index < inputCount - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all inputs are filled
    const newValues = [...next];
    if (newValues.every((v) => v.length === 1)) {
      onComplete(newValues.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
      e.preventDefault();
    }
    if (e.key === "ArrowRight" && index < inputCount - 1) {
      inputRefs.current[index + 1]?.focus();
      e.preventDefault();
    }
  };

  const clearInputs = () => {
    setValues(Array(inputCount).fill(""));
    inputRefs.current[0]?.focus();
  };

  // Expose clearInputs method to parent component
  if (typeof window !== "undefined") {
    (window as any).clearOtpInputs = clearInputs;
  }

  return (
    <div className="flex items-center gap-3">
      {values.map((val, idx) => (
        <Input
          key={idx}
          ref={(el) => {
            inputRefs.current[idx] = el;
          }}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={val}
          onChange={(e) =>
            handleChange(idx, e.target.value.slice(-1))
          }
          onKeyDown={(e) => handleKeyDown(idx, e)}
          disabled={disabled}
          className="h-14 w-14 rounded-xl border border-neutral-300 text-center text-lg font-semibold outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:opacity-50"
        />
      ))}
    </div>
  );
}
