"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { useClientOnly } from "@/lib/hooks/useClientOnly";
import { logout } from "@/lib/slices/authSlice";
import { clearAuthCookies } from "@/lib/utils/cookies";
import { Search, MapPin, ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const isClient = useClientOnly();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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

            <div className="hidden md:flex items-center space-x-1 text-gray-600">
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
            <div className="flex items-center space-x-2 text-gray-600 cursor-pointer hover:text-primary-600 transition-colors">
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  14
                </span>
              </div>
              <span className="hidden sm:block text-sm font-medium">Cart</span>
            </div>

            <Button
              variant="ghost"
              onClick={async () => {
                if (isAuthenticated) {
                  clearAuthCookies();
                  await dispatch(logout());
                  window.location.href = "/signin";
                  return;
                } else {
                  router.push("/signin");
                }
              }}
              className="border-1 border-primary-500 hover:bg-primary-100 text-black px-4 py-2 rounded-full flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>
                {isClient ? (isAuthenticated ? "Signout" : "Signin") : "Signin"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
