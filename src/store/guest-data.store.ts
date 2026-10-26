import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import type { Booking, BookingAvailability } from '@/shared/types/booking';
import type { OrderDto } from '@/shared/types/pre-order';
import {
  GUEST_DATA_PERSIST_VERSION,
  GUEST_DATA_STORAGE_KEY,
  decodeGuestDataStorage,
  emptyGuestDataPersisted,
  guestDataCacheKey,
  isGuestDataFresh,
  migrateGuestDataPersisted,
  nextGuestDataAfterUserChange,
  type GuestDataCacheEntry,
  type GuestDataPersistedV1,
} from './guest-data.logic';

const serverMemory = new Map<string, string>();

function backingStorage(): StateStorage {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return {
    getItem: (name) => serverMemory.get(name) ?? null,
    setItem: (name, value) => {
      serverMemory.set(name, value);
    },
    removeItem: (name) => {
      serverMemory.delete(name);
    },
  };
}

function readBootState(): GuestDataPersistedV1 {
  try {
    const raw = backingStorage().getItem(GUEST_DATA_STORAGE_KEY);
    if (typeof raw !== 'string') {
      return emptyGuestDataPersisted();
    }
    return decodeGuestDataStorage(raw);
  } catch {
    return emptyGuestDataPersisted();
  }
}

const boot = readBootState();

interface GuestDataState extends GuestDataPersistedV1 {
  ordersByKey: Record<string, GuestDataCacheEntry<OrderDto[]>>;
  bookingsByKey: Record<string, GuestDataCacheEntry<Booking[]>>;
  availabilityByKey: Record<string, GuestDataCacheEntry<BookingAvailability>>;
  refreshingOrders: Record<string, boolean>;
  refreshingBookings: Record<string, boolean>;
  ordersError: Record<string, string | null>;
  bookingsError: Record<string, string | null>;
  setOrders: (userId: string, restaurantId: string, orders: OrderDto[]) => void;
  setBookings: (userId: string, restaurantId: string, bookings: Booking[]) => void;
  setAvailability: (restaurantId: string, date: string, availability: BookingAvailability) => void;
  isFresh: (entry: GuestDataCacheEntry<unknown> | undefined) => boolean;
}

let abortInflightRequests: () => void = () => {};

export function registerGuestDataRequestAbort(abort: () => void): void {
  abortInflightRequests = abort;
}

export const useGuestDataStore = create<GuestDataState>()(
  persist(
    (set) => ({
      ownerUserId: boot.ownerUserId,
      ordersByKey: boot.ordersByKey as Record<string, GuestDataCacheEntry<OrderDto[]>>,
      bookingsByKey: boot.bookingsByKey as Record<string, GuestDataCacheEntry<Booking[]>>,
      availabilityByKey: {},
      refreshingOrders: {},
      refreshingBookings: {},
      ordersError: {},
      bookingsError: {},

      setOrders: (userId, restaurantId, orders) => {
        const key = guestDataCacheKey(userId, restaurantId);
        set((state) => ({
          ownerUserId: userId,
          ordersByKey: {
            ...state.ordersByKey,
            [key]: { data: orders, fetchedAt: Date.now() },
          },
          ordersError: { ...state.ordersError, [key]: null },
          refreshingOrders: { ...state.refreshingOrders, [key]: false },
        }));
      },

      setBookings: (userId, restaurantId, bookings) => {
        const key = guestDataCacheKey(userId, restaurantId);
        set((state) => ({
          ownerUserId: userId,
          bookingsByKey: {
            ...state.bookingsByKey,
            [key]: { data: bookings, fetchedAt: Date.now() },
          },
          bookingsError: { ...state.bookingsError, [key]: null },
          refreshingBookings: { ...state.refreshingBookings, [key]: false },
        }));
      },

      setAvailability: (restaurantId, date, availability) => {
        const key = guestAvailabilityCacheKey(restaurantId, date);
        set((state) => ({
          availabilityByKey: {
            ...state.availabilityByKey,
            [key]: { data: availability, fetchedAt: Date.now() },
          },
        }));
      },

      isFresh: (entry) => isGuestDataFresh(entry),
    }),
    {
      name: GUEST_DATA_STORAGE_KEY,
      version: GUEST_DATA_PERSIST_VERSION,
      skipHydration: true,
      storage: createJSONStorage(backingStorage),
      partialize: (state) => ({
        ownerUserId: state.ownerUserId,
        ordersByKey: state.ordersByKey,
        bookingsByKey: state.bookingsByKey,
      }),
      migrate: (persisted, version) => migrateGuestDataPersisted(persisted, version),
    },
  ),
);

export function guestAvailabilityCacheKey(restaurantId: string, date: string): string {
  return `${restaurantId}:${date}`;
}

export function getGuestAvailabilityFromStore(
  restaurantId: string,
  date: string,
): GuestDataCacheEntry<BookingAvailability> | undefined {
  return useGuestDataStore.getState().availabilityByKey[guestAvailabilityCacheKey(restaurantId, date)];
}

export function resetGuestDataStore(): void {
  abortInflightRequests();
  useGuestDataStore.setState({
    ownerUserId: null,
    ordersByKey: {},
    bookingsByKey: {},
    refreshingOrders: {},
    refreshingBookings: {},
    ordersError: {},
    bookingsError: {},
  });
}

export function syncGuestDataOwner(nextUserId: string | null): void {
  const state = useGuestDataStore.getState();
  const current: GuestDataPersistedV1 = {
    ownerUserId: state.ownerUserId,
    ordersByKey: state.ordersByKey,
    bookingsByKey: state.bookingsByKey,
  };
  const next = nextGuestDataAfterUserChange(current, nextUserId);
  if (next === current) {
    return;
  }

  const cleared = next.ordersByKey !== current.ordersByKey || next.bookingsByKey !== current.bookingsByKey;
  if (cleared) {
    abortInflightRequests();
    useGuestDataStore.setState({
      ownerUserId: next.ownerUserId,
      ordersByKey: next.ordersByKey as GuestDataState['ordersByKey'],
      bookingsByKey: next.bookingsByKey as GuestDataState['bookingsByKey'],
      refreshingOrders: {},
      refreshingBookings: {},
      ordersError: {},
      bookingsError: {},
    });
    return;
  }

  useGuestDataStore.setState({ ownerUserId: next.ownerUserId });
}
