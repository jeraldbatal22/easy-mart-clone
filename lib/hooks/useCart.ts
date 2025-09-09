import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  clearError,
  setAuthenticationStatus,
  loadGuestCart,
  selectCart,
  selectCartLoading,
  selectCartError,
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalAmount,
  selectCartSubtotal,
  selectCartDeliveryFee,
  // selectIsAuthenticated,
} from "@/lib/slices/cartSlice";
import { AddToCartRequest, UpdateCartItemRequest } from "@/lib/api/cartApi";
import { useAuth } from "./useAuth";
import { useClientOnly } from "./useClientOnly";
import { useAppDispatch } from "../hooks";

export const useCart = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const cart = useSelector(selectCart);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const items = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const totalAmount = useSelector(selectCartTotalAmount);
  const subtotal = useSelector(selectCartSubtotal);
  const deliveryFee = useSelector(selectCartDeliveryFee);
  // const isAuthenticatedCart = useSelector(selectIsAuthenticated);
  const { isAuthenticated } = useAuth();
  const isClient = useClientOnly();
  // Actions
  const loadCart = useCallback(() => {
    if (isAuthenticated && isClient) {
      setAuthStatus(true);
      dispatch(fetchCart());
    } else {
      dispatch(loadGuestCart());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isClient]);

  const addItemToCart = useCallback(
    (data: AddToCartRequest) => {
      console.log(data);
      return dispatch(addToCart(data));
    },
    [dispatch]
  );

  const updateItemQuantity = useCallback(
    (data: UpdateCartItemRequest) => {
      return dispatch(updateCartItem(data));
    },
    [dispatch]
  );

  const removeItemFromCart = useCallback(
    (productId: string) => {
      return dispatch(removeFromCart(productId));
    },
    [dispatch]
  );

  const clearCartItems = useCallback(() => {
    return dispatch(clearCart());
  }, [dispatch]);

  const incrementQuantity = useCallback(
    (productId: string) => {
      return dispatch(increaseQuantity(productId));
    },
    [dispatch]
  );

  const decrementQuantity = useCallback(
    (productId: string) => {
      return dispatch(decreaseQuantity(productId));
    },
    [dispatch]
  );

  const clearCartError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setAuthStatus = useCallback(
    (authenticated: boolean) => {
      dispatch(setAuthenticationStatus(authenticated));
    },
    [dispatch]
  );

  // Auto-load cart on mount and when authentication status changes
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Helper functions
  const getItemQuantity = useCallback(
    (productId: string) => {
      const item = items.find((item) => item.product._id === productId);
      return item ? item.quantity : 0;
    },
    [items]
  );

  const isItemInCart = useCallback(
    (productId: string) => {
      return items.some((item) => item.product._id === productId);
    },
    [items]
  );

  const getItemTotal = useCallback(
    (productId: string) => {
      const item = items.find((item) => item.product._id === productId);
      return item ? item.price * item.quantity : 0;
    },
    [items]
  );

  const formatPrice = useCallback((price: number) => {
    return `Php ${price.toFixed(2)}`;
  }, []);

  return {
    // State
    cart,
    loading,
    error,
    items,
    totalItems,
    totalAmount,
    subtotal,
    deliveryFee,
    isAuthenticated,

    // Actions
    loadCart,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCartItems,
    incrementQuantity,
    decrementQuantity,
    clearCartError,
    setAuthStatus,

    // Helpers
    getItemQuantity,
    isItemInCart,
    getItemTotal,
    formatPrice,
  };
};
