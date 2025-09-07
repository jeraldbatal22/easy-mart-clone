"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { FreshnessGuaranteeCard } from "./freshness-guarantee-card";
import { Button } from "../../../components/ui/button";
import { ProductCard } from "../../../components/common/product/product-card";

interface ProductSectionProps {
  title: string;
  viewAllText?: string;
  showNavigation?: boolean;
  showFilters?: boolean;
  filters?: string[];
  selectedFilter?: string;
  onFilterChange?: (filter: string) => void;
  showFreshnessCard?: boolean;
  products: Array<{
    id: string;
    name: string;
    image: string;
    price: string;
    originalPrice?: string;
    unit: string;
    stock: string;
    isVerified?: boolean;
  }>;
}

export const ProductSection = ({
  title,
  viewAllText,
  showNavigation = true,
  showFilters = false,
  filters = [],
  selectedFilter,
  onFilterChange,
  showFreshnessCard = false,
  products
}: ProductSectionProps) => {
  return (
    <section className="py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {showNavigation && (
            <div className="flex items-center space-x-4">
              {viewAllText && (
                <Button variant="ghost" className="border-1 border-primary-500 bg-primary-50 rounded-full text-black">
                  {viewAllText}
                </Button>
              )}
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        {showFilters && filters.length > 0 && (
          <div className="flex space-x-3 mb-6 overflow-x-auto scrollbar-hide">
            {filters.map((filter) => (
              <Button
                variant="ghost"
                key={filter}
                onClick={() => onFilterChange?.(filter)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-full border-2 transition-all duration-200
                  ${selectedFilter === filter
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-primary-300"
                  }
                `}
              >
                <span className="text-sm font-medium whitespace-nowrap">{filter}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
          {showFreshnessCard && (
            <div className="col-span-2 sm:col-span-1">
              <FreshnessGuaranteeCard />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
