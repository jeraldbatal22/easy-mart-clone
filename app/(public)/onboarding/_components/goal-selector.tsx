import { Button } from "@/components/ui/button";

interface GoalSelectorProps {
  options: string[];
  selectedGoals: string[];
  onToggle: (goal: string) => void;
}

export const GoalSelector = ({
  options,
  selectedGoals,
  onToggle
}: GoalSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-3 max-w-2xl">
      {options.map((goal) => {
        const isSelected = selectedGoals.includes(goal);
        return (
          <Button
            variant="ghost"
            key={goal}
            onClick={() => onToggle(goal)}
            className={`
              rounded-full px-4 py-2 text-sm font-medium transition-all duration-200
              ${isSelected
                ? "bg-purple-100 border-2 border-purple-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent"
              }
            `}
            aria-pressed={isSelected}
            aria-label={`Select goal: ${goal}`}
          >
            {goal}
          </Button>
        );
      })}
    </div>
  );
};
