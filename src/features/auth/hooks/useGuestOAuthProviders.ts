'use client';

import { useEffect, useState } from 'react';
import { fetchGuestOAuthProviders } from '../api/restaurant-guest-auth.api';
import type { GuestOAuthProvidersResponse } from '@/shared/types/auth';

const EMPTY_PROVIDERS: GuestOAuthProvidersResponse = {
  google: { enabled: false, clientId: '' },
  apple: { enabled: false, serviceId: '', redirectUri: '' },
};

const providersCache = new Map<string, GuestOAuthProvidersResponse>();

export function useGuestOAuthProviders(restaurantId: string, enabled: boolean) {
  const [providers, setProviders] = useState<GuestOAuthProvidersResponse | null>(() =>
    providersCache.get(restaurantId) ?? null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const cached = providersCache.get(restaurantId);
    if (cached) {
      setProviders(cached);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void fetchGuestOAuthProviders(restaurantId)
      .then((response) => {
        providersCache.set(restaurantId, response);
        if (!cancelled) {
          setProviders(response);
        }
      })
      .catch(() => {
        providersCache.set(restaurantId, EMPTY_PROVIDERS);
        if (!cancelled) {
          setProviders(EMPTY_PROVIDERS);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [restaurantId, enabled]);

  const resolved = providers ?? EMPTY_PROVIDERS;
  const hasEnabledProvider = resolved.google.enabled || resolved.apple.enabled;

  return {
    providers: resolved,
    hasEnabledProvider,
    loading,
  };
}
