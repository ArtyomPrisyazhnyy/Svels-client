'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GuestAuthPage } from '@/features/auth/pages/GuestAuthPage';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { getPostAuthPath } from '@/shared/routing/get-post-auth-path';
import { useAuthStore } from '@/store/auth.store';

interface GuestAuthRouteProps {
  redirectFrom?: string;
}

export function GuestAuthRoute({ redirectFrom }: GuestAuthRouteProps) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!hydrated || !user) {
      return;
    }

    router.replace(getPostAuthPath(user.role, redirectFrom, user.restaurantId));
  }, [hydrated, user, router, redirectFrom]);

  if (!hydrated) {
    return null;
  }

  if (user) {
    return null;
  }

  return <GuestAuthPage redirectFrom={redirectFrom} />;
}
