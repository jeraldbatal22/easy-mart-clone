"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/common/layout/Header";
import { Footer } from "@/components/common/layout/Footer";
import { ArrowLeft, Check, HelpCircle, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrderDetailsPage({ params: _params }: { params: { id: string } }) {
  const router = useRouter();
  // Mock data - replace with actual data fetching
  const orderData = {
    id: "123-321",
    status: "In Progress",
    date: "Apr 5, 2022, 10:07 AM",
    items: [
      {
        id: 1,
        name: "Sweet Green Seedless",
        image: "/assets/images/product/product-1.png",
        currentPrice: 99.99,
        originalPrice: 0.00,
        quantity: 12
      },
      {
        id: 2,
        name: "Sweet Green Seedless",
        image: "/assets/images/product/product-1.png",
        currentPrice: 99.99,
        originalPrice: 0.00,
        quantity: 12
      },
      {
        id: 3,
        name: "Sweet Green Seedless",
        image: "/assets/images/product/product-1.png",
        currentPrice: 99.99,
        originalPrice: 0.00,
        quantity: 12
      },
      {
        id: 4,
        name: "Sweet Green Seedless",
        image: "/assets/images/product/product-1.png",
        currentPrice: 99.99,
        originalPrice: 0.00,
        quantity: 12
      }
    ],
    deliveryFees: 144,
    total: 144,
    paymentMethod: "MasterCard 02132",
    deliveryAddress: "Shopping in 07114"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Help Button */}
      <div className="mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-end">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="rounded-full w-10 h-10 sm:w-12 sm:h-12 p-0 border-gray-300 hover:bg-gray-100"
          >
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Back Button */}
      <div className="mx-auto px-3 sm:px-4 lg:px-8 pt-2 sm:pt-4">
        <Link href="/account/orders" className="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          Back
        </Link>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Left Column - Order Progress & Items */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            
            {/* Order Progress Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Order In Progress</h1>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600">Order Arrived at {orderData.date}</p>
                </div>
                <div className="bg-pink-100 text-pink-800 px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">
                  {orderData.status}
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="mb-4 sm:mb-6 lg:mb-8">
                {/* Mobile Timeline */}
                <div className="block sm:hidden">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">Order is Placed</span>
                        <p className="text-xs text-gray-500">{orderData.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">Preparing</span>
                        <p className="text-xs text-gray-500">Your order is being prepared</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">On the way</span>
                        <p className="text-xs text-gray-500">Delivery in progress</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Delivered</span>
                        <p className="text-xs text-gray-500">Order completed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Timeline */}
                <div className="hidden sm:flex items-center space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">Order is Placed</span>
                  </div>
                  
                  <div className="flex-1 flex items-center">
                    <div className="flex-1 h-0.5 bg-purple-500"></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full mx-2"></div>
                    <div className="flex-1 h-0.5 bg-gray-300"></div>
                    <div className="w-3 h-3 bg-gray-300 rounded-full mx-2"></div>
                    <div className="flex-1 h-0.5 bg-gray-300"></div>
                    <div className="w-3 h-3 bg-gray-300 rounded-full mx-2"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
              <div className="flex justify-between items-center mb-3 sm:mb-4 lg:mb-6">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Items Name</h2>
                <span className="text-xs sm:text-sm text-gray-600">{orderData.items.length} items</span>
              </div>

              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                {orderData.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 p-2 sm:p-3 lg:p-4 border border-gray-100 rounded-lg">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 relative flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm lg:text-base font-medium text-gray-900 mb-1 truncate">{item.name}</h3>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <span className="text-xs sm:text-sm lg:text-base font-bold text-gray-900">${item.currentPrice}</span>
                        {item.originalPrice > 0 && (
                          <span className="text-xs text-gray-500 line-through">${item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium flex-shrink-0">
                      {item.quantity}x
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-3 sm:mt-4 lg:mt-6">
                <Button variant="outline" size="sm" className="p-1 sm:p-2 w-6 h-6 sm:w-8 sm:h-8 lg:w-auto lg:h-auto">
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <div className="flex space-x-1 sm:space-x-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
                    1
                  </div>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
                    2
                  </div>
                </div>
                <Button variant="outline" size="sm" className="p-1 sm:p-2 w-6 h-6 sm:w-8 sm:h-8 lg:w-auto lg:h-auto">
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                <p className="text-sm sm:text-base text-gray-600 flex-1">
                  You can cancel your order before it starts being prepared.
                </p>
                <Button
                  variant="outline"
                  className="border-purple-500 text-purple-500 hover:bg-purple-50 text-sm sm:text-base px-4 py-2 w-full sm:w-auto"
                >
                  Cancel Order
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            
            {/* Order Summary */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 lg:p-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">Order Summary</h2>
              
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm lg:text-base text-gray-600">Order Number</span>
                  <span className="text-xs sm:text-sm lg:text-base text-pink-500 font-medium">#{orderData.id}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm lg:text-base text-gray-600">Subtotal</span>
                  <span className="text-xs sm:text-sm lg:text-base text-gray-900">${orderData.total - orderData.deliveryFees}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm lg:text-base text-gray-600">Delivery Fees</span>
                  <span className="text-xs sm:text-sm lg:text-base text-gray-900">${orderData.deliveryFees}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-2 sm:pt-3 lg:pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">Total</span>
                    <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">${orderData.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 lg:p-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">Pay With</h2>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">MC</span>
                </div>
                <span className="text-xs sm:text-sm lg:text-base text-gray-900 truncate">{orderData.paymentMethod}</span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 lg:p-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">Delivery Address</h2>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm lg:text-base text-gray-900">{orderData.deliveryAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
