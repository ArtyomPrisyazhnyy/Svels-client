'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/api-client';
import type { BookingAvailability } from '@/shared/types/booking';
import { useGuestDataStore, getGuestAvailabilityFromStore } from '@/store/guest-data.store';
import { fetchBookingAvailability } from '../api/bookings.api';

interface UseBookingAvailabilityOptions {
  restaurantId: string;
  date: string;
  enabled: boolean;
  initialAvailability?: BookingAvailability | null;
}

interface UseBookingAvailabilityResult {
  availability: BookingAvailability | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useBookingAvailability({
  restaurantId,
  date,
  enabled,
  initialAvailability = null,
}: UseBookingAvailabilityOptions): UseBookingAvailabilityResult {
  const cacheKey = `${restaurantId}:${date}`;
  const cached = useGuestDataStore((s) => s.availabilityByKey[cacheKey]);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  const availability = cached?.data ?? initialAvailability;

  const reload = useCallback(async () => {
    if (!enabled) {
      return;
    }
    setFetching(true);
    setError(null);
    try {
      const result = await fetchBookingAvailability(restaurantId, date);
      useGuestDataStore.getState().setAvailability(restaurantId, date, result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить слоты');
    } finally {
      setFetching(false);
    }
  }, [date, enabled, restaurantId]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    if (initialAvailability && !getGuestAvailabilityFromStore(restaurantId, date)) {
      useGuestDataStore.getState().setAvailability(restaurantId, date, initialAvailability);
    }
  }, [date, enabled, initialAvailability, restaurantId]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const store = useGuestDataStore.getState();
    const existing = store.availabilityByKey[cacheKey];
    if (existing && store.isFresh(existing)) {
      return;
    }

    let cancelled = false;

    void (async () => {
      setFetching(true);
      setError(null);
      try {
        const result = await fetchBookingAvailability(restaurantId, date);
        if (!cancelled) {
          store.setAvailability(restaurantId, date, result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Не удалось загрузить слоты');
        }
      } finally {
        if (!cancelled) {
          setFetching(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cacheKey, date, enabled, restaurantId]);

  const loading = fetching && !availability;

  return { availability, loading, error, reload };
}
