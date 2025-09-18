"use client";

import { useState } from "react";
import {
  HeroBanner,
  CategoryNavigation,
  ProductSection,
  // PromotionalBanner,
  Header,
  Footer,
} from "./_components";
import { useProducts } from "@/lib/hooks/useProductsQuery";

const HomePage = () => {
  // const [selectedFilter, setSelectedFilter] = useState("Fresh bakery");

  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(6);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  const {
    products: fetchedBestSellers,
    pagination,
    isLoading: isLoadingProducts,
    error: productError,
  } = useProducts({
    page,
    limit,
    category: selectedCategory,
    enabled: true,
  });

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

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Easy Mart",
    description:
      "Shop fresh groceries, best sellers, and quality products at Easy Mart. Fast delivery, competitive prices, and verified products.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    logo: `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/assets/icons/logo-with-text.png`,
    image: `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/assets/images/home/frame-1.png`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "PH",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Grocery Products",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Fresh Bakery",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Dairy Products",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Fresh Meat",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Fresh Vegetables",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Fresh Fruits",
          },
        },
      ],
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <Header />

      <main className=" mx-auto px-4 sm:px-6 lg:px-8">
        <HeroBanner />

        <CategoryNavigation
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <ProductSection
          isLoading={isLoadingProducts}
          error={productError}
          title="Best Seller"
          viewAllText={
            pagination ? `View All (+${pagination.total}) →` : undefined
          }
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
