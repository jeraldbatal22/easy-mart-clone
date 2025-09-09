"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AddToCartButton } from "./add-to-cart-button";

interface EnhancedProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  unit: string;
  stock: number;
  stockLabel: string;
  isVerified?: boolean;
  showAddToCart?: boolean;
}

export const EnhancedProductCard = ({
  id,
  name,
  image,
  price,
  originalPrice,
  unit,
  stock,
  stockLabel,
  isVerified = false,
  showAddToCart = true,
}: EnhancedProductCardProps) => {
  const router = useRouter();

  const formatPrice = (price: number) => `Php ${price.toFixed(2)}`;

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      <div 
        className="relative cursor-pointer"
        onClick={() => router.push(`/products/${id}`)}
      >
        <div className="w-full h-40 xs:h-48 sm:h-60 relative bg-primary-50 rounded-xl flex items-center justify-center mb-2 sm:mb-3 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain object-center transition-transform duration-200 hover:scale-105"
            sizes="(max-width: 640px) 100vw, 250px"
            priority
          />
        </div>
        {isVerified && (
          <div className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs sm:text-xs">✓</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1 sm:space-y-2 flex-1 flex flex-col justify-between">
        <h3 
          className="font-medium text-gray-900 text-xs sm:text-sm leading-tight line-clamp-2 cursor-pointer hover:text-primary-600"
          onClick={() => router.push(`/products/${id}`)}
        >
          {name}
        </h3>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-[10px] sm:text-xs text-gray-500">{unit}</span>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          {originalPrice && (
            <span className="text-[10px] sm:text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
          )}
          <span className="font-semibold text-gray-900 text-xs sm:text-base">{formatPrice(price)}</span>
        </div>
        
        <div className="text-[10px] sm:text-xs text-orange-600 font-medium">{stockLabel}</div>
        
        {showAddToCart && (
          <div className="mt-2">
            <AddToCartButton
              productId={id}
              productName={name}
              price={price}
              originalPrice={originalPrice}
              unit={unit}
              image={image}
              stock={stock}
              size="sm"
              className="text-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
};
