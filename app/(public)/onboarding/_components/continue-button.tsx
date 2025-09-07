import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContinueButtonProps {
  onContinue: () => void;
  disabled: boolean;
  currentStepIndex: number;
}

export const ContinueButton = ({
  onContinue,
  disabled,
  currentStepIndex,
}: ContinueButtonProps) => {
  return (
    <div className="pt-6">
      <Button
        onClick={onContinue}
        disabled={disabled}
        className={`
          rounded-full px-8 py-3 text-base font-medium transition-all duration-200
          ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }
        `}
      >
        {currentStepIndex === 4 ? "Start" : "Continue"}
        <ChevronRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
};
