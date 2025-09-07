import { OnboardingStepConfig, OnboardingAnswers } from "./types";
import { MealPreferenceSelector } from "./meal-preference-selector";
import { GoalSelector } from "./goal-selector";
import { RadioOptionSelector } from "./radio-option-selector";

interface OnboardingStepContentProps {
  step: OnboardingStepConfig;
  answers: OnboardingAnswers;
  onSelectSingle: (key: keyof OnboardingAnswers, value: string) => void;
  onToggleMultiSelect: (key: keyof OnboardingAnswers, value: string) => void;
}

export const OnboardingStepContent = ({
  step,
  answers,
  onSelectSingle,
  onToggleMultiSelect
}: OnboardingStepContentProps) => {
 

  const renderQuestionContent = () => {
    switch (step.id) {
      case "q1":
        return (
          <MealPreferenceSelector
            options={step.options as any[]}
            selectedMeals={answers.q1}
            onToggle={(mealId) => onToggleMultiSelect("q1", mealId)}
          />
        );

      case "q2":
        return (
          <GoalSelector
            options={step.options as string[]}
            selectedGoals={answers.q2}
            onToggle={(goal) => onToggleMultiSelect("q2", goal)}
          />
        );

      case "q3":
        return (
          <RadioOptionSelector
            options={step.options as string[]}
            selectedValue={answers.q3}
            onSelect={(value) => onSelectSingle("q3", value)}
          />
        );

      case "q4": 
        return (
          <RadioOptionSelector
            options={step.options as string[]}
            selectedValue={answers.q4}
            onSelect={(value) => onSelectSingle("q4", value)}
          />
        );

      case "q5":
        return (
          <RadioOptionSelector
            options={step.options as string[]}
            selectedValue={answers.q5}
            onSelect={(value) => onSelectSingle("q5", value)}
          />
        );

      default:
        return null;
    }
  };

  return (
    step.type !== "loading" && <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 leading-tight">
        {step.title}
      </h1>
      {renderQuestionContent()}
    </div>
  );
};
