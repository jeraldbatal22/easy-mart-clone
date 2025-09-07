import { ChevronLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface OnboardingHeaderProps {
  currentStepIndex: number;
  progress: number;
  onPrevious: () => void;
  canGoBack: boolean;
}

export const OnboardingHeader = ({
  currentStepIndex,
  progress,
  onPrevious,
  canGoBack
}: OnboardingHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="text-sm text-gray-500 mb-4">
        Onboarding/Q{currentStepIndex + 1}
      </div>
      <div className="flex items-center gap-4">
        {canGoBack ? (
          <button
            onClick={onPrevious}
            className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label="Go to previous step"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : (
          <div className="h-9 w-9" />
        )}
        <div className="flex-1">
          <Progress value={progress} className="h-2" />
        </div>
        <div className="h-9 w-9" />
      </div>
    </div>
  );
};
