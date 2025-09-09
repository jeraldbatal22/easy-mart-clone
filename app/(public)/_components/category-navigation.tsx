"use client";

import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { LoadingSkeleton } from "../../../components/common/LoadingSpinner";
import { ErrorBoundary } from "../../../components/common/ErrorBoundary";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Category {
  id: string;
  name: string;
  icon: string;
  imageUrl?: string;
}

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

  // API categories state
  const [fetchedCategories, setFetchedCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        setCategoriesError(null);
        const res = await fetch("/api/category/grocery?limit=20");
        const json = await res.json();
        if (!res.ok || !json?.success) {
          throw new Error(json?.error || "Failed to fetch categories");
        }
        const list = Array.isArray(json?.data?.categories)
          ? json.data.categories
          : [];
        const mapped: Category[] = list.map((c: any) => ({
          id: String(c._id || c.id || ""),
          name: String(c.name || ""),
          icon: "🛒",
          imageUrl: c.imageUrl ? String(c.imageUrl) : undefined,
        }));
        if (!isCancelled) setFetchedCategories(mapped);
      } catch (err: any) {
        if (!isCancelled)
          setCategoriesError(err?.message || "Something went wrong");
      } finally {
        if (!isCancelled) setIsLoadingCategories(false);
      }
    };
    fetchCategories();
    return () => {
      isCancelled = true;
    };
  }, []);

  if (isLoadingCategories) {
    return (
      <section className="py-6 px-8 w-full">
        <LoadingSkeleton lines={2} itemClassName="h-10 w-32 rounded-full" className="flex"/>
      </section>
    );
  }

  return (
    <ErrorBoundary>
      <section className="py-6">
        {categoriesError && (
          <Alert variant="destructive">
            <AlertDescription>{categoriesError}</AlertDescription>
          </Alert>
        )}
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
            {fetchedCategories.length > 1 && fetchedCategories.map(
              (category: Category) => (
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
                flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all duration-200
                ${
                  selectedCategory === category.name
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-purple-300"
                }
              `}
                >
                  {/* <span className="text-lg">{category.icon}</span> */}
                  {category.imageUrl && (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      width={18}
                      height={18}
                    />
                  )}
                  <span className="text-sm font-medium whitespace-nowrap">
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
