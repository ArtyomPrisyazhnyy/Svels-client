import { create } from 'zustand';
import {
  createGuestAddress,
  deleteGuestAddress,
  fetchGuestAddresses,
  setDefaultGuestAddress,
  updateGuestAddress,
} from '@/features/restaurants/api/guest-addresses.api';
import type {
  CreateGuestAddressPayload,
  GuestAddress,
  UpdateGuestAddressPayload,
} from '@/shared/types/guest-address';
import { pickGuestAddressPreselectId } from '@/features/restaurants/utils/guest-address.util';

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

interface RestaurantGuestAddresses {
  addresses: GuestAddress[];
  status: LoadStatus;
  selectedId: string | null;
}

interface GuestAddressesState {
  byRestaurant: Record<string, RestaurantGuestAddresses>;
  loadAddresses: (restaurantId: string, token: string) => Promise<void>;
  setSelectedId: (restaurantId: string, addressId: string | null) => void;
  createAddress: (
    restaurantId: string,
    token: string,
    payload: CreateGuestAddressPayload,
  ) => Promise<GuestAddress>;
  updateAddress: (
    restaurantId: string,
    token: string,
    addressId: string,
    payload: UpdateGuestAddressPayload,
  ) => Promise<GuestAddress>;
  removeAddress: (restaurantId: string, token: string, addressId: string) => Promise<void>;
  makeDefault: (restaurantId: string, token: string, addressId: string) => Promise<GuestAddress>;
  reset: () => void;
}

const addressLoadInflight = new Map<string, Promise<void>>();

function emptyRestaurantState(): RestaurantGuestAddresses {
  return { addresses: [], status: 'idle', selectedId: null };
}

function getRestaurantState(
  byRestaurant: Record<string, RestaurantGuestAddresses>,
  restaurantId: string,
): RestaurantGuestAddresses {
  return byRestaurant[restaurantId] ?? emptyRestaurantState();
}

function sortAddresses(addresses: GuestAddress[]): GuestAddress[] {
  return [...addresses].sort((a, b) => {
    if (a.isDefault !== b.isDefault) {
      return a.isDefault ? -1 : 1;
    }
    const aUsed = a.lastUsedAt ? Date.parse(a.lastUsedAt) : 0;
    const bUsed = b.lastUsedAt ? Date.parse(b.lastUsedAt) : 0;
    if (aUsed !== bUsed) {
      return bUsed - aUsed;
    }
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });
}

function withSelectedAfterListChange(
  addresses: GuestAddress[],
  previousSelectedId: string | null,
): string | null {
  if (addresses.length === 0) {
    return null;
  }
  if (previousSelectedId && addresses.some((row) => row.id === previousSelectedId)) {
    return previousSelectedId;
  }
  return pickGuestAddressPreselectId(addresses);
}

export const useGuestAddressesStore = create<GuestAddressesState>()((set) => ({
  byRestaurant: {},

  reset: () => set({ byRestaurant: {} }),

  setSelectedId: (restaurantId, addressId) => {
    set((state) => {
      const current = getRestaurantState(state.byRestaurant, restaurantId);
      return {
        byRestaurant: {
          ...state.byRestaurant,
          [restaurantId]: { ...current, selectedId: addressId },
        },
      };
    });
  },

  loadAddresses: (restaurantId, token) => {
    const inflight = addressLoadInflight.get(restaurantId);
    if (inflight) {
      return inflight;
    }

    const job = (async () => {
      set((state) => ({
        byRestaurant: {
          ...state.byRestaurant,
          [restaurantId]: {
            ...getRestaurantState(state.byRestaurant, restaurantId),
            status: 'loading',
          },
        },
      }));

      try {
        const rows = sortAddresses(await fetchGuestAddresses(restaurantId, token));
        set((state) => {
          const previous = getRestaurantState(state.byRestaurant, restaurantId);
          const selectedId = withSelectedAfterListChange(rows, previous.selectedId);
          return {
            byRestaurant: {
              ...state.byRestaurant,
              [restaurantId]: {
                addresses: rows,
                status: 'ready',
                selectedId,
              },
            },
          };
        });
      } catch {
        set((state) => ({
          byRestaurant: {
            ...state.byRestaurant,
            [restaurantId]: {
              ...getRestaurantState(state.byRestaurant, restaurantId),
              status: 'error',
            },
          },
        }));
      }
    })();

    addressLoadInflight.set(restaurantId, job);
    void job.finally(() => {
      if (addressLoadInflight.get(restaurantId) === job) {
        addressLoadInflight.delete(restaurantId);
      }
    });
    return job;
  },

  createAddress: async (restaurantId, token, payload) => {
    const created = await createGuestAddress(restaurantId, token, payload);
    set((state) => {
      const previous = getRestaurantState(state.byRestaurant, restaurantId);
      const addresses = sortAddresses([...previous.addresses, created]);
      const selectedId = payload.isDefault ? created.id : previous.selectedId ?? created.id;
      return {
        byRestaurant: {
          ...state.byRestaurant,
          [restaurantId]: {
            addresses,
            status: 'ready',
            selectedId,
          },
        },
      };
    });
    return created;
  },

  updateAddress: async (restaurantId, token, addressId, payload) => {
    const updated = await updateGuestAddress(restaurantId, token, addressId, payload);
    set((state) => {
      const previous = getRestaurantState(state.byRestaurant, restaurantId);
      const addresses = sortAddresses(
        previous.addresses.map((row) => (row.id === addressId ? updated : row)),
      );
      return {
        byRestaurant: {
          ...state.byRestaurant,
          [restaurantId]: {
            ...previous,
            addresses,
            status: 'ready',
          },
        },
      };
    });
    return updated;
  },

  removeAddress: async (restaurantId, token, addressId) => {
    await deleteGuestAddress(restaurantId, token, addressId);
    set((state) => {
      const previous = getRestaurantState(state.byRestaurant, restaurantId);
      const addresses = previous.addresses.filter((row) => row.id !== addressId);
      const selectedId = withSelectedAfterListChange(addresses, previous.selectedId);
      return {
        byRestaurant: {
          ...state.byRestaurant,
          [restaurantId]: {
            addresses,
            status: 'ready',
            selectedId,
          },
        },
      };
    });
  },

  makeDefault: async (restaurantId, token, addressId) => {
    const updated = await setDefaultGuestAddress(restaurantId, token, addressId);
    set((state) => {
      const previous = getRestaurantState(state.byRestaurant, restaurantId);
      const addresses = sortAddresses(
        previous.addresses.map((row) =>
          row.id === addressId
            ? updated
            : { ...row, isDefault: false },
        ),
      );
      return {
        byRestaurant: {
          ...state.byRestaurant,
          [restaurantId]: {
            ...previous,
            addresses,
            selectedId: previous.selectedId ?? addressId,
            status: 'ready',
          },
        },
      };
    });
    return updated;
  },
}));

export function resetGuestAddressesStore(): void {
  useGuestAddressesStore.getState().reset();
}
