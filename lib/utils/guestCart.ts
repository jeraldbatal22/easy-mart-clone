import { CartItem } from "@/lib/api/cartApi";

export interface GuestCartItem {
  productId: string;
  productName: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  quantity: number;
  addedAt: string;
}

export interface GuestCart {
  items: GuestCartItem[];
  totalItems: number;
  totalAmount: number;
  deliveryFee: number;
  subtotal: number;
  lastUpdated: string;
}

const GUEST_CART_KEY = 'easy_mart_guest_cart';

// Default guest cart
const createEmptyGuestCart = (): GuestCart => ({
  items: [],
  totalItems: 0,
  totalAmount: 0,
  deliveryFee: 5.78,
  subtotal: 5.78,
  lastUpdated: new Date().toISOString(),
});

// Get guest cart from localStorage
export const getGuestCart = (): GuestCart => {
  if (typeof window === 'undefined') {
    return createEmptyGuestCart();
  }

  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    if (!stored) {
      return createEmptyGuestCart();
    }

    const parsed = JSON.parse(stored);
    
    // Validate the structure
    if (!parsed.items || !Array.isArray(parsed.items)) {
      return createEmptyGuestCart();
    }

    return {
      items: parsed.items || [],
      totalItems: parsed.totalItems || 0,
      totalAmount: parsed.totalAmount || 0,
      deliveryFee: parsed.deliveryFee || 5.78,
      subtotal: parsed.subtotal || 5.78,
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error parsing guest cart from localStorage:', error);
    return createEmptyGuestCart();
  }
};

// Save guest cart to localStorage
export const saveGuestCart = (cart: GuestCart): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const cartToSave = {
      ...cart,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartToSave));
  } catch (error) {
    console.error('Error saving guest cart to localStorage:', error);
  }
};

// Clear guest cart from localStorage
export const clearGuestCart = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch (error) {
    console.error('Error clearing guest cart from localStorage:', error);
  }
};

// Add item to guest cart
export const addToGuestCart = (item: Omit<GuestCartItem, 'addedAt'>): GuestCart => {
  const cart = getGuestCart();
  const existingItemIndex = cart.items.findIndex(
    cartItem => cartItem.productId === item.productId
  );

  if (existingItemIndex !== -1) {
    // Update existing item
    cart.items[existingItemIndex].quantity += item.quantity;
  } else {
    // Add new item
    cart.items.push({
      ...item,
      addedAt: new Date().toISOString(),
    });
  }

  // Recalculate totals
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cart.subtotal = cart.totalAmount + cart.deliveryFee;

  saveGuestCart(cart);
  return cart;
};

// Update item quantity in guest cart
export const updateGuestCartItem = (productId: string, quantity: number): GuestCart => {
  const cart = getGuestCart();
  const itemIndex = cart.items.findIndex(item => item.productId === productId);

  if (itemIndex === -1) {
    return cart;
  }

  if (quantity <= 0) {
    // Remove item
    cart.items.splice(itemIndex, 1);
  } else {
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
  }

  // Recalculate totals
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cart.subtotal = cart.totalAmount + cart.deliveryFee;

  saveGuestCart(cart);
  return cart;
};

// Remove item from guest cart
export const removeFromGuestCart = (productId: string): GuestCart => {
  const cart = getGuestCart();
  cart.items = cart.items.filter(item => item.productId !== productId);

  // Recalculate totals
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cart.subtotal = cart.totalAmount + cart.deliveryFee;

  saveGuestCart(cart);
  return cart;
};

// Clear guest cart
export const clearGuestCartItems = (): GuestCart => {
  const emptyCart = createEmptyGuestCart();
  saveGuestCart(emptyCart);
  return emptyCart;
};

// Convert guest cart to server format for merging
export const convertGuestCartToServerFormat = (guestCart: GuestCart) => {
  return guestCart.items.map(item => ({
    product: item.productId,
    quantity: item.quantity,
    price: item.price,
    originalPrice: item.originalPrice,
    unit: item.unit,
    name: item.productName,
    image: item.image,
  }));
};

// Check if guest cart has items
export const hasGuestCartItems = (): boolean => {
  const cart = getGuestCart();
  return cart.items.length > 0;
};

// Get guest cart item count
export const getGuestCartItemCount = (): number => {
  const cart = getGuestCart();
  return cart.totalItems;
};

// Format price helper
export const formatGuestCartPrice = (price: number): string => {
  return `Php ${price.toFixed(2)}`;
};
