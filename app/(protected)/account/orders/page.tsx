"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/common/layout/Header";
import { Eye, FileText, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SidebarAccount from "../_components/sidebar";
import { useState } from "react";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");

  // Mock data - replace with actual data fetching
  const orders = [
    {
      id: "123-321",
      status: "Delivered",
      date: "Apr 5, 2022",
      time: "10:07 AM",
      total: 54,
      itemsCount: 6,
      paymentMethod: "cash",
      images: [
        "/assets/images/product/product-1.png",
        "/assets/images/product/product-2.png",
        "/assets/images/product/product-3.png",
        "/assets/images/product/product-4.png",
        "/assets/images/product/product-5.png",
      ],
    },
    {
      id: "124-322",
      status: "Cancelled",
      date: "Apr 5, 2022",
      time: "10:07 AM",
      total: 54,
      itemsCount: 6,
      paymentMethod: "cash",
      images: [
        "/assets/images/product/product-1.png",
        "/assets/images/product/product-2.png",
        "/assets/images/product/product-3.png",
        "/assets/images/product/product-4.png",
        "/assets/images/product/product-5.png",
      ],
    },
    {
      id: "125-323",
      status: "In Progress",
      date: "Apr 5, 2022",
      time: "10:07 AM",
      total: 54,
      itemsCount: 18,
      paymentMethod: "cash",
      images: [
        "/assets/images/product/product-1.png",
        "/assets/images/product/product-2.png",
        "/assets/images/product/product-3.png",
        "/assets/images/product/product-4.png",
        "/assets/images/product/product-5.png",
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "border border-primary-500 text-primary-500";
      case "Delivered":
        return "border border-green-500 text-green-500";
      case "Cancelled":
        return "border border-red-500 text-red-500";
      default:
        return "border border-gray-100 text-gray-100";
    }
  };

  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  const tabs = ["All", "In Progress", "Delivered", "Cancelled"];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <SidebarAccount />

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Page Title */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                My Orders
              </h1>
            </div>

            {/* Order Status Tabs */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {tabs.map((tab) => (
                  <Button
                    variant="ghost"
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "border-1 border-primary-500 text-primary-500 hover:bg-primary-300"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {tab}
                  </Button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                  {/* Mobile Layout */}
                  <div className="block md:hidden">
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">
                          Order {order.status}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {order.date}, {order.time}
                        </p>
                      </div>
                      <div
                        className={`flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status === "Delivered"
                          ? "Completed"
                          : order.status}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <Eye className="w-3 h-3" />
                        <span>Php 100 - ${order.total} Paid with {order.paymentMethod}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <FileText className="w-3 h-3" />
                        <span>Items {order.itemsCount}x</span>
                      </div>
                    </div>

                    {/* Product Images */}
                    <div className="grid grid-cols-5 md:grid-cols-12 gap-2 items-center mb-3 bg-gray-100 rounded-md p-3">
                      {order.images.slice(0, 5).map((image, index) => (
                        <div
                          key={index}
                          className="w-12 h-12 relative rounded-lg overflow-hidden bg-white"
                        >
                          <Image
                            src={image}
                            alt={`Product ${index + 1}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ))}
                      {order.itemsCount > 5 && (
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                          +{order.itemsCount - 5}
                        </div>
                      )}
                    </div>

                    {/* View Order Details Link */}
                    <div className="flex justify-center">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="flex items-center space-x-1 text-primary-500 text-xs font-medium"
                      >
                        <span>View Order Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:block">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-5">
                      {/* Order Header */}
                      <div className="flex flex-col lg:flex-row justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order {order.status}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {order.date}, {order.time}
                          </p>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-sm text-gray-600 space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-2">
                            <Eye className="w-4 h-4" />
                            <div className="flex flex-col">
                              <span>Php 100</span>
                              <span>
                                ${order.total} Paid with {order.paymentMethod}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Items {order.itemsCount}x</span>
                      </div>

                      <div
                        className={`flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status === "Delivered"
                          ? "Completed"
                          : order.status}
                      </div>

                      {/* View Order Details Link */}
                      <div className="flex justify-start sm:justify-end">
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="flex items-center space-x-2 text-black text-sm font-medium"
                        >
                          <span>View Order Details</span>
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Product Images */}
                    <div className="grid grid-cols-5 md:grid-cols-12 gap-3 items-center mb-4 bg-gray-100 rounded-md p-5">
                      {order.images.slice(0, 5).map((image, index) => (
                        <div
                          key={index}
                          className="w-16 h-16 relative rounded-xl overflow-hidden bg-white"
                        >
                          <Image
                            src={image}
                            alt={`Product ${index + 1}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ))}
                      {order.itemsCount > 5 && (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                          +{order.itemsCount - 5}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === "All"
                    ? "You haven't placed any orders yet."
                    : `No ${activeTab.toLowerCase()} orders found.`}
                </p>
                <Link href="/">
                  <Button className="bg-primary-500 hover:bg-purple-700 text-white px-6 py-2">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
