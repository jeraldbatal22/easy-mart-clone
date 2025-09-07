"use client";

import { useState } from "react";
import {
  HeroBanner,
  CategoryNavigation,
  ProductSection,
  PromotionalBanner,
  Header,
  Footer,
} from "@/app/(public)/_components";

const HomePage = () => {
  const [selectedFilter, setSelectedFilter] = useState("Fresh bakery");

  // Sample product data
  const bestSellerProducts = [
    {
      id: "1",
      name: "This is product a",
      image: "/assets/images/product/product-3.png",
      price: "$2.71/lb",
      originalPrice: "$99.99",
      unit: "per lb",
      stock: "12 Left",
    },
    {
      id: "2",
      name: "This is product a",
      image: "/assets/images/product/product-2.png",
      price: "$2.71/lb",
      originalPrice: "$99.99",
      unit: "per lb",
      stock: "12 Left",
    },
    {
      id: "3",
      name: "This is product a",
      image: "/assets/images/product/product-3.png",
      price: "$2.71/lb",
      originalPrice: "$99.99",
      unit: "per lb",
      stock: "12 Left",
    },
    {
      id: "4",
      name: "This is product a",
      image: "/assets/images/product/product-4.png",
      price: "$2.71/lb",
      originalPrice: "$99.99",
      unit: "per lb",
      stock: "12 Left",
    },
    {
      id: "5",
      name: "This is product a",
      image: "/assets/images/product/product-5.png",
      price: "$2.71/lb",
      originalPrice: "$99.99",
      unit: "per lb",
      stock: "12 Left",
    },
    {
      id: "6",
      name: "This is product a",
      image: "/assets/images/product/product-1.png",
      price: "$2.71/lb",
      originalPrice: "$99.99",
      unit: "per lb",
      stock: "12 Left",
    },
  ];

  const trendingProducts = [
    {
      id: "7",
      name: "This is product a",
      image: "/assets/images/product/product-5.png",
      price: "$2.71/lb",
      originalPrice: "$99.99",
      unit: "per lb",
      stock: "12 Left",
      isVerified: true,
    },
    {
      id: "8",
      name: "This is product a",
      image: "/assets/images/product/product-2.png",
      price: "$2.71/lb",
      originalPrice: "$99.99",
      unit: "per lb",
      stock: "12 Left",
      isVerified: true,
    },
    {
      id: "9",
      name: "This is product a",
      image: "/assets/images/product/product-3.png",
      price: "$2.71/lb",
      originalPrice: "$99.99",
      unit: "per lb",
      stock: "12 Left",
      isVerified: true,
    },
    {
      id: "10",
      name: "This is product a",
      image: "/assets/images/product/product-4.png",
      price: "$2.71/lb",
      originalPrice: "$99.99",
      unit: "per lb",
      stock: "12 Left",
      isVerified: true,
    },
    {
      id: "11",
      name: "This is product a",
      image: "/assets/images/product/product-5.png",
      price: "$2.71/lb",
      originalPrice: "$99.99",
      unit: "per lb",
      stock: "12 Left",
      isVerified: true,
    },
    {
      id: "12",
      name: "This is product a",
      image: "/assets/images/product/product-1.png",
      price: "$2.71/lb",
      originalPrice: "$99.99",
      unit: "per lb",
      stock: "12 Left",
      isVerified: true,
    },
  ];

  const filterOptions = [
    "Fresh bakery",
    "Dairy",
    "Meat",
    "Vegetables",
    "Fruits",
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <HeroBanner />
        <CategoryNavigation />

        <ProductSection
          title="Best Seller"
          viewAllText="View All (+40) →"
          products={bestSellerProducts}
        />

        <ProductSection
          title="Trending Store Favorites"
          viewAllText="View All →"
          showFilters={true}
          filters={filterOptions}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          products={trendingProducts}
        />

        <PromotionalBanner
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
        />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
