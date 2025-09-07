// Export all components for clean imports
export { OnboardingHeader } from "./onboarding-header";
export { OnboardingStepContent } from "./onboarding-step-content";
export { OnboardingIllustration } from "./onboarding-illustration";
export { ContinueButton } from "./continue-button";
export { LoadingScreen } from "./loading-screen";
export { MealPreferenceSelector } from "./meal-preference-selector";
export { GoalSelector } from "./goal-selector";
export { RadioOptionSelector } from "./radio-option-selector";

// Export hooks
export { useOnboarding } from "./hooks/useOnboarding";

// Export types
export type {
  OnboardingStep,
  OnboardingAnswers,
  OnboardingState,
  MealOption,
  OnboardingStepConfig
} from "./types";

// Export constants
export {
  ONBOARDING_STEPS,
  INITIAL_ANSWERS,
  MEAL_OPTIONS,
  GOAL_OPTIONS,
  PEOPLE_OPTIONS,
  MEALS_PER_WEEK_OPTIONS,
  SHOPPING_FREQUENCY_OPTIONS
} from "./constants";
