"use client";

import {
  useOnboarding,
  OnboardingHeader,
  OnboardingStepContent,
  OnboardingIllustration,
  ContinueButton,
  LoadingScreen,
} from "./_components";

const OnboardingPage = () => {
  const {
    state,
    currentStep,
    progress,
    canContinue,
    nextStep,
    prevStep,
    selectSingle,
    toggleMultiSelect,
  } = useOnboarding();

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <OnboardingHeader
          currentStepIndex={state.currentStepIndex}
          progress={progress}
          onPrevious={prevStep}
          canGoBack={state.currentStepIndex > 0}
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <OnboardingStepContent
              step={currentStep}
              answers={state.answers}
              onSelectSingle={selectSingle}
              onToggleMultiSelect={toggleMultiSelect}
            />

            {currentStep.id !== "loading" && (
              <ContinueButton
                onContinue={nextStep}
                disabled={!canContinue}
                currentStepIndex={state.currentStepIndex}
              />
            )}
          </div>

          <div className="hidden lg:block">
            <OnboardingIllustration
              step={currentStep.id}
              imagePath={currentStep.imagePath}
            />
          </div>
        </div>

        {currentStep.type === "loading" && <LoadingScreen />}
      </div>
    </div>
  );
};

export default OnboardingPage;
