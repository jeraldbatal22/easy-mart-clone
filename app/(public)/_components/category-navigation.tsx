"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { LoadingSkeleton } from "../../../components/common/LoadingSpinner";
import { ErrorBoundary } from "../../../components/common/ErrorBoundary";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useDeviceDetect from "@/lib/hooks/useDeviceDetect";
import { useFetchCategories } from "@/lib/hooks/useProductsQuery";

interface CategoryNavigationProps {
  selectedCategory?: string;
  onCategoryChange?: (categoryName: string) => void;
}

export const CategoryNavigation = ({
  selectedCategory: controlledSelected,
  onCategoryChange,
}: CategoryNavigationProps) => {
  const [uncontrolledSelected, setUncontrolledSelected] = useState("");
  const selectedCategory = controlledSelected ?? uncontrolledSelected;

  // Use the new useFetchCategories hook
  const {
    categories: fetchedCategories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useFetchCategories({
    limit: 20,
    enabled: true,
  });

  const { isMobile } = useDeviceDetect();

  if (isLoadingCategories) {
    return (
      <section className="pt-4 lg:pt-6 pb-0 px-4 lg:px-8 w-76 md:w-auto">
        <LoadingSkeleton lines={1} columns={isMobile ? 2 : 5} itemClassName="h-10 w-32 rounded-full" className="flex"/>
      </section>
    );
  }

  return (
    <ErrorBoundary>
      <section className="pt-4 lg:pt-6 pb-0 px-4 lg:px-8">
        {categoriesError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{categoriesError}</AlertDescription>
          </Alert>
        )}
        <div className="">
          <div className="flex space-x-2 w-76 md:w-auto lg:space-x-3 overflow-x-auto scrollbar-hide pb-2">
            {fetchedCategories.length > 1 && fetchedCategories.map(
              (category) => (
                <Button
                  variant="ghost"
                  key={category.id}
                  onClick={() => {
                    if (onCategoryChange) {
                      onCategoryChange(category.name);
                    } else {
                      setUncontrolledSelected(category.name);
                    }
                  }}
                  className={`
                flex-shrink-0 flex items-center space-x-1 lg:space-x-2 px-3 lg:px-4 py-2 rounded-full border-2 transition-all duration-200
                ${
                  selectedCategory === category.name
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-purple-300"
                }
              `}
                >
                  {category.imageUrl && (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      width={isMobile ? 16 : 18}
                      height={isMobile ? 16 : 18}
                      className="flex-shrink-0"
                    />
                  )}
                  <span className="text-xs lg:text-sm font-medium whitespace-nowrap">
                    {category.name}
                  </span>
                </Button>
              )
            )}
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};
