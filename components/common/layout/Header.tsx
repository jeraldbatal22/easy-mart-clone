"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCart } from "@/lib/hooks/useCart";
import { useClientOnly } from "@/lib/hooks/useClientOnly";
import { Search, MapPin, ShoppingCart, User, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Header = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  // Keep Header passive: it reads from store only.
  const { items } = useCart();
  const isClient = useClientOnly();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between h-16">
          {/* Logo & Location */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Link href="/" className="text-xl font-semibold text-primary-500">
                <Image
                  src="/assets/icons/logo-with-text.svg"
                  width={117}
                  height={28}
                  alt="logo"
                />
              </Link>
            </div>

            <div className="flex items-center space-x-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">10115 New York</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Cart & Login */}
          <div className="flex items-center space-x-4">
            <div
              onClick={() => router.push("/my-cart")}
              className="flex items-center space-x-2 text-gray-600 cursor-pointer hover:text-primary-500 transition-colors"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items?.length}
                </span>
              </div>
              <span className="text-sm font-medium text-primary-500">Cart</span>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                if (isAuthenticated) {
                  router.push("/account/details")
                } else {
                  router.push("/signin");
                }
              }}
              className="border-1 border-primary-500 hover:bg-primary-100 text-primary-500 px-4 py-2 rounded-full flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>
                {isClient ? (isAuthenticated ? "My Account" : "Login") : "Login"}
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden">
          {/* Top Row */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-primary-500">
                <Image
                  src="/assets/icons/logo-with-text.svg"
                  width={100}
                  height={24}
                  alt="logo"
                />
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Cart */}
              <div
                onClick={() => router.push("/my-cart")}
                className="relative text-gray-600 cursor-pointer hover:text-primary-500 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items?.length}
                </span>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-primary-500 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Search Bar Row */}
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
              <div className="px-4 py-4 space-y-4">
                {/* Location */}
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">10115 New York</span>
                </div>

                {/* Login Button */}
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (isAuthenticated) {
                      router.push("/account/details")
                    } else {
                      router.push("/signin");
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full border-1 border-primary-500 hover:bg-primary-100 text-primary-500 px-4 py-2 rounded-full flex items-center justify-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>
                    {isClient ? (isAuthenticated ? "My Account" : "Login") : "Login"}
                  </span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
