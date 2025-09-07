import { Button } from "@/components/ui/button";
import { MealOption } from "./types";

interface MealPreferenceSelectorProps {
  options: MealOption[];
  selectedMeals: string[];
  onToggle: (mealId: string) => void;
}

export const MealPreferenceSelector = ({
  options,
  selectedMeals,
  onToggle
}: MealPreferenceSelectorProps) => {
  return (
    <div className="grid grid-cols-4 gap-4 max-w-2xl">
      {options.map((meal) => {
        const isSelected = selectedMeals.includes(meal.id);
        return (
          <Button
            variant="ghost"
            key={meal.id}
            onClick={() => onToggle(meal.id)}
            className={`
              w-20 h-20 rounded-xl transition-all duration-200
              flex flex-col items-center justify-center space-y-2
              ${isSelected
                ? "border-1 border-primary-500 bg-purple-50 shadow-md"
                : "bg-gray-50 hover:border-purple-300 hover:shadow-sm"
              }
            `}
            aria-pressed={isSelected}
            aria-label={`Select ${meal.name}`}
          >
            <span className="text-2xl" role="img" aria-label={meal.name}>
              {meal.icon}
            </span>
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">
              {meal.name}
            </span>
          </Button>
        );
      })}
    </div>
  );
};
