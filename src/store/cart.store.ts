import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartCheckoutDraft, CartLineItem } from '@/shared/types/cart';
import { createDefaultCheckoutDraft } from '@/shared/types/cart';
import { normalizePhoneForPhoneInput } from '@/shared/utils/phone.util';
import { commerceEpoch, registerCartReset } from './commerce-session';

const CART_PERSIST_VERSION = 2;

interface CartPersistedV0 {
  restaurantId: string | null;
  items: CartLineItem[];
}

interface CartPersistedV1 extends CartPersistedV0 {
  version: number;
  checkoutByRestaurant: Record<string, CartCheckoutDraft>;
}

interface CartState extends CartPersistedV1 {
  addLine: (restaurantId: string, line: CartLineItem) => void;
  removeLine: (lineId: string) => void;
  updateLineQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  getRestaurantItems: (restaurantId: string) => CartLineItem[];
  getRestaurantTotals: (restaurantId: string) => { itemCount: number; totalAmount: number };
  getCheckoutDraft: (restaurantId: string, defaultFulfillment?: CartCheckoutDraft['fulfillment']) => CartCheckoutDraft;
  patchCheckoutDraft: (restaurantId: string, patch: Partial<CartCheckoutDraft>) => void;
}

function normalizeCheckoutDraft(draft: CartCheckoutDraft): CartCheckoutDraft {
  const defaults = createDefaultCheckoutDraft(draft.fulfillment);
  return {
    ...defaults,
    ...draft,
    phone: normalizePhoneForPhoneInput(draft.phone),
    recipientPhone: normalizePhoneForPhoneInput(draft.recipientPhone),
    saveDeliveryAddress: draft.saveDeliveryAddress ?? defaults.saveDeliveryAddress,
    deliveryAddressLabel: draft.deliveryAddressLabel ?? defaults.deliveryAddressLabel,
    saveAddressPromptVisible:
      draft.saveAddressPromptVisible ?? defaults.saveAddressPromptVisible,
  };
}

function normalizeCheckoutMap(
  map: Record<string, CartCheckoutDraft> | undefined,
): Record<string, CartCheckoutDraft> {
  if (!map || typeof map !== 'object') {
    return {};
  }
  return Object.fromEntries(
    Object.entries(map).map(([restaurantId, draft]) => [
      restaurantId,
      normalizeCheckoutDraft(draft),
    ]),
  );
}

function migratePersistedState(persisted: unknown, _version: number): CartPersistedV1 {
  if (persisted && typeof persisted === 'object') {
    const state = persisted as Partial<CartPersistedV1>;
    const checkoutByRestaurant = normalizeCheckoutMap(state.checkoutByRestaurant);
    return {
      version: CART_PERSIST_VERSION,
      restaurantId: state.restaurantId ?? null,
      items: Array.isArray(state.items) ? state.items : [],
      checkoutByRestaurant,
    };
  }

  const legacy = (persisted ?? {}) as CartPersistedV0;
  return {
    version: CART_PERSIST_VERSION,
    restaurantId: legacy.restaurantId ?? null,
    items: Array.isArray(legacy.items) ? legacy.items : [],
    checkoutByRestaurant: {},
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      version: CART_PERSIST_VERSION,
      restaurantId: null,
      items: [],
      checkoutByRestaurant: {},

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
        const items = get().getRestaurantItems(restaurantId);
        return {
          itemCount: items.reduce((sum, line) => sum + line.quantity, 0),
          totalAmount: items.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
        };
      },

      getCheckoutDraft: (restaurantId, defaultFulfillment = 'fulfillmentTakeaway') => {
        const existing = get().checkoutByRestaurant[restaurantId];
        if (existing) {
          return normalizeCheckoutDraft(existing);
        }
        return createDefaultCheckoutDraft(defaultFulfillment);
      },

      patchCheckoutDraft: (restaurantId, patch) => {
        const state = get();
        const current =
          state.checkoutByRestaurant[restaurantId] ??
          createDefaultCheckoutDraft(patch.fulfillment ?? 'fulfillmentTakeaway');
        set({
          checkoutByRestaurant: {
            ...state.checkoutByRestaurant,
            [restaurantId]: normalizeCheckoutDraft({ ...current, ...patch }),
          },
        });
      },
    }),
    {
      name: 'svels-cart',
      skipHydration: true,
      version: CART_PERSIST_VERSION,
      migrate: migratePersistedState,
      partialize: (state) => ({
        version: state.version,
        restaurantId: state.restaurantId,
        items: state.items,
        checkoutByRestaurant: state.checkoutByRestaurant,
      }),
    },
  ),
);

registerCartReset(() => {
  useCartStore.getState().clearCart();
});

/** Re-read storage. A logout that lands mid-flight wins over the stale snapshot. */
export function rehydrateCartStore(): Promise<void> {
  const ticket = commerceEpoch();
  return Promise.resolve(useCartStore.persist.rehydrate()).then(() => {
    if (ticket !== commerceEpoch()) {
      useCartStore.getState().clearCart();
    }
  });
}

if (typeof window !== 'undefined') {
  void rehydrateCartStore();
}
