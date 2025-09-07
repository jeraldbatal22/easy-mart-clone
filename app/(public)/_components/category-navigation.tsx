"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";

export const CategoryNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState("Bread");

  const categories = [
    { id: "bread", name: "Bread", icon: "✅" },
    { id: "cheese", name: "Cheese", icon: "🧀" },
    { id: "alcohol", name: "Alcohol", icon: "🍺" },
    { id: "yogurt", name: "Yogurt", icon: "🥛" },
    { id: "fruits", name: "Fruits", icon: "🍎" },
    { id: "watermelon", name: "Watermelon", icon: "🍉" },
    { id: "snacks", name: "Snacks", icon: "🍿" },
    { id: "cake", name: "Cake", icon: "🍰" },
    { id: "candy", name: "Candy", icon: "🍬" },
    { id: "vegetables", name: "Vegetables", icon: "🥦" },
    { id: "fruits2", name: "Fruits", icon: "🍎" },
    { id: "cans", name: "Cans", icon: "🥫" }
  ];

  return (
    <section className="py-6">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => (
            <Button
              variant="ghost"
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`
                flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all duration-200
                ${selectedCategory === category.name
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-purple-300"
                }
              `}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="text-sm font-medium whitespace-nowrap">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};
