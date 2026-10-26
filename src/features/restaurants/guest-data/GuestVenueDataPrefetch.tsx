'use client';

import { useEffect } from 'react';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useAuthStore } from '@/store/auth.store';
import { prefetchGuestData } from './ensure-guest-data';

interface GuestVenueDataPrefetchProps {
  restaurantId: string;
}

/** Start orders and bookings as soon as the venue session is restored. */
export function GuestVenueDataPrefetch({ restaurantId }: GuestVenueDataPrefetchProps) {
  const hydrated = useAuthHydrated();
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!hydrated || !userId || !accessToken) {
      return;
    }
    prefetchGuestData(restaurantId, 'both');
  }, [hydrated, userId, accessToken, restaurantId]);

  return null;
}
