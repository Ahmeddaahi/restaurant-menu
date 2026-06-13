import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem } from "@/lib/menu";

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.item.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.item.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { item, quantity: 1 }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.item.id === id ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      totalItems: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (acc, i) => acc + i.item.price * i.quantity,
          0
        ),
    }),
    {
      name: "nadi-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
