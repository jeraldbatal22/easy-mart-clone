import { useState, useMemo, useCallback } from "react";
import { OnboardingStep, OnboardingAnswers, OnboardingState } from "../types";
import { ONBOARDING_STEPS, INITIAL_ANSWERS } from "../constants";

export const useOnboarding = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(INITIAL_ANSWERS);

  const currentStep = ONBOARDING_STEPS[currentStepIndex];
  const progress = useMemo(
    () => Math.min((currentStepIndex / (ONBOARDING_STEPS.length - 1)) * 100, 100),
    [currentStepIndex]
  );

  const isComplete = useMemo(
    () => currentStepIndex >= ONBOARDING_STEPS.length - 1,
    [currentStepIndex]
  );

  const canContinue = useCallback((step: OnboardingStep): boolean => {
    switch (step) {
      case "q1":
        return answers.q1.length > 0;
      case "q2":
        return answers.q2.length > 0;
      case "q3":
      case "q4":
      case "q5":
        return answers[step] !== "";
      case "loading":
        return true;
      default:
        return false;
    }
  }, [answers]);

  const nextStep = useCallback(() => {
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStepIndex]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const selectSingle = useCallback((key: keyof OnboardingAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleMultiSelect = useCallback((key: keyof OnboardingAnswers, value: string) => {
    setAnswers(prev => {
      const current = prev[key] as string[];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  }, []);

  const resetOnboarding = useCallback(() => {
    setCurrentStepIndex(0);
    setAnswers(INITIAL_ANSWERS);
  }, []);

  const state: OnboardingState = {
    currentStepIndex,
    answers,
    isComplete
  };
  
  return {
    state,
    currentStep,
    progress,
    canContinue: canContinue(currentStep.id),
    nextStep,
    prevStep,
    selectSingle,
    toggleMultiSelect,
    resetOnboarding
  };
};
