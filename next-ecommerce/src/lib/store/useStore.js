/**
 * Zustand store for cart and user state
 * - Cart: items, add/remove/update quantities
 * - User: current user (for login state)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Cart item structure: { id, name, price, image, quantity }
export const useStore = create(
  persist(
    (set) => ({
      // Cart state
      cart: [],
      addToCart: (item, quantity = 1) =>
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          return {
            cart: [...state.cart, { ...item, quantity }],
          };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((i) => i.id !== id) };
          }
          return {
            cart: state.cart.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          };
        }),
      clearCart: () => set({ cart: [] }),

      // User state (for login - mock)
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: "ecommerce-storage" }
  )
);
