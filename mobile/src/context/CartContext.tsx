import React, { createContext, useContext, useMemo, useState } from 'react';
import { CartActionResult, CartItem, Product } from '../types';
import { getSizePrice } from '../utils/pricing';

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, size: string) => CartActionResult;
  updateQuantity: (productId: string, size: string, quantity: number) => CartActionResult;
  removeItem: (productId: string, size: string) => void;
  clearCart: () => void;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const getReservedQuantity = (cartItems: CartItem[], productId: string, excludeSize?: string) =>
    cartItems.reduce((sum, item) => {
      if (item.product._id !== productId) {
        return sum;
      }

      if (excludeSize && item.size === excludeSize) {
        return sum;
      }

      return sum + item.quantity;
    }, 0);

  const addToCart = (product: Product, quantity: number, size: string) => {
    let result: CartActionResult = { ok: true };

    setItems((current) => {
      const requestedQuantity = Number(quantity || 0);
      if (!Number.isInteger(requestedQuantity) || requestedQuantity <= 0) {
        result = { ok: false, message: 'Quantity must be at least 1.' };
        return current;
      }

      const reserved = getReservedQuantity(current, product._id, size);
      const existing = current.find(
        (item) => item.product._id === product._id && item.size === size
      );
      const nextQuantity = reserved + (existing?.quantity || 0) + requestedQuantity;

      if (nextQuantity > product.stock) {
        result = {
          ok: false,
          message: `You ordered too many "${product.name}". Only ${product.stock} item(s) are available.`
        };
        return current;
      }

      if (existing) {
        return current.map((item) =>
          item.product._id === product._id && item.size === size
            ? { ...item, quantity: item.quantity + requestedQuantity }
            : item
        );
      }

      return [...current, { product, quantity: requestedQuantity, size }];
    });

    return result;
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) =>
        current.filter((item) => !(item.product._id === productId && item.size === size))
      );
      return { ok: true };
    }

    let result: CartActionResult = { ok: true };

    setItems((current) =>
      current.map((item) => {
        if (!(item.product._id === productId && item.size === size)) {
          return item;
        }

        const reserved = getReservedQuantity(current, productId, size);
        if (reserved + quantity > item.product.stock) {
          result = {
            ok: false,
            message: `You ordered too many "${item.product.name}". Only ${item.product.stock} item(s) are available.`
          };
          return item;
        }

        return { ...item, quantity };
      })
    );

    return result;
  };

  const removeItem = (productId: string, size: string) => {
    setItems((current) =>
      current.filter((item) => !(item.product._id === productId && item.size === size))
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + getSizePrice(item.product.price, item.size) * item.quantity,
        0
      ),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      subtotal
    }),
    [items, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
};
