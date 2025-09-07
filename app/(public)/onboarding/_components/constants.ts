import { OnboardingStepConfig, MealOption } from "./types";

export const MEAL_OPTIONS: MealOption[] = [
  { id: "mushroom", name: "Mushroom", icon: "🍄" },
  { id: "fish", name: "Fish", icon: "🐟" },
  { id: "ham", name: "Ham", icon: "🥓" },
  { id: "meat", name: "Meat", icon: "🥩" },
  { id: "spaghetti", name: "Spaguetties", icon: "🍝" },
  { id: "shrimp", name: "Shrimp", icon: "🦐" },
  { id: "pizza", name: "Pizza", icon: "🍕" },
  { id: "chicken", name: "Chicken", icon: "🍗" },
];

export const GOAL_OPTIONS = [
  "Save time on shopping",
  "Eat healthier",
  "Try new recipes",
  "Save money",
  "Simplify meal planning",
  "Reduce food waste",
];

export const PEOPLE_OPTIONS = [
  "One Person",
  "2",
  "3-4",
  "5-6",
  "More than 6"
];

export const MEALS_PER_WEEK_OPTIONS = [
  "1-2 meals",
  "3-4 meals",
  "5-6 meals",
  "7-8 meals",
  "More than 10 meals"
];

export const SHOPPING_FREQUENCY_OPTIONS = [
  "Daily",
  "Every 2-3 days",
  "Once a week",
  "Every 2 weeks",
  "Once a month"
];

export const ONBOARDING_STEPS: OnboardingStepConfig[] = [
  {
    id: "q1",
    title: "What kind of meals do you prefer?",
    type: "multi-select",
    options: MEAL_OPTIONS,
    imagePath: "/assets/images/question-1-banner.png"
  },
  {
    id: "q2",
    title: "What are your goals with EasyMart?",
    type: "multi-select",
    options: GOAL_OPTIONS,
    imagePath: "/assets/images/question-2-banner.png"
  },
  {
    id: "q3",
    title: "How many people will be eating at the table?",
    type: "single-select",
    options: PEOPLE_OPTIONS,
    imagePath: "/assets/images/question-3-banner.png"
  },
  {
    id: "q4",
    title: "How many meals would you like per week?",
    type: "single-select",
    options: MEALS_PER_WEEK_OPTIONS,
    imagePath: "/assets/images/question-4-banner.png"
  },
  {
    id: "q5",
    title: "How often do you do shopping?",
    type: "single-select",
    options: SHOPPING_FREQUENCY_OPTIONS,
    imagePath: "/assets/images/question-5-banner.png"
  },
  {
    id: "loading",
    title: "Customizing your experience...",
    type: "loading"
  }
];

export const INITIAL_ANSWERS = {
  q1: [],
  q2: [],
  q3: "",
  q4: "",
  q5: ""
};
