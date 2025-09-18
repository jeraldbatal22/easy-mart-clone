"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/common/product/product-card";
import { LoadingSkeleton } from "@/components/common/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useRef } from "react";
import useDeviceDetect from "@/lib/hooks/useDeviceDetect";

interface ProductCategorySectionProps {
  title: string;
  products: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    unit: string;
    stockLabel: string;
    isVerified?: boolean;
  }>;
  isLoading: boolean;
  error: any;
}

export const ProductCategorySection = ({
  title,
  products,
  isLoading,
  error,
}: ProductCategorySectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { isMobile } = useDeviceDetect();

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = isMobile ? 200 : 300;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = isMobile ? 200 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900">{title}</h2>
        </div>
        <LoadingSkeleton
          lines={1}
          columns={isMobile ? 2 : 6}
          itemClassName={isMobile ? "h-40 w-40" : "h-48 w-48"}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900">{title}</h2>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (products.length === 0) {
    return null; // Don't render empty sections
  }
console.log(products)
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Products Scroll Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
        className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-4 gap-5 space-x-0 md:space-x-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="">
            <ProductCard 
              id={product.id}
              name={product.name}
              image={product.image}
              price={`Php ${Number(product.price).toFixed(2)}`}
              originalPrice={product.originalPrice ? `$${product.originalPrice.toFixed(2)}` : undefined}
              unit={product.unit}
              stock={product.stockLabel}
              isVerified={product.isVerified}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
