"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export const PromotionalBanners = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      {/* Left Banner - Crazy Weekly Deals */}
      <div className="lg:col-span-1 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-orange-200">
        <div className="space-y-3 lg:space-y-4">
          <div className="text-xs lg:text-sm font-medium text-orange-600">
            CRAZY & WEEKLY DEALS Jun 7th → 13th
          </div>
          <h3 className="text-lg lg:text-xl font-bold text-gray-900">
            Save up to 50% off Father`s Day sale
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-lg p-2 text-center">
              <div className="text-xs text-gray-500">Chocolates</div>
              <div className="font-semibold text-green-600 text-sm">$9</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center">
              <div className="text-xs text-gray-500">Chips</div>
              <div className="font-semibold text-green-600 text-sm">$5</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center">
              <div className="text-xs text-gray-500">Frozen</div>
              <div className="font-semibold text-green-600 text-sm">$16</div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Banner - 618 Shopping Festival */}
      <div className="lg:col-span-1 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-purple-200 relative overflow-hidden">
        <div className="space-y-3 lg:space-y-4">
          <div className="text-xs lg:text-sm font-medium text-purple-600">
            618 Shopping Festival sale
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="bg-white rounded-full px-3 lg:px-4 py-2">
              <span className="text-lg lg:text-2xl font-bold text-red-500">30%</span>
              <span className="text-xs lg:text-sm text-gray-500 ml-1">off</span>
            </div>
            <div className="bg-white rounded-full px-3 lg:px-4 py-2">
              <span className="text-lg lg:text-2xl font-bold text-red-500">40%</span>
              <span className="text-xs lg:text-sm text-gray-500 ml-1">off</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs lg:text-sm text-gray-600">Coffee & More</div>
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-2 right-2 w-6 h-6 lg:w-8 lg:h-8 bg-purple-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-2 right-4 w-4 h-4 lg:w-6 lg:h-6 bg-pink-200 rounded-full opacity-50"></div>
      </div>

      {/* Right Banner - Refreshing Beverages */}
      <div className="lg:col-span-1 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-blue-200">
        <div className="space-y-3 lg:space-y-4">
          <div className="text-xs lg:text-sm font-medium text-blue-600">
            Refreshing beverages & desserts
          </div>
          <h3 className="text-base lg:text-lg font-bold text-gray-900">
            Cool down this summer
          </h3>
          <div className="flex items-center justify-between">
            <div className="text-xs lg:text-sm text-gray-600">Fresh & Cold</div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
