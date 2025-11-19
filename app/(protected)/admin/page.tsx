"use client";

import React from "react";
import { 
  Package, 
  FolderOpen, 
  FolderTree, 
  Users, 
  ShoppingCart, 
  TrendingUp,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  href: string;
}

const StatCard = ({ title, value, change, changeType, icon, href }: StatCardProps) => {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-gray-600"
  };

  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className={`text-sm ${changeColor[changeType]}`}>
              {change}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            {icon}
          </div>
        </div>
      </div>
    </Link>
  );
};

const QuickActionCard = ({ title, description, icon, href }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) => {
  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gray-100 rounded-lg">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Products",
      value: "1,234",
      change: "+12% from last month",
      changeType: "positive" as const,
      icon: <Package className="h-6 w-6 text-blue-600" />,
      href: "/admin/products"
    },
    {
      title: "Categories",
      value: "24",
      change: "+2 new this week",
      changeType: "positive" as const,
      icon: <FolderOpen className="h-6 w-6 text-green-600" />,
      href: "/admin/categories"
    },
    {
      title: "Subcategories",
      value: "156",
      change: "+8 new this week",
      changeType: "positive" as const,
      icon: <FolderTree className="h-6 w-6 text-purple-600" />,
      href: "/admin/sub-categories"
    },
    {
      title: "Total Users",
      value: "5,678",
      change: "+5% from last month",
      changeType: "positive" as const,
      icon: <Users className="h-6 w-6 text-orange-600" />,
      href: "/admin/users"
    },
    {
      title: "Orders Today",
      value: "89",
      change: "+15% from yesterday",
      changeType: "positive" as const,
      icon: <ShoppingCart className="h-6 w-6 text-red-600" />,
      href: "/admin/orders"
    },
    {
      title: "Revenue",
      value: "$12,345",
      change: "+8% from last month",
      changeType: "positive" as const,
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      href: "/admin/analytics"
    }
  ];

  const quickActions = [
    {
      title: "Add New Product",
      description: "Create a new product with all details",
      icon: <Package className="h-6 w-6 text-blue-600" />,
      href: "/admin/products"
    },
    {
      title: "Manage Categories",
      description: "Organize your product categories",
      icon: <FolderOpen className="h-6 w-6 text-green-600" />,
      href: "/admin/categories"
    },
    {
      title: "View Analytics",
      description: "Check your store performance",
      icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
      href: "/admin/analytics"
    },
    {
      title: "Order Management",
      description: "Process and track orders",
      icon: <ShoppingCart className="h-6 w-6 text-red-600" />,
      href: "/admin/orders"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to your Easy Mart admin dashboard. Manage your store efficiently.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New product added</p>
              <p className="text-xs text-gray-500">`Organic Apples` was added to Fruits category</p>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-lg">
              <FolderOpen className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Category updated</p>
              <p className="text-xs text-gray-500">`Dairy Products` category was modified</p>
            </div>
            <span className="text-xs text-gray-500">4 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New order received</p>
              <p className="text-xs text-gray-500">Order #12345 for $89.99</p>
            </div>
            <span className="text-xs text-gray-500">6 hours ago</span>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Status</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Storage</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                75% Used
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="text-sm font-medium text-gray-900">1,234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending Orders</span>
              <span className="text-sm font-medium text-gray-900">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Low Stock Items</span>
              <span className="text-sm font-medium text-red-600">7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
