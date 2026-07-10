'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RestaurantAuthPage } from '@/features/auth/pages/RestaurantAuthPage';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { getPostAuthPath } from '@/shared/routing/get-post-auth-path';
import { useAuthStore } from '@/store/auth.store';

export function RestaurantAuthRoute() {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!hydrated || !user) {
      return;
    }

    router.replace(getPostAuthPath(user.role, undefined, user.restaurantId));
  }, [hydrated, user, router]);

  if (!hydrated) {
    return null;
  }

  if (user) {
    return null;
  }

  return <RestaurantAuthPage />;
}
