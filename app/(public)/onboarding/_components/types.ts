export type OnboardingStep = "q1" | "q2" | "q3" | "q4" | "q5" | "loading";

export interface MealOption {
  id: string;
  name: string;
  icon: string;
}

export interface OnboardingAnswers {
  q1: string[]; // Meal preferences (multi-select)
  q2: string[]; // Goals (multi-select)
  q3: string;   // People count (single-select)
  q4: string;   // Meals per week (single-select)
  q5: string;   // Shopping frequency (single-select)
}

export interface OnboardingStepConfig {
  id: OnboardingStep;
  title: string;
  type: "multi-select" | "single-select" | "loading";
  options?: string[] | MealOption[];
  imagePath?: string;
}

export interface OnboardingState {
  currentStepIndex: number;
  answers: OnboardingAnswers;
  isComplete: boolean;
}
