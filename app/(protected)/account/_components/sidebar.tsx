"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { logout } from "@/lib/slices/authSlice";
import { clearAuthCookies } from "@/lib/utils/cookies";
import {
  User,
  FileText,
  MapPin,
  CreditCard,
  Bell,
  Tag,
  ChefHat,
  Settings,
  HelpCircle,
  LogOut,
  ShoppingCart,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";

const SidebarAccount = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  
  const navigationItems = [
    {
      icon: User,
      label: "Account Details",
      href: "/account/details",
    },
    { icon: FileText, label: "My Orders", href: "/account/orders" },
    { icon: ShoppingCart, label: "My Cart", href: "/my-cart" },
    { icon: MapPin, label: "My Addresses", href: "/account/addresses" },
    { icon: CreditCard, label: "My Payments", href: "/account/payments" },
    {
      icon: Bell,
      label: "Notification Setting",
      href: "/account/notifications",
    },
    { icon: Tag, label: "Coupons", href: "/account/coupons" },
    { icon: ChefHat, label: "My Recipes", href: "/account/recipes" },
    { icon: Settings, label: "Account Settings", href: "/account/settings" },
    { icon: HelpCircle, label: "Help Center", href: "/account/help" },
  ];

  return (
    <div className="w-full lg:w-80 flex-shrink-0 mb-4 lg:mb-0">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* User Profile - Mobile */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Alicii Virgo</h3>
              <p className="text-xs text-gray-500">Account Settings</p>
            </div>
          </div>
        </div>

        {/* Horizontal Navigation - Mobile */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-[10px] font-medium transition-colors whitespace-nowrap min-w-[80px] ${
                    isActive
                      ? "bg-primary-50 text-primary-500"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-center leading-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          {/* Logout Button - Mobile */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              onClick={async () => {
                clearAuthCookies();
                await dispatch(logout());
                window.location.href = "/signin";
              }}
              className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium bg-gray-50 hover:bg-gray-100 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block h-[calc(100dvh-150px)]">
        <div className="flex flex-col bg-white rounded-xl shadow-sm p-6 h-full">
          {/* User Profile */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-3 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Alicii Virgo
            </h3>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-500"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-6 pt-6">
            <Button
              variant="ghost"
              onClick={async () => {
                clearAuthCookies();
                await dispatch(logout());
                window.location.href = "/signin";
              }}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium bg-gray-50 hover:bg-gray-100 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarAccount;
