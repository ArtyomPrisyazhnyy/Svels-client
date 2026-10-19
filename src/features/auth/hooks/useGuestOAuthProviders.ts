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
  const [providers, setProviders] = useState<GuestOAuthProvidersResponse>(
    () => providersCache.get(restaurantId) ?? EMPTY_PROVIDERS,
  );
  const [loading, setLoading] = useState(
    () => enabled && !providersCache.has(restaurantId),
  );

  useEffect(() => {
    if (!enabled || providersCache.has(restaurantId)) {
      return;
    }

    let cancelled = false;

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

  const hasEnabledProvider = providers.google.enabled || providers.apple.enabled;

  return {
    providers,
    hasEnabledProvider,
    loading,
  };
}
