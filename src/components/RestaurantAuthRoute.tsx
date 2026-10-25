'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { OwnerApplicationStatus } from '@/features/auth/pages/OwnerApplicationStatus';
import { RestaurantAuthPage } from '@/features/auth/pages/RestaurantAuthPage';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { isRestaurantStaffRole } from '@/shared/auth/restaurant-staff';
import { getPostAuthPath } from '@/shared/routing/get-post-auth-path';
import { useAuthStore } from '@/store/auth.store';

export function RestaurantAuthRoute() {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);

  const isStaff = Boolean(user && (user.role === 'super_admin' || isRestaurantStaffRole(user.role)));

  useEffect(() => {
    if (!hydrated || !user || !isStaff) {
      return;
    }

    router.replace(getPostAuthPath(user.role, undefined, user.restaurantId));
  }, [hydrated, isStaff, user, router]);

  if (!hydrated) {
    return null;
  }

  if (isStaff) {
    return null;
  }

  if (user?.role === 'user') {
    return <OwnerApplicationStatus />;
  }

  return <RestaurantAuthPage />;
}
