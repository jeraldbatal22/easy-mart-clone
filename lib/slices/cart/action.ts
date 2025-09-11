import cartApi, { AddToCartRequest, UpdateCartItemRequest } from "@/lib/api/cartApi";
import { clearGuestCart, convertGuestCartToServerFormat, getGuestCart } from "@/lib/utils/guestCart";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.getCart();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue("Failed to fetch cart");
      }
    } catch (error: any) {
      console.log(error, "error")
      return rejectWithValue(error.message || "Failed to fetch cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (data: AddToCartRequest, { rejectWithValue }) => {
    try {
      const response = await cartApi.addToCart(data);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue("Failed to add item to cart");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add item to cart");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (data: UpdateCartItemRequest, { rejectWithValue }) => {
    try {
      const response = await cartApi.updateCartItem(data);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue("Failed to update cart item");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update cart item");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await cartApi.removeFromCart(productId);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue("Failed to remove item from cart");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to remove item from cart");
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.clearCart();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue("Failed to clear cart");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to clear cart");
    }
  }
);

export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await cartApi.increaseQuantity(productId);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue("Failed to increase quantity");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to increase quantity");
    }
  }
);

export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await cartApi.decreaseQuantity(productId);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue("Failed to decrease quantity");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to decrease quantity");
    }
  }
);

export const mergeGuestCart = createAsyncThunk(
  "cart/mergeGuestCart",
  async (_, { rejectWithValue }) => {
    try {
      const guestCart = getGuestCart();
      if (guestCart.items.length === 0) {
        return null;
      }

      const guestCartItems = convertGuestCartToServerFormat(guestCart);
      const response = await cartApi.mergeGuestCart(guestCartItems);
      
      if (response.success && response.data) {
        // Clear guest cart after successful merge
        clearGuestCart();
        return response.data;
      } else {
        return rejectWithValue("Failed to merge guest cart");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to merge guest cart");
    }
  }
);

export const setAuthenticationStatus = createAsyncThunk(
  "cart/setAuthenticationStatus",
  async (isAuthenticated: boolean, { dispatch }) => {
    cartApi.setAuthenticated(isAuthenticated);
    
    if (isAuthenticated) {
      // If user just logged in, try to merge guest cart
      dispatch(mergeGuestCart());
    } else {
      // If user logged out, load guest cart
      dispatch(loadGuestCart());
    }
    
    return isAuthenticated;
  }
);

export const loadGuestCart = createAsyncThunk(
  "cart/loadGuestCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartApi.getCart();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue("Failed to load guest cart");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to load guest cart");
    }
  }
);