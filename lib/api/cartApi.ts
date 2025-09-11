import { httpClient, HttpResult } from "@/lib/httpClient";
import { 
  getGuestCart, 
  addToGuestCart, 
  updateGuestCartItem, 
  removeFromGuestCart, 
  clearGuestCartItems,
  GuestCart
} from "@/lib/utils/guestCart";

export interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    unit: string;
    image: string;
    stock: number;
    stockLabel: string;
    isActive: boolean;
  };
  quantity: number;
  price: number;
  originalPrice?: number;
  unit: string;
  name: string;
  image: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  deliveryFee: number;
  subtotal: number;
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    code?: string;
  };
  appliedCoupon?: string;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  formattedTotalAmount: string;
  formattedSubtotal: string;
  formattedDeliveryFee: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  productName?: string;
  price?: number;
  originalPrice?: number;
  unit?: string;
  image?: string;
}

export interface UpdateCartItemRequest {
  productId: string;
  quantity: number;
}

export type CartApiResponse = HttpResult<Cart>;

class CartApi {
  private baseUrl = "/api/cart";
  private isAuthenticated = false; // Integrate with your auth state externally

  /**
   * Get user's cart or guest cart
   */
  async getCart(): Promise<CartApiResponse> {
    if (this.isAuthenticated) {
      return await httpClient.get<Cart>(this.baseUrl);
    } else {
      // Return guest cart
      const guestCart = getGuestCart();
      return {
        success: true,
        data: this.convertGuestCartToCart(guestCart),
      };
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(data: AddToCartRequest): Promise<CartApiResponse> {
    if (this.isAuthenticated) {
      return await httpClient.post<Cart>(this.baseUrl, data);
    } else {
      // Add to guest cart
      if (!data.productName || !data.price || !data.unit || !data.image) {
        return {
          success: false,
          error: "Product details required for guest cart",
          code: "MISSING_PRODUCT_DETAILS",
        };
      }

      const guestCart = addToGuestCart({
        productId: data.productId,
        productName: data.productName,
        price: data.price,
        originalPrice: data.originalPrice,
        unit: data.unit,
        image: data.image,
        quantity: data.quantity,
      });

      return {
        success: true,
        data: this.convertGuestCartToCart(guestCart),
        message: "Item added to guest cart",
      };
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(data: UpdateCartItemRequest): Promise<CartApiResponse> {
    if (this.isAuthenticated) {
      return await httpClient.put<Cart>(this.baseUrl, data);
    } else {
      // Update guest cart
      const guestCart = updateGuestCartItem(data.productId, data.quantity);
      return {
        success: true,
        data: this.convertGuestCartToCart(guestCart),
        message: "Guest cart updated",
      };
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(productId: string): Promise<CartApiResponse> {
    if (this.isAuthenticated) {
      return await httpClient.delete<Cart>(`${this.baseUrl}?productId=${productId}`);
    } else {
      // Remove from guest cart
      const guestCart = removeFromGuestCart(productId);
      return {
        success: true,
        data: this.convertGuestCartToCart(guestCart),
        message: "Item removed from guest cart",
      };
    }
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<CartApiResponse> {
    if (this.isAuthenticated) {
      return await httpClient.delete<Cart>(`${this.baseUrl}?clearAll=true`);
    } else {
      // Clear guest cart
      const guestCart = clearGuestCartItems();
      return {
        success: true,
        data: this.convertGuestCartToCart(guestCart),
        message: "Guest cart cleared",
      };
    }
  }

  /**
   * Increase item quantity by 1
   */
  async increaseQuantity(productId: string): Promise<CartApiResponse> {
    try {
      // First get current cart to find current quantity
      const cartResponse = await this.getCart();
      if (!cartResponse.success || !cartResponse.data) {
        return cartResponse;
      }

      const currentItem = cartResponse.data.items.find(
        item => item.product._id === productId
      );

      if (!currentItem) {
        return {
          success: false,
          error: "Item not found in cart",
          code: "ITEM_NOT_FOUND",
        };
      }

      return await this.updateCartItem({
        productId,
        quantity: currentItem.quantity + 1,
      });
    } catch {
      return {
        success: false,
        error: "Failed to increase quantity",
        code: "INCREASE_QUANTITY_ERROR",
      };
    }
  }

  /**
   * Decrease item quantity by 1
   */
  async decreaseQuantity(productId: string): Promise<CartApiResponse> {
    try {
      // First get current cart to find current quantity
      const cartResponse = await this.getCart();
      if (!cartResponse.success || !cartResponse.data) {
        return cartResponse;
      }

      const currentItem = cartResponse.data.items.find(
        item => item.product._id === productId
      );

      if (!currentItem) {
        return {
          success: false,
          error: "Item not found in cart",
          code: "ITEM_NOT_FOUND",
        };
      }

      const newQuantity = Math.max(0, currentItem.quantity - 1);
      return await this.updateCartItem({
        productId,
        quantity: newQuantity,
      });
    } catch {
      return {
        success: false,
        error: "Failed to decrease quantity",
        code: "DECREASE_QUANTITY_ERROR",
      };
    }
  }

  /**
   * Merge guest cart with user cart after login
   */
  async mergeGuestCart(guestCartItems: any[]): Promise<CartApiResponse> {
    return await httpClient.post<Cart>(`${this.baseUrl}/merge-guest`, { guestCartItems });
  }

  /**
   * Set authentication status
   */
  setAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }

  /**
   * Convert guest cart to Cart format
   */
  private convertGuestCartToCart(guestCart: GuestCart): Cart {
    return {
      _id: 'guest-cart',
      user: 'guest',
      items: guestCart.items.map(item => ({
        product: {
          _id: item.productId,
          name: item.productName,
          price: item.price,
          originalPrice: item.originalPrice,
          unit: item.unit,
          image: item.image,
          stock: 999, // Default stock for guest cart
          stockLabel: 'In Stock',
          isActive: true,
        },
        quantity: item.quantity,
        price: item.price,
        originalPrice: item.originalPrice,
        unit: item.unit,
        name: item.productName,
        image: item.image,
      })),
      totalItems: guestCart.totalItems,
      totalAmount: guestCart.totalAmount,
      deliveryFee: guestCart.deliveryFee,
      subtotal: guestCart.subtotal,
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: guestCart.lastUpdated,
      updatedAt: guestCart.lastUpdated,
      formattedTotalAmount: `Php ${guestCart.totalAmount.toFixed(2)}`,
      formattedSubtotal: `Php ${guestCart.subtotal.toFixed(2)}`,
      formattedDeliveryFee: `Php ${guestCart.deliveryFee.toFixed(2)}`,
    };
  }
}

export const cartApi = new CartApi();
export default cartApi;
