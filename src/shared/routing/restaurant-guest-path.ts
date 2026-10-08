'use client';

import { useEffect, useMemo, useState } from 'react';
import { isPlatformHost } from '@/shared/tenant/platform-hosts';

export type RestaurantGuestSegment = 'home' | 'booking' | 'pre-order' | 'account' | 'auth' | 'favorites';

export function buildRestaurantGuestPath(
  restaurantId: string,
  segment: RestaurantGuestSegment,
  options?: { tenantMode?: boolean; from?: string },
): string {
  const tenantMode = options?.tenantMode ?? false;

  if (segment === 'auth') {
    const base = tenantMode ? '/auth' : `/restaurants/${restaurantId}/auth`;
    if (options?.from) {
      return `${base}?from=${encodeURIComponent(options.from)}`;
    }
    return base;
  }

  if (tenantMode) {
    return segment === 'home' ? '/' : `/${segment}`;
  }

  return segment === 'home'
    ? `/restaurants/${restaurantId}`
    : `/restaurants/${restaurantId}/${segment}`;
}

export function useIsTenantDomain(): boolean {
  const [tenantMode, setTenantMode] = useState(false);

  useEffect(() => {
    setTenantMode(!isPlatformHost(window.location.hostname));
  }, []);

  return tenantMode;
}

export function useRestaurantGuestPaths(restaurantId: string, forcePlatformPaths = false) {
  const tenantMode = useIsTenantDomain();
  const useTenantPaths = tenantMode && !forcePlatformPaths;

  return useMemo(
    () => ({
      tenantMode: useTenantPaths,
      home: buildRestaurantGuestPath(restaurantId, 'home', { tenantMode: useTenantPaths }),
      booking: buildRestaurantGuestPath(restaurantId, 'booking', { tenantMode: useTenantPaths }),
      preOrder: buildRestaurantGuestPath(restaurantId, 'pre-order', {
        tenantMode: useTenantPaths,
      }),
      account: buildRestaurantGuestPath(restaurantId, 'account', { tenantMode: useTenantPaths }),
      favorites: buildRestaurantGuestPath(restaurantId, 'favorites', { tenantMode: useTenantPaths }),
      auth: (from?: string) =>
        buildRestaurantGuestPath(restaurantId, 'auth', {
          tenantMode: useTenantPaths,
          from,
        }),
    }),
    [restaurantId, useTenantPaths],
  );
}
