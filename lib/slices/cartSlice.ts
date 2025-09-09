import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { cartApi, Cart, AddToCartRequest, UpdateCartItemRequest } from "@/lib/api/cartApi";
import { getGuestCart, convertGuestCartToServerFormat, clearGuestCart } from "@/lib/utils/guestCart";

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

// Async thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (payload, { rejectWithValue }) => {
    try {
      console.log(payload)
      const response = await cartApi.getCart();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || "Failed to fetch cart");
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
        return rejectWithValue(response.error || "Failed to add item to cart");
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
        return rejectWithValue(response.error || "Failed to update cart item");
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
        return rejectWithValue(response.error || "Failed to remove item from cart");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to remove item from cart");
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (payload, { rejectWithValue }) => {
    console.log(payload)
    try {
      const response = await cartApi.clearCart();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || "Failed to clear cart");
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
        return rejectWithValue(response.error || "Failed to increase quantity");
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
        return rejectWithValue(response.error || "Failed to decrease quantity");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to decrease quantity");
    }
  }
);

export const mergeGuestCart = createAsyncThunk(
  "cart/mergeGuestCart",
  async (payload, { rejectWithValue }) => {
    console.log(payload)
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
        return rejectWithValue(response.error || "Failed to merge guest cart");
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
  async (payload, { rejectWithValue }) => {
    console.log(payload)
    try {
      const response = await cartApi.getCart();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || "Failed to load guest cart");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to load guest cart");
    }
  }
);

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
export const selectCartItems = (state: { cart: CartState }) => state.cart.cart?.items || [];
export const selectCartTotalItems = (state: { cart: CartState }) => state.cart.cart?.totalItems || 0;
export const selectCartTotalAmount = (state: { cart: CartState }) => state.cart.cart?.totalAmount || 0;
export const selectCartSubtotal = (state: { cart: CartState }) => state.cart.cart?.subtotal || 0;
export const selectCartDeliveryFee = (state: { cart: CartState }) => state.cart.cart?.deliveryFee || 0;
export const selectIsAuthenticated = (state: { cart: CartState }) => state.cart.isAuthenticated;

export default cartSlice.reducer;
