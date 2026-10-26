'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Booking } from '@/shared/types/booking';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useAuthStore } from '@/store/auth.store';
import { guestDataCacheKey } from '@/store/guest-data.logic';
import { useGuestDataStore } from '@/store/guest-data.store';
import { ensureGuestBookings } from '../guest-data/ensure-guest-data';

interface UseGuestBookingsResult {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  retrying: boolean;
  retry: () => void;
}

export function useGuestBookings(restaurantId: string): UseGuestBookingsResult {
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const cacheKey = userId ? guestDataCacheKey(userId, restaurantId) : null;
  const cached = useGuestDataStore((state) =>
    cacheKey ? state.bookingsByKey[cacheKey] : undefined,
  );
  const refreshing = useGuestDataStore((state) =>
    cacheKey ? state.refreshingBookings[cacheKey] === true : false,
  );
  const error = useGuestDataStore((state) =>
    cacheKey ? state.bookingsError[cacheKey] ?? null : null,
  );
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!hydrated || !accessToken || !userId) {
      return;
    }
    void ensureGuestBookings({ userId, restaurantId, token: accessToken });
  }, [hydrated, accessToken, userId, restaurantId]);

  const retry = useCallback(() => {
    if (!accessToken || !userId) {
      return;
    }
    setRetrying(true);
    void ensureGuestBookings({
      userId,
      restaurantId,
      token: accessToken,
      force: true,
    }).finally(() => {
      setRetrying(false);
    });
  }, [accessToken, restaurantId, userId]);

  const bookings = cached?.data ?? [];
  const loading = Boolean(hydrated && accessToken && userId && !cached && !error);

  return { bookings, loading, error, refreshing, retrying, retry };
}
