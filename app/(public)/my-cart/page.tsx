"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/common/layout/Header";
import { Footer } from "@/components/common/layout/Footer";
import { ProductCard } from "@/components/common/product/product-card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useCart } from "@/lib/hooks/useCart";
import {
  MapPin,
  Calendar,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SidebarAccount from "@/app/(protected)/account/_components/sidebar";
import { useAppSelector } from "@/lib/hooks";

// Mock data for recommendations
const recommendations = [
  {
    id: "rec1",
    name: "This is product a",
    image: "/assets/images/product/product-1.png",
    price: "Php 99.99",
    originalPrice: "Php 99.99",
    unit: "Php 2.71/lb",
    stock: "12 Left",
  },
  {
    id: "rec2",
    name: "This is product a",
    image: "/assets/images/product/product-2.png",
    price: "Php 99.99",
    originalPrice: "Php 99.99",
    unit: "Php 2.71/lb",
    stock: "12 Left",
  },
  {
    id: "rec3",
    name: "This is product a",
    image: "/assets/images/product/product-3.png",
    price: "Php 99.99",
    originalPrice: "Php 99.99",
    unit: "Php 2.71/lb",
    stock: "12 Left",
  },
  {
    id: "rec4",
    name: "This is product a",
    image: "/assets/images/product/product-4.png",
    price: "Php 99.99",
    originalPrice: "Php 99.99",
    unit: "Php 2.71/lb",
    stock: "12 Left",
  },
];

const MyCartPage = ({ isWithSidebarAccount }: { isWithSidebarAccount?: boolean; }) => {
  const router = useRouter();
  const {
    cart,
    loading,
    error,
    items,
    totalAmount,
    subtotal,
    deliveryFee,
    loadCart,
    incrementQuantity,
    decrementQuantity,
    removeItemFromCart,
    formatPrice,
  } = useCart();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  const handleCheckout = () => {
    if (isAuthenticated) {
      router.push("/checkout");
    } else {
      router.push("/signin");
    }
  }

  // Show loading spinner while fetching cart
  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show error state
  if (error && !cart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading cart: {error}</p>
          <Button onClick={loadCart}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className={`${!isWithSidebarAccount ? "max-w-7xl": "w-full"} mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-8`}>
        <div className="flex w-full gap-5">
          { isWithSidebarAccount && <SidebarAccount />}
          <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Local Market Section */}
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                        Local Market
                      </h2>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">
                          Shopping in 07114
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button className="!bg-white border-1 border-primary-500 hover:bg-primary-700 !text-black px-3 py-2 sm:px-4 rounded-full flex items-center space-x-2 text-xs sm:text-sm">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Wed 123</span>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                  Items Name
                </h3>

                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500">
                      Add some items to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.product._id}
                        className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 relative flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 sm:truncate">
                              {item.name}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              {item.originalPrice && (
                                <span className="text-xs sm:text-sm text-gray-400 line-through">
                                  {formatPrice(item.originalPrice)}
                                </span>
                              )}
                              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                                {formatPrice(item.price)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
                          <div className="flex items-center space-x-2 sm:space-x-4">
                            {item.quantity === 1 ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 w-10 h-10 sm:w-10 sm:h-10 touch-manipulation"
                                onClick={() =>
                                  removeItemFromCart(item.product._id)
                                }
                              >
                                <Trash2 className="w-4 h-4 sm:w-4 sm:h-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-500 hover:text-gray-600 w-10 h-10 sm:w-10 sm:h-10 touch-manipulation"
                                onClick={() =>
                                  decrementQuantity(item.product._id)
                                }
                              >
                                <Minus className="w-4 h-4 sm:w-4 sm:h-4" />
                              </Button>
                            )}

                            <div className="w-8 h-8 sm:w-8 sm:h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {item.quantity}
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:text-gray-600 w-10 h-10 sm:w-10 sm:h-10 touch-manipulation"
                              onClick={() =>
                                incrementQuantity(item.product._id)
                              }
                            >
                              <Plus className="w-4 h-4 sm:w-4 sm:h-4" />
                            </Button>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                            <span
                              className="text-xs sm:text-sm text-gray-500 hover:text-red-500 cursor-pointer touch-manipulation"
                              onClick={() =>
                                removeItemFromCart(item.product._id)
                              }
                            >
                              Remove
                            </span>
                            <div className="text-right">
                              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-20 sm:top-24">
                {/* Free delivery banner */}
                <div className="bg-primary-50 border-b border-primary-100 px-4 sm:px-6 py-2 sm:py-3">
                  <p className="text-xs sm:text-sm text-primary-700">
                    Free delivery + saving Php 3.00 on this order Go to
                  </p>
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                    Order Summary
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Items total</span>
                      <span className="text-gray-900">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Delivery fee</span>
                      <span className="text-gray-900">
                        {formatPrice(deliveryFee)}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 pt-3 sm:pt-4">
                      <div className="flex justify-between">
                        <span className="text-base sm:text-lg font-semibold text-gray-900">
                          Subtotal
                        </span>
                        <span className="text-base sm:text-lg font-semibold text-gray-900">
                          {formatPrice(subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 sm:py-4 rounded-full flex items-center justify-between mt-4 sm:mt-6 touch-manipulation text-base font-semibold"
                    disabled={items.length === 0}
                  >
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="w-5 h-5 sm:w-5 sm:h-5" />
                      <span className="text-base sm:text-md">Checkout</span>
                    </div>
                    <span className="text-base sm:text-md font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Recommendations Section */}
          <div className="mt-8 sm:mt-12">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                Recommendations
              </h2>
              <div className="flex space-x-1 sm:space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-600 w-8 h-8 sm:w-10 sm:h-10"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-600 w-8 h-8 sm:w-10 sm:h-10"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {recommendations.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  unit={product.unit}
                  stock={product.stock}
                />
              ))}
            </div>
          </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyCartPage;
