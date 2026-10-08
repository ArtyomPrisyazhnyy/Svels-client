import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  addFavorite,
  fetchFavorites,
  mergeFavorites,
  removeFavorite,
} from '@/features/restaurants/api/favorites.api';

type FavoritesState = {
  restaurantId: string | null;
  menuItemIds: string[];
  hydrated: boolean;
  hydrate: (restaurantId: string) => Promise<void>;
  isFavorite: (menuItemId: string) => boolean;
  toggle: (restaurantId: string, menuItemId: string) => Promise<void>;
  mergeAfterLogin: (restaurantId: string) => Promise<void>;
  reset: () => void;
};

let writeGeneration = 0;

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids)];
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      restaurantId: null,
      menuItemIds: [],
      hydrated: false,

      hydrate: async (restaurantId) => {
        const started = writeGeneration;
        const localIds =
          get().restaurantId === restaurantId ? get().menuItemIds : [];
        try {
          const response = await fetchFavorites(restaurantId);
          if (started !== writeGeneration) {
            return;
          }
          const extras = localIds.filter((id) => !response.menuItemIds.includes(id));
          set({
            restaurantId,
            menuItemIds: uniqueIds([...response.menuItemIds, ...extras]),
            hydrated: true,
          });
        } catch {
          if (started !== writeGeneration) {
            return;
          }
          set({ restaurantId, menuItemIds: localIds, hydrated: true });
        }
      },

      isFavorite: (menuItemId) => get().menuItemIds.includes(menuItemId),

      toggle: async (restaurantId, menuItemId) => {
        writeGeneration += 1;
        const started = writeGeneration;
        const prev = get().menuItemIds;
        const wasFavorite = prev.includes(menuItemId);
        const next = wasFavorite
          ? prev.filter((id) => id !== menuItemId)
          : [...prev, menuItemId];
        set({ menuItemIds: next, restaurantId });

        try {
          const response = wasFavorite
            ? await removeFavorite(restaurantId, menuItemId)
            : await addFavorite(restaurantId, menuItemId);
          if (started !== writeGeneration) {
            return;
          }
          const extras = next.filter((id) => !response.menuItemIds.includes(id));
          set({ menuItemIds: uniqueIds([...response.menuItemIds, ...extras]) });
        } catch {
          // Не откатываем: лайк уже в стейте и в persist.
        }
      },

      mergeAfterLogin: async (restaurantId) => {
        writeGeneration += 1;
        const started = writeGeneration;
        try {
          const response = await mergeFavorites(restaurantId);
          if (started !== writeGeneration) {
            return;
          }
          set({ restaurantId, menuItemIds: response.menuItemIds, hydrated: true });
        } catch {
          await get().hydrate(restaurantId);
        }
      },

      reset: () => {
        writeGeneration += 1;
        set({ restaurantId: null, menuItemIds: [], hydrated: false });
      },
    }),
    {
      name: 'svels-favorites',
      skipHydration: true,
      partialize: (state) => ({
        restaurantId: state.restaurantId,
        menuItemIds: state.menuItemIds,
      }),
    },
  ),
);
