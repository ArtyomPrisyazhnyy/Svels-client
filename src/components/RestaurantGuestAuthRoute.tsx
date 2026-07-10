'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RestaurantGuestAuthPage } from '@/features/auth/pages/RestaurantGuestAuthPage';
import { getPostAuthPath } from '@/shared/routing/get-post-auth-path';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { useAuthStore } from '@/store/auth.store';

interface RestaurantGuestAuthRouteProps {
  restaurantId: string;
  restaurantName: string;
  redirectFrom?: string;
}

export function RestaurantGuestAuthRoute({
  restaurantId,
  restaurantName,
  redirectFrom,
}: RestaurantGuestAuthRouteProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const paths = useRestaurantGuestPaths(restaurantId);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role === 'super_admin' || user.role === 'restaurant_admin') {
      router.replace(getPostAuthPath(user.role));
      return;
    }

    if (user.restaurantId === restaurantId) {
      router.replace(getPostAuthPath(user.role, redirectFrom, restaurantId, paths.tenantMode));
      return;
    }

    logout();
  }, [user, router, redirectFrom, restaurantId, logout, paths.tenantMode]);

  if (user?.role === 'user' && user.restaurantId === restaurantId) {
    return null;
  }

  if (user && user.role !== 'user') {
    return null;
  }

  return (
    <RestaurantGuestAuthPage
      restaurantId={restaurantId}
      restaurantName={restaurantName}
      redirectFrom={redirectFrom}
    />
  );
}
