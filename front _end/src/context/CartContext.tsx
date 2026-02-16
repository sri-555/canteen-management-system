import React, { useState, createContext, useContext } from 'react';
import { MenuItem } from '../types';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (menuItem: MenuItem) => void;
  removeFromCart: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, delta: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  foodCourtId: number | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [foodCourtId, setFoodCourtId] = useState<number | null>(null);

  const addToCart = (menuItem: MenuItem) => {
    // Check if adding from different food court
    if (foodCourtId && foodCourtId !== menuItem.food_court) {
      if (!confirm('Adding items from a different food court will clear your current cart. Continue?')) {
        return;
      }
      setItems([]);
    }
    
    setFoodCourtId(menuItem.food_court);
    
    setItems((current) => {
      const existing = current.find((item) => item.menuItem.id === menuItem.id);
      if (existing) {
        return current.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { menuItem, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (menuItemId: number) => {
    setItems((current) => {
      const filtered = current.filter((item) => item.menuItem.id !== menuItemId);
      if (filtered.length === 0) {
        setFoodCourtId(null);
      }
      return filtered;
    });
  };

  const updateQuantity = (menuItemId: number, delta: number) => {
    setItems((current) =>
      current
        .map((item) => {
          if (item.menuItem.id === menuItemId) {
            const newQuantity = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
    setFoodCourtId(null);
  };

  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.menuItem.price) * item.quantity,
    0
  );
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        isOpen,
        setIsOpen,
        foodCourtId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}