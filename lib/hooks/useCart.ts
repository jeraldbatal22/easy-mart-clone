import { useCallback, useEffect } from "react";
// import { useSelector } from "react-redux";

import { AddToCartRequest, UpdateCartItemRequest } from "@/lib/api/cartApi";
import { useAuth } from "./useAuth";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  clearError,
  selectCart,
  selectCartDeliveryFee,
  selectCartError,
  selectCartItems,
  selectCartLoading,
  selectCartSubtotal,
  selectCartTotalAmount,
  selectCartTotalItems,
  // selectIsAuthenticated,
} from "../slices/cart/reducer";
import {
  addToCart,
  clearCart,
  decreaseQuantity,
  fetchCart,
  increaseQuantity,
  loadGuestCart,
  removeFromCart,
  setAuthenticationStatus,
  updateCartItem,
} from "../slices/cart/action";

export const useCart = (props?: { autoLoad?: boolean }) => {
  const autoLoad = props?.autoLoad ?? false;
  const dispatch = useAppDispatch();

  // Selectors
  const cart = useAppSelector(selectCart);
  const loading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartError);
  const items = useAppSelector(selectCartItems);
  const totalItems = useAppSelector(selectCartTotalItems);
  const totalAmount = useAppSelector(selectCartTotalAmount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const deliveryFee = useAppSelector(selectCartDeliveryFee);
  // const isAuthenticatedCart = useSelector(selectIsAuthenticated);
  const { isAuthenticated } = useAuth();
  // Actions
  const loadCart = useCallback(() => {
    if (!autoLoad) return;
    if (isAuthenticated) {
      setAuthStatus(true);
      dispatch(fetchCart());
    } else {
      dispatch(loadGuestCart());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isAuthenticated, autoLoad]);

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
