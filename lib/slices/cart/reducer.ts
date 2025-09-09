import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import type { Cart, CartItem } from "@/lib/api/cartApi";
import { addToCart, clearCart, decreaseQuantity, fetchCart, increaseQuantity, loadGuestCart, mergeGuestCart, removeFromCart, setAuthenticationStatus, updateCartItem } from "./action";

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  isAuthenticated: boolean;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  lastUpdated: null,
  isAuthenticated: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCartState: (state) => {
      state.cart = null;
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    },
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
      state.lastUpdated = Date.now();
    },
    setAuthenticationStatus: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update cart item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Remove from cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Clear cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Increase quantity
    builder
      .addCase(increaseQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(increaseQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Decrease quantity
    builder
      .addCase(decreaseQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(decreaseQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Merge guest cart
    builder
      .addCase(mergeGuestCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.cart = action.payload;
          state.lastUpdated = Date.now();
        }
        state.error = null;
      })
      .addCase(mergeGuestCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Set authentication status
    builder
      .addCase(setAuthenticationStatus.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload;
      });

    // Load guest cart
    builder
      .addCase(loadGuestCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadGuestCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(loadGuestCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCartState, setCart, setAuthenticationStatus: setAuthStatus } = cartSlice.actions;

// Selectors

export const selectCart = (state: { cart: CartState }) => state.cart.cart;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.loading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
// Use a shared empty array to avoid returning a new reference each time
const EMPTY_ITEMS: CartItem[] = [];
export const selectCartItems = createSelector(
  [(state: { cart: CartState }) => state.cart.cart?.items],
  (items) => items ?? EMPTY_ITEMS
);
export const selectCartTotalItems = (state: { cart: CartState }) => state.cart.cart?.totalItems || 0;
export const selectCartTotalAmount = (state: { cart: CartState }) => state.cart.cart?.totalAmount || 0;
export const selectCartSubtotal = (state: { cart: CartState }) => state.cart.cart?.subtotal || 0;
export const selectCartDeliveryFee = (state: { cart: CartState }) => state.cart.cart?.deliveryFee || 0;
export const selectIsAuthenticated = (state: { cart: CartState }) => state.cart.isAuthenticated;

export default cartSlice.reducer;
