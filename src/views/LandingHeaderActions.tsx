'use client';

import Link from 'next/link';
import { getPostAuthPath } from '@/shared/routing/get-post-auth-path';
import { useAuthStore } from '@/store/auth.store';

interface LandingHeaderActionsProps {
  restaurantCta?: boolean;
  className?: string;
  fallbackHref?: string;
  fallbackLabel?: string;
  adminHref?: string;
  adminLabel?: string;
}

export function LandingHeaderActions({
  restaurantCta = false,
  className = 'glass-header__link',
  fallbackHref = '/auth/restaurant',
  fallbackLabel = 'Для заведений',
  adminHref = '/restaurant-admin/menu',
  adminLabel = 'Управление меню',
}: LandingHeaderActionsProps) {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = Boolean(user && accessToken);

  if (restaurantCta) {
    if (isAuthenticated && user?.role === 'restaurant_admin') {
      return (
        <Link href={adminHref} className={className}>
          {adminLabel}
        </Link>
      );
    }

    return (
      <Link href={fallbackHref} className={className}>
        {fallbackLabel}
      </Link>
    );
  }

  return (
    <div className="glass-header__actions">
      {isAuthenticated && user ? (
        <>
          <Link href={getPostAuthPath(user.role, undefined, user.restaurantId)} className={className}>
            {profileLabel(user.role)}
          </Link>
          <button type="button" className={className} onClick={logout}>
            Выйти
          </button>
        </>
      ) : (
        <Link href="/auth/restaurant" className={className}>
          Для заведений
        </Link>
      )}
    </div>
  );
}

function profileLabel(role: string): string {
  if (role === 'super_admin') return 'Панель суперадмина';
  if (role === 'restaurant_admin') return 'Панель заведения';
  return 'Личный кабинет';
}
