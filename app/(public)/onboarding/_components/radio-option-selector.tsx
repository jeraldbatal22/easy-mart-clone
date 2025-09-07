import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface RadioOptionSelectorProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export const RadioOptionSelector = ({
  options,
  selectedValue,
  onSelect,
}: RadioOptionSelectorProps) => {
  console.log(selectedValue, options);
  return (
    <RadioGroup
      className="max-w-2xl space-y-3"
      value={selectedValue}
      onValueChange={onSelect}
    >
      {options.map((option) => (
        <label
          key={option}
          className={cn(
            selectedValue === option
              ? "!bg-primary-100 border-2 border-primary-300"
              : "",
            "flex items-center justify-between rounded-full bg-gray-50 px-6 py-4 text-base font-medium text-gray-800 hover:bg-gray-100 cursor-pointer "
          )}
        >
          <span>{option}</span>
          <RadioGroupItem value={option} className={cn(selectedValue === option ? "!text-primary-600" : "!text-gray-300")} />
        </label>
      ))}
    </RadioGroup>
  );
};
