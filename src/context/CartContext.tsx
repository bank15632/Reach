"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// Types
export interface CartItem {
  id: string;
  name: string;
  nameTh: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  color?: {
    name: string;
    nameTh: string;
    hex: string;
  };
  size?: string;
  category: "rackets" | "shoes" | "sportswear" | "supplements" | "bundles";
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, color?: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  isInCart: (id: string, color?: string, size?: string) => boolean;
  getItemQuantity: (id: string, color?: string, size?: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Generate unique key for cart item (id + color + size)
function getCartItemKey(id: string, color?: string, size?: string): string {
  return `${id}-${color || "default"}-${size || "default"}`;
}

// Cart Provider
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("reach-cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setItems(parsed);
      } catch (e) {
        console.error("Failed to parse cart from localStorage:", e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("reach-cart", JSON.stringify(items));
    }
  }, [items, isHydrated]);

  // Calculate totals
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discount = items.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  const total = subtotal;

  // Add item to cart
  const addItem = useCallback((newItem: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.color?.name === newItem.color?.name &&
          item.size === newItem.size
      );

      if (existingIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...currentItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + quantity,
        };
        return updatedItems;
      }

      // Add new item
      return [...currentItems, { ...newItem, quantity }];
    });
  }, []);

  // Remove item from cart
  const removeItem = useCallback((id: string, color?: string, size?: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.id === id &&
            item.color?.name === color &&
            item.size === size
          )
      )
    );
  }, []);

  // Update item quantity
  const updateQuantity = useCallback(
    (id: string, quantity: number, color?: string, size?: string) => {
      if (quantity <= 0) {
        removeItem(id, color, size);
        return;
      }

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === id &&
          item.color?.name === color &&
          item.size === size
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeItem]
  );

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Check if item is in cart
  const isInCart = useCallback(
    (id: string, color?: string, size?: string) => {
      return items.some(
        (item) =>
          item.id === id &&
          item.color?.name === color &&
          item.size === size
      );
    },
    [items]
  );

  // Get quantity of specific item
  const getItemQuantity = useCallback(
    (id: string, color?: string, size?: string) => {
      const item = items.find(
        (item) =>
          item.id === id &&
          item.color?.name === color &&
          item.size === size
      );
      return item?.quantity || 0;
    },
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
