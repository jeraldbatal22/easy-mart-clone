"use client";

import { useEffect, useState } from "react";
import {
  HeroBanner,
  CategoryNavigation,
  ProductSection,
  // PromotionalBanner,
  Header,
  Footer,
} from "@/app/(public)/_components";

interface UIProduct {
  id: string;
  name: string;
  image: string;
  price: string;
  originalPrice?: string;
  unit: string;
  stock: string;
  isVerified?: boolean;
}

const HomePage = () => {
  // const [selectedFilter, setSelectedFilter] = useState("Fresh bakery");

  // Fetched product data from API (falls back to sample data above)
  const [fetchedBestSellers, setFetchedBestSellers] = useState<UIProduct[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(6);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isCancelled = false;
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        setProductError(null);
        const categoryParam = selectedCategory ? `&groceryCategory=${encodeURIComponent(selectedCategory)}` : "";
        const res = await fetch(`/api/product?limit=${limit}&page=${page}${categoryParam}`);
        const json = await res.json();
        if (!res.ok || !json?.success) {
          throw new Error(json?.error || "Failed to fetch products");
        }
        console.log(json, "json")
        const items = Array.isArray(json?.data) ? json.data : [];
        setPagination(json.pagination)
        // Map API products to UI shape, showing best sellers first if available
        const mapped: UIProduct[] = items
          .filter((p: any) => p && typeof p === "object")
          .map((p: any) => ({
            id: String(p.id || p._id || ""),
            name: String(p.name || ""),
            image: String(p.image || "/assets/images/product/product-1.png"),
            price: typeof p.price === "number" ? `Php ${p.price.toFixed(2)}` : String(p.price ?? ""),
            originalPrice: typeof p.originalPrice === "number" ? `$${p.originalPrice.toFixed(2)}` : (p.originalPrice ? String(p.originalPrice) : undefined),
            unit: String(p.unit || "each"),
            stock: String( (typeof p.stock === "number" ? (p.stock === 0 ? "Out of Stock" : `${p.stock} Left`) : "")),
            isVerified: Boolean(p.isVerified),
          }));
        function compareByBest(a: UIProduct, b: UIProduct): number {
          const aBestFlag = items.find((p: any) => String(p.id || p._id) === a.id)?.isBestSeller ? 1 : 0;
          const bBestFlag = items.find((p: any) => String(p.id || p._id) === b.id)?.isBestSeller ? 1 : 0;
          return Number(bBestFlag) - Number(aBestFlag);
        }
        const prioritized = mapped.sort(compareByBest);
        if (!isCancelled) setFetchedBestSellers(prioritized);
      } catch (err: any) {
        if (!isCancelled) setProductError(err?.message || "Something went wrong");
      } finally {
        if (!isCancelled) setIsLoadingProducts(false);
      }
    };
    fetchProducts();
    return () => {
      isCancelled = true;
    };
  }, [page, limit, selectedCategory]);

  // Category selection comes from CategoryNavigation

  const handleProductBestNextPage = () => {
    if (pagination?.hasNextPage) {
      setPage((p) => p + 1);
    }
  };

  const handleProductBestPrevPage = () => {
    if (pagination?.hasPrevPage) {
      setPage((p) => Math.max(1, p - 1));
    }
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory((prev) => (prev === cat ? undefined : cat));
    setPage(1);
  };

  // const trendingProducts = [
  //   {
  //     id: "7",
  //     name: "This is product a",
  //     image: "/assets/images/product/product-5.png",
  //     price: "$2.71/lb",
  //     originalPrice: "$99.99",
  //     unit: "per lb",
  //     stock: "12 Left",
  //     isVerified: true,
  //   },
  //   {
  //     id: "8",
  //     name: "This is product a",
  //     image: "/assets/images/product/product-2.png",
  //     price: "$2.71/lb",
  //     originalPrice: "$99.99",
  //     unit: "per lb",
  //     stock: "12 Left",
  //     isVerified: true,
  //   },
  //   {
  //     id: "9",
  //     name: "This is product a",
  //     image: "/assets/images/product/product-3.png",
  //     price: "$2.71/lb",
  //     originalPrice: "$99.99",
  //     unit: "per lb",
  //     stock: "12 Left",
  //     isVerified: true,
  //   },
  //   {
  //     id: "10",
  //     name: "This is product a",
  //     image: "/assets/images/product/product-4.png",
  //     price: "$2.71/lb",
  //     originalPrice: "$99.99",
  //     unit: "per lb",
  //     stock: "12 Left",
  //     isVerified: true,
  //   },
  //   {
  //     id: "11",
  //     name: "This is product a",
  //     image: "/assets/images/product/product-5.png",
  //     price: "$2.71/lb",
  //     originalPrice: "$99.99",
  //     unit: "per lb",
  //     stock: "12 Left",
  //     isVerified: true,
  //   },
  //   {
  //     id: "12",
  //     name: "This is product a",
  //     image: "/assets/images/product/product-1.png",
  //     price: "$2.71/lb",
  //     originalPrice: "$99.99",
  //     unit: "per lb",
  //     stock: "12 Left",
  //     isVerified: true,
  //   },
  // ];

  // const filterOptions = [
  //   "Fresh bakery",
  //   "Dairy",
  //   "Meat",
  //   "Vegetables",
  //   "Fruits",
  // ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <HeroBanner />
       
        <CategoryNavigation selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />

        <ProductSection
          isLoading={isLoadingProducts}
          error={productError}
          title="Best Seller"
          viewAllText={pagination ? `View All (+${pagination.total}) →` : undefined}
          pagination={pagination || undefined}
          products={fetchedBestSellers}
          onNextPage={handleProductBestNextPage}
          onPrevPage={handleProductBestPrevPage}
          showFilters={false}
          selectedCategory={selectedCategory}
        />

        {/* <ProductSection
          title="Trending Store Favorites"
          viewAllText="View All →"
          showFilters={true}
          filters={filterOptions}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          products={trendingProducts}
        /> */}

        {/* <PromotionalBanner
          offer="Get 10% OFF On Your First Order"
          title="Order Now Your Grocery!"
          tags={["Beef", "Rice", "Fresh bakery"]}
          products={trendingProducts}
        />

        <ProductSection
          title="Trending Store Favorites"
          showFilters={true}
          filters={filterOptions}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          products={trendingProducts}
          showNavigation={false}
          showFreshnessCard={true}
        />

        <PromotionalBanner
          offer="Get 10% OFF On Your First Order"
          title="Order Now Your Grocery!"
          showMetrics={true}
          showOrderButton={true}
          products={trendingProducts}
        /> */}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
