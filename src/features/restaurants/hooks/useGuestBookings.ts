'use client';

import { useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/api-client';
import type { Booking } from '@/shared/types/booking';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useAuthStore } from '@/store/auth.store';
import { useGuestDataStore } from '@/store/guest-data.store';
import { fetchMyBookings } from '../api/bookings.api';

interface UseGuestBookingsResult {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

export function useGuestBookings(): UseGuestBookingsResult {
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((s) => s.accessToken);
  const cached = useGuestDataStore((s) => s.bookings);
  const [error, setError] = useState<string | null>(null);

  const bookings = cached?.data ?? [];
  const loading = hydrated && Boolean(accessToken) && !cached;

  useEffect(() => {
    if (!hydrated || !accessToken) {
      return;
    }

    const store = useGuestDataStore.getState();
    const existing = store.bookings;
    const shouldFetch = !existing || !store.isFresh(existing);
    if (!shouldFetch) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const rows = await fetchMyBookings(accessToken);
        if (!cancelled) {
          store.setBookings(rows);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Не удалось загрузить брони');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, accessToken]);

  return { bookings, loading, error };
}
