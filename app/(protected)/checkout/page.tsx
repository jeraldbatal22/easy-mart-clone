"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/common/layout/Header";
import { Footer } from "@/components/common/layout/Footer";
import { useCart } from "@/lib/hooks/useCart";
import {
  ShoppingCart,
  MapPin,
  Clock,
  CreditCard,
  ChevronRight,
  Info,
  Plus,
} from "lucide-react";
import Image from "next/image";

const CheckoutPage = () => {
  const { items, subtotal, deliveryFee } = useCart();
  const [selectedTip, setSelectedTip] = useState<number | null>(null);

  // Calculate service fee (example: 10% of subtotal)
  const serviceFee = subtotal * 0.1;
  const finalTotal = subtotal + deliveryFee + serviceFee + (selectedTip || 0);

  const tipAmounts = [5, 10, 15, 20, 30];

  const handlePlaceOrder = () => {
    // Implement place order logic
    console.log("Placing order...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          {/* Checkout Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Checkout
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">
                Deliver Tomorrow, Sep 17, 8am-10am
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - Checkout Details */}
            <div className="space-y-4 sm:space-y-6">
              {/* Delivery Info Section */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      Delivery info
                    </h3>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                  <span className="text-sm sm:text-base text-gray-600">
                    Deliver to
                  </span>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-primary-500 font-medium break-words">
                      2118 Thornridge Cir. Syracuse, Connecticut 35624
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      Payment Method
                    </h3>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                  <span className="text-sm sm:text-base text-gray-600">
                    Pay With
                  </span>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-3 h-3 sm:w-5 sm:h-5 text-primary-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-primary-500 font-medium">
                      Mastercard **** 3434
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Order Section */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      Review Order
                    </h3>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto">
                  {items.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
                    >
                      <Image
                        src={
                          item.product.image ||
                          "/assets/images/product/product-1.png"
                        }
                        alt={item.product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {items.length > 5 && (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-600">
                        +{items.length - 5}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                Order Summary
              </h3>

              {/* Pricing Breakdown */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between">
                  <span className="text-sm sm:text-base text-gray-600">
                    Delivery fee
                  </span>
                  <span className="text-sm sm:text-base font-medium">
                    Php {deliveryFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm sm:text-base text-gray-600">
                    Service fee
                  </span>
                  <span className="text-sm sm:text-base font-medium">
                    Php {serviceFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm sm:text-base text-gray-600">
                    Items total
                  </span>
                  <span className="text-sm sm:text-base font-medium">
                    Php {subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Delivery Tip Section */}
              <div className="mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Delivery Tip
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  Your delivery person keeps 100% of tips.
                </p>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mb-3">
                  {tipAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setSelectedTip(amount)}
                      className={`p-2 sm:p-3 rounded-lg text-center transition-colors text-xs sm:text-sm ${
                        selectedTip === amount
                          ? "border border-primary-500 bg-purple-50 text-primary-500"
                          : "border border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Php {amount}
                    </button>
                  ))}
                </div>

                <button className="w-full p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 transition-colors text-sm">
                  Other
                </button>
              </div>

              {/* Coupon Section */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base text-gray-600">
                    Coupon
                  </span>
                  <button className="flex items-center space-x-1 text-primary-500 hover:text-purple-700">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">
                      Add Coupon
                    </span>
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-3 sm:pt-4 mb-4 sm:mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    Total
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    Php {finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Terms and Conditions */}
              <p className="text-xs text-gray-500 mb-4 sm:mb-6">
                By placing this order, you are agreeing to Terms and Conditions.
              </p>

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                className="w-full bg-primary-500 hover:from-primary-700 hover:to-primary-800 text-white py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg"
              >
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CheckoutPage;
