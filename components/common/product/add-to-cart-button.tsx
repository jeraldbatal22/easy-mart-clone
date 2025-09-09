"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/hooks/useCart";
import { ShoppingCart, Plus, Minus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  stock: number;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showQuantity?: boolean;
  quantityProps?: number;
}

export const AddToCartButton = ({
  productId,
  productName,
  price,
  originalPrice,
  unit,
  image,
  stock,
  className,
  variant = "default",
  size = "default",
  showQuantity = false,
  quantityProps = 1,
}: AddToCartButtonProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const {
    addItemToCart,
    incrementQuantity,
    decrementQuantity,
    getItemQuantity,
    isItemInCart,
    loading,
  } = useCart();

  const quantity = getItemQuantity(productId);
  const inCart = isItemInCart(productId);
  const isOutOfStock = stock === 0;

  const handleAddToCart = async () => {
    if (isOutOfStock || loading || isAdding) return;

    setIsAdding(true);
    try {
      await addItemToCart({
        productId,
        quantity: quantityProps,
        productName,
        price,
        originalPrice,
        unit,
        image,
      });
      toast.success("Success", {
        richColors: true,
        position: "top-right",
        description: <span>Add to cart successfully</span>,
      });
    } catch (error: any) {
      toast.error("Success", {
        richColors: true,
        position: "top-right",
        description: error.message || "Failed to add to cart:",
      });
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleIncrement = async () => {
    if (isOutOfStock || loading) return;

    try {
      await incrementQuantity(productId);
    } catch (error) {
      console.error("Failed to increment quantity:", error);
    }
  };

  const handleDecrement = async () => {
    if (loading) return;

    try {
      await decrementQuantity(productId);
    } catch (error) {
      console.error("Failed to decrement quantity:", error);
    }
  };

  if (isOutOfStock) {
    return (
      <Button
        variant="outline"
        size={size}
        className={`w-full ${className}`}
        disabled
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Out of Stock
      </Button>
    );
  }

  if (showQuantity && inCart) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={loading}
          className="w-8 h-8"
        >
          <Minus className="w-4 h-4" />
        </Button>

        <span className="w-8 text-center font-medium">{quantity}</span>

        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={loading || quantity >= stock}
          className="w-8 h-8"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      disabled={loading || isAdding}
      className={` ${className} rounded-full`}
    >
      {loading || isAdding ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <ShoppingCart className="w-4 h-4 mr-2" />
      )}
      {inCart ? "Added to Cart" : "Add to Cart"}
    </Button>
  );
};
