import { create } from 'zustand';
import type { Booking, BookingAvailability } from '@/shared/types/booking';
import type { OrderDto } from '@/shared/types/pre-order';

const DATA_STALE_MS = 60_000;

export interface GuestDataCacheEntry<T> {
  data: T;
  fetchedAt: number;
}

interface GuestDataState {
  ordersByRestaurant: Record<string, GuestDataCacheEntry<OrderDto[]>>;
  bookings: GuestDataCacheEntry<Booking[]> | null;
  availabilityByKey: Record<string, GuestDataCacheEntry<BookingAvailability>>;
  setOrders: (restaurantId: string, orders: OrderDto[]) => void;
  setBookings: (bookings: Booking[]) => void;
  setAvailability: (restaurantId: string, date: string, availability: BookingAvailability) => void;
  isFresh: (entry: GuestDataCacheEntry<unknown> | undefined) => boolean;
}

export const useGuestDataStore = create<GuestDataState>((set) => ({
  ordersByRestaurant: {},
  bookings: null,
  availabilityByKey: {},
  setOrders: (restaurantId, orders) =>
    set((state) => ({
      ordersByRestaurant: {
        ...state.ordersByRestaurant,
        [restaurantId]: { data: orders, fetchedAt: Date.now() },
      },
    })),
  setBookings: (bookings) => set({ bookings: { data: bookings, fetchedAt: Date.now() } }),
  setAvailability: (restaurantId, date, availability) => {
    const key = `${restaurantId}:${date}`;
    set((state) => ({
      availabilityByKey: {
        ...state.availabilityByKey,
        [key]: { data: availability, fetchedAt: Date.now() },
      },
    }));
  },
  isFresh: (entry) => Boolean(entry && Date.now() - entry.fetchedAt < DATA_STALE_MS),
}));

export function guestAvailabilityCacheKey(restaurantId: string, date: string): string {
  return `${restaurantId}:${date}`;
}

export function getGuestAvailabilityFromStore(
  restaurantId: string,
  date: string,
): GuestDataCacheEntry<BookingAvailability> | undefined {
  return useGuestDataStore.getState().availabilityByKey[guestAvailabilityCacheKey(restaurantId, date)];
}
