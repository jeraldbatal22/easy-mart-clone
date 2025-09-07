# Onboarding Components Architecture

This directory contains a modular, professional architecture for the onboarding flow following React best practices.

## 📁 Structure

```
_components/
├── types.ts                    # TypeScript interfaces and types
├── constants.ts                # Configuration and static data
├── hooks/
│   └── useOnboarding.ts        # Custom hook for state management
├── OnboardingHeader.tsx        # Header with progress and navigation
├── OnboardingStepContent.tsx   # Main content renderer
├── OnboardingIllustration.tsx  # Right-side illustrations
├── ContinueButton.tsx          # Continue button component
├── LoadingScreen.tsx           # Loading state component
├── MealPreferenceSelector.tsx  # Q1: Meal selection grid
├── GoalSelector.tsx            # Q2: Goal tags selector
├── RadioOptionSelector.tsx     # Q3-Q5: Radio button groups
├── index.ts                    # Clean exports
└── README.md                   # This documentation
```

## 🏗️ Architecture Principles

### 1. **Separation of Concerns**
- **Types**: All TypeScript interfaces in one place
- **Constants**: Configuration and static data separated
- **Hooks**: Business logic and state management
- **Components**: Pure UI components with minimal logic

### 2. **Single Responsibility**
Each component has one clear purpose:
- `OnboardingHeader`: Navigation and progress
- `MealPreferenceSelector`: Multi-select meal grid
- `GoalSelector`: Multi-select goal tags
- `RadioOptionSelector`: Single-select radio groups

### 3. **Custom Hook Pattern**
`useOnboarding` encapsulates all state management:
- Step navigation
- Answer tracking
- Validation logic
- Progress calculation

### 4. **Type Safety**
Strong TypeScript typing throughout:
- `OnboardingStep`: Union type for step IDs
- `OnboardingAnswers`: Structured answer interface
- `OnboardingStepConfig`: Step configuration interface

## 🔧 Usage

### Main Page (Clean & Simple)
```tsx
const OnboardingPage = () => {
  const {
    state,
    currentStep,
    progress,
    canContinue,
    nextStep,
    prevStep,
    selectSingle,
    toggleMultiSelect
  } = useOnboarding();

  return (
    <div>
      <OnboardingHeader {...headerProps} />
      <OnboardingStepContent {...contentProps} />
      <ContinueButton {...buttonProps} />
      <OnboardingIllustration {...illustrationProps} />
    </div>
  );
};
```

### Adding New Steps
1. Add step to `ONBOARDING_STEPS` in `constants.ts`
2. Add step ID to `OnboardingStep` type
3. Add validation logic to `useOnboarding` hook
4. Create new selector component if needed

## 🎯 Benefits

### ✅ **Maintainability**
- Clear file organization
- Single responsibility components
- Easy to locate and modify code

### ✅ **Reusability**
- Components can be reused across different flows
- Custom hook can be used in other onboarding contexts
- Type definitions are shareable

### ✅ **Testability**
- Each component can be tested in isolation
- Custom hook can be tested independently
- Clear interfaces make mocking easier

### ✅ **Scalability**
- Easy to add new steps or question types
- Configuration-driven approach
- Modular architecture supports growth

### ✅ **Developer Experience**
- Strong TypeScript support
- Clean imports via index.ts
- Self-documenting code structure

## 🚀 Best Practices Implemented

1. **Component Composition**: Small, focused components
2. **Custom Hooks**: Business logic separation
3. **TypeScript**: Full type safety
4. **Accessibility**: ARIA labels and semantic HTML
5. **Performance**: Optimized re-renders with useCallback
6. **Clean Code**: No spaghetti code, clear naming
7. **Documentation**: Self-documenting structure

## 🔄 State Flow

```
useOnboarding Hook
├── Manages current step index
├── Tracks user answers
├── Calculates progress
├── Handles navigation
└── Provides validation

Components
├── Receive props from hook
├── Handle user interactions
├── Call hook methods
└── Render UI based on state
```

This architecture eliminates spaghetti code and provides a professional, maintainable foundation for the onboarding experience.
