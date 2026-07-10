'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { ClientOnly } from '@/components/ClientOnly';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { getPostAuthPath } from '@/shared/routing/get-post-auth-path';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import type { AuthUser } from '@/shared/types/auth';
import { useAuthStore } from '@/store/auth.store';

interface RestaurantGuestProtectedRouteProps {
  restaurantId: string;
  children: ReactNode;
}

function AuthCheckingFallback() {
  return (
    <div
      suppressHydrationWarning
      style={{ minHeight: '40vh', display: 'grid', placeItems: 'center', color: '#64748b' }}
    >
      Проверка доступа…
    </div>
  );
}

function canAccessRestaurantGuestArea(user: AuthUser, restaurantId: string): boolean {
  if (user.role === 'user') {
    return user.restaurantId === restaurantId;
  }

  if (user.role === 'restaurant_admin') {
    return user.restaurantId === restaurantId;
  }

  return false;
}

function RestaurantGuestProtectedRouteInner({
  restaurantId,
  children,
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
      const query = searchParams.toString();
      const from = `${pathname}${query ? `?${query}` : ''}`;
      router.replace(paths.auth(from));
      return;
    }

    if (user.role === 'super_admin') {
      router.replace(getPostAuthPath(user.role));
      return;
    }

    if (user.role === 'restaurant_admin' && user.restaurantId !== restaurantId) {
      router.replace(getPostAuthPath(user.role, undefined, user.restaurantId));
      return;
    }

    if (user.role === 'user' && user.restaurantId !== restaurantId) {
      logout();
      router.replace(paths.auth(pathname));
    }
  }, [hydrated, user, router, pathname, searchParams, restaurantId, logout, paths]);

  if (!hydrated || !user || !canAccessRestaurantGuestArea(user, restaurantId)) {
    return <AuthCheckingFallback />;
  }

  return children;
}

export function RestaurantGuestProtectedRoute({
  restaurantId,
  children,
}: RestaurantGuestProtectedRouteProps) {
  return (
    <ClientOnly fallback={<AuthCheckingFallback />}>
      <RestaurantGuestProtectedRouteInner restaurantId={restaurantId}>
        {children}
      </RestaurantGuestProtectedRouteInner>
    </ClientOnly>
  );
}
