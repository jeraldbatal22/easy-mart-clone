"use client";

import { useState } from "react";
import { Header, Footer, CategoryNavigation } from "../_components";
import { SidebarFilters, ProductCategorySection, SubcategorySection } from "./_components";
import { useProducts, useFetchCategories, useFetchSubcategories } from "@/lib/hooks/useProductsQuery";
import { Button } from "@/components/ui/button";
import { EqualApproximately, Filter, X } from "lucide-react";
import Image from "next/image";

const ProductsPage = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    deals: false,
    newArrivals: false,
    nearMe: false,
    price: "all",
    madeIn: "all",
  });

  const [page] = useState<number>(1);
  const [limit] = useState<number>(12);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const {
    products: allProducts,
    isLoading: isLoadingProducts,
    error: productError,
  } = useProducts({
    page,
    limit,
    category: selectedCategory,
    enabled: true,
  });

  // Fetch categories using the new hook
  const { categories: fetchedCategories } = useFetchCategories({
    limit: 20,
    enabled: true,
  });

  // Get the selected category ID for fetching subcategories
  const selectedCategoryId = fetchedCategories.find(
    (cat) => cat.name === selectedCategory
  )?.id;

  // Fetch subcategories for the selected category
  const { subcategories: fetchedSubcategories } = useFetchSubcategories({
    categoryId: selectedCategoryId,
    limit: 50,
    enabled: !!selectedCategoryId,
  });

  console.log(allProducts);
  
  // Group products by subcategory for display
  const groupedProductsBySubcategory = allProducts.reduce((acc: any, product: any) => {
    const subcategoryId = product.subGroceryCategory;
    if (subcategoryId) {
      const subcategory = fetchedSubcategories.find(
        (sub: any) => sub.id === subcategoryId
      );
      if (subcategory) {
        if (!acc[subcategory.name]) {
          acc[subcategory.name] = [];
        }
        acc[subcategory.name].push(product);
      }
    }
    return acc;
  }, {});
  console.log(groupedProductsBySubcategory)

  // Use fetched categories for display, fallback to hardcoded list
  const displayCategories =
    fetchedCategories.length > 0
      ? fetchedCategories.map((cat) => cat.name)
      : [];

  const handleFilterChange = (filterType: string, value: any) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const resetFilters = () => {
    setSelectedFilters({
      deals: false,
      newArrivals: false,
      nearMe: false,
      price: "all",
      madeIn: "all",
    });
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory((prev) => (prev === cat ? undefined : cat));
  };
  // console.log(groupedProducts[selectedCategory || null])
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="flex ">
        {/* Desktop Sidebar - Filters */}
        <div className="hidden lg:block w-80 bg-gray-50 p-6 border-r border-gray-200">
          <SidebarFilters
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
          />
        </div>

        {/* Mobile Filter Overlay */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileFiltersOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-4 overflow-y-auto h-full">
                <SidebarFilters
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onReset={resetFilters}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6 space-y-4 lg:space-y-5">
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
            {selectedCategory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(undefined)}
                className="text-sm"
              >
                Clear Filter
              </Button>
            )}
          </div>

          <CategoryNavigation
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Promotional Banners */}
          <div className="flex gap-3 items-center">
            {[
              {
                src: "/assets/images/home/frame-4.png",
                className: "w-96 relative h-60",
              },
              {
                src: "/assets/images/home/frame-5.png",
                className: "flex-1 relative h-60",
              },
              {
                src: "/assets/images/home/frame-6.png",
                className: "w-32 relative h-60",
              },
            ].map((img, imgIdx) => {
              return (
                <div className={img.className} key={imgIdx}>
                  <Image
                    src={img.src}
                    alt="card.title"
                    fill
                    className="object-cover rounded-3xl"
                    priority
                  />
                </div>
              );
            })}
          </div>

          {selectedCategory && Object.keys(groupedProductsBySubcategory).length === 0 && (
            <div className="text-center flex flex-col justify-center items-center py-12">
              <EqualApproximately className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Product Available for{" "}
                <span className="text-primary-500">{selectedCategory}</span>
              </h3>
            </div>
          )}
          
          {/* Product Categories - Show subcategory grouping when a category is selected */}
          <div className="space-y-6 lg:space-y-8 mt-6 lg:mt-8">
            {selectedCategory ? (
              // Show products grouped by subcategory
              Object.keys(groupedProductsBySubcategory).map((subcategoryName) => (
                <SubcategorySection
                  key={subcategoryName}
                  subcategoryName={subcategoryName}
                  products={groupedProductsBySubcategory[subcategoryName] || []}
                  isLoading={isLoadingProducts}
                  error={productError}
                />
              ))
            ) : (
              // Show all categories when no specific category is selected
              displayCategories.map((category) => (
                <ProductCategorySection
                  key={category}
                  title={category}
                  products={[]} // This will be empty since we're not grouping by main category anymore
                  isLoading={isLoadingProducts}
                  error={productError}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
