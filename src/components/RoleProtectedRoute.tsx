'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { ClientOnly } from '@/components/ClientOnly';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import type { UserRole } from '@/shared/types/auth';
import { getPostAuthPath } from '@/shared/routing/get-post-auth-path';
import { useAuthStore } from '@/store/auth.store';

interface RoleProtectedRouteProps {
  roles: UserRole[];
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

function RoleProtectedRouteInner({ roles, children }: RoleProtectedRouteProps) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!user || !accessToken) {
      if (user || accessToken) {
        logout();
      }
      router.replace('/auth/restaurant');
      return;
    }

    if (!roles.includes(user.role)) {
      router.replace(getPostAuthPath(user.role, undefined, user.restaurantId));
    }
  }, [hydrated, user, accessToken, roles, router, logout]);

  if (!hydrated || !user || !accessToken || !roles.includes(user.role)) {
    return <AuthCheckingFallback />;
  }

  return children;
}

export function RoleProtectedRoute({ roles, children }: RoleProtectedRouteProps) {
  return (
    <ClientOnly fallback={<AuthCheckingFallback />}>
      <RoleProtectedRouteInner roles={roles}>{children}</RoleProtectedRouteInner>
    </ClientOnly>
  );
}
