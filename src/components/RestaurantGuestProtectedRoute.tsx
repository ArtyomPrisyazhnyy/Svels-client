'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { getPostAuthPath } from '@/shared/routing/get-post-auth-path';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { isRestaurantStaffRole } from '@/shared/auth/restaurant-staff';
import type { AuthUser } from '@/shared/types/auth';
import { consumeGuestLogoutRedirectPending } from '@/shared/auth/guest-logout-redirect';
import { useAuthStore } from '@/store/auth.store';

interface RestaurantGuestProtectedRouteProps {
  restaurantId: string;
  children: ReactNode;
  fallback: ReactNode;
}

function canAccessRestaurantGuestArea(user: AuthUser, restaurantId: string): boolean {
  if (user.role === 'user' || isRestaurantStaffRole(user.role)) {
    return user.restaurantId === restaurantId;
  }

  return false;
}

export function RestaurantGuestProtectedRoute({
  restaurantId,
  children,
  fallback,
}: RestaurantGuestProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const paths = useRestaurantGuestPaths(restaurantId);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!user) {
      if (consumeGuestLogoutRedirectPending()) {
        router.replace(paths.home);
        return;
      }
      const query = searchParams.toString();
      const from = `${pathname}${query ? `?${query}` : ''}`;
      router.replace(paths.auth(from));
      return;
    }

    if (user.role === 'super_admin') {
      router.replace(getPostAuthPath(user.role));
      return;
    }

    if (isRestaurantStaffRole(user.role) && user.restaurantId !== restaurantId) {
      router.replace(getPostAuthPath(user.role, undefined, user.restaurantId));
      return;
    }

    if (user.role === 'user' && user.restaurantId !== restaurantId) {
      logout();
      router.replace(paths.auth(pathname));
    }
  }, [hydrated, user, router, pathname, searchParams, restaurantId, logout, paths]);

  if (!hydrated || !user || !canAccessRestaurantGuestArea(user, restaurantId)) {
    return fallback;
  }

  return children;
}
