import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartLineItem } from '@/shared/types/cart';
import { getCartTotals } from '@/features/restaurants/utils/cart.util';

interface CartState {
  restaurantId: string | null;
  items: CartLineItem[];
  addLine: (restaurantId: string, line: CartLineItem) => void;
  removeLine: (lineId: string) => void;
  updateLineQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  getRestaurantItems: (restaurantId: string) => CartLineItem[];
  getRestaurantTotals: (restaurantId: string) => { itemCount: number; totalAmount: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      restaurantId: null,
      items: [],

      addLine: (restaurantId, line) => {
        const state = get();
        const isSameRestaurant = !state.restaurantId || state.restaurantId === restaurantId;
        const currentItems = isSameRestaurant ? state.items : [];
        const existingIndex = currentItems.findIndex((item) => item.lineKey === line.lineKey);

        if (existingIndex >= 0) {
          const nextItems = currentItems.map((item, index) =>
            index === existingIndex
              ? { ...item, quantity: item.quantity + line.quantity }
              : item,
          );

          set({ restaurantId, items: nextItems });
          return;
        }

        set({
          restaurantId,
          items: [...currentItems, line],
        });
      },

      removeLine: (lineId) => {
        const nextItems = get().items.filter((item) => item.id !== lineId);
        set({
          items: nextItems,
          restaurantId: nextItems.length ? get().restaurantId : null,
        });
      },

      updateLineQuantity: (lineId, quantity) => {
        if (quantity < 1) {
          get().removeLine(lineId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.id === lineId ? { ...item, quantity } : item,
          ),
        });
      },

      clearCart: () => set({ restaurantId: null, items: [] }),

      getRestaurantItems: (restaurantId) => {
        const state = get();
        if (state.restaurantId !== restaurantId) {
          return [];
        }

        return state.items;
      },

      getRestaurantTotals: (restaurantId) => {
        return getCartTotals(get().getRestaurantItems(restaurantId));
      },
    }),
    {
      name: 'svels-cart',
      skipHydration: true,
    },
  ),
);
