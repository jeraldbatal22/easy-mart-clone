"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SidebarFiltersProps {
  selectedFilters: {
    deals: boolean;
    newArrivals: boolean;
    nearMe: boolean;
    price: string;
    madeIn: string;
  };
  onFilterChange: (filterType: string, value: any) => void;
  onReset: () => void;
}

export const SidebarFilters = ({
  selectedFilters,
  onFilterChange,
  onReset,
}: SidebarFiltersProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <Button
          variant="ghost"
          onClick={onReset}
          className="text-sm text-primary-500 hover:text-primary-600"
        >
          Reset
        </Button>
      </div>

      {/* Deals Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Deals</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="deals"
              checked={selectedFilters.deals}
              onCheckedChange={(checked) => onFilterChange('deals', checked)}
            />
            <Label htmlFor="deals" className="text-sm text-gray-600">
              Deals
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="newArrivals"
              checked={selectedFilters.newArrivals}
              onCheckedChange={(checked) => onFilterChange('newArrivals', checked)}
            />
            <Label htmlFor="newArrivals" className="text-sm text-gray-600">
              New Arrivals
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="nearMe"
              checked={selectedFilters.nearMe}
              onCheckedChange={(checked) => onFilterChange('nearMe', checked)}
            />
            <Label htmlFor="nearMe" className="text-sm text-gray-600">
              Near Me
            </Label>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Price</h4>
        <RadioGroup
          value={selectedFilters.price}
          onValueChange={(value) => onFilterChange('price', value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="price-all" />
            <Label htmlFor="price-all" className="text-sm text-gray-600">
              All
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4-12" id="price-4-12" />
            <Label htmlFor="price-4-12" className="text-sm text-gray-600">
              $4-12
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4-above" id="price-4-above" />
            <Label htmlFor="price-4-above" className="text-sm text-gray-600">
              $4 & Above
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Made in Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Made in</h4>
        <RadioGroup
          value={selectedFilters.madeIn}
          onValueChange={(value) => onFilterChange('madeIn', value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="madein-all" />
            <Label htmlFor="madein-all" className="text-sm text-gray-600">
              All
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="usa" id="madein-usa" />
            <Label htmlFor="madein-usa" className="text-sm text-gray-600">
              United States
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="canada" id="madein-canada" />
            <Label htmlFor="madein-canada" className="text-sm text-gray-600">
              Canada
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mexico" id="madein-mexico" />
            <Label htmlFor="madein-mexico" className="text-sm text-gray-600">
              Mexico
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
