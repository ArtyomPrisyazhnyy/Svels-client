'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import {
  canAccessRestaurantAdminPath,
  getRestaurantAdminHomePath,
  isRestaurantStaffRole,
  RESTAURANT_ADMIN_NAV,
  RESTAURANT_STAFF_LABELS,
  staffHasPermission,
} from '../../../shared/auth/restaurant-staff';
import { useAuthStore } from '../../../store/auth.store';
import '../styles/restaurant-admin.scss';
import '../styles/restaurant-admin-layout.scss';

export default function RestaurantAdminLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const pathname = usePathname();
  const router = useRouter();
  const role = user?.role;
  const badge =
    role && isRestaurantStaffRole(role) ? RESTAURANT_STAFF_LABELS[role] : 'Админ заведения';
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);

  const navItems = RESTAURANT_ADMIN_NAV.filter(
    (item) => item.permission === null || staffHasPermission(role, item.permission),
  );

  useEffect(() => {
    if (!role || !pathname) {
      return;
    }

    if (!canAccessRestaurantAdminPath(role, pathname)) {
      router.replace(getRestaurantAdminHomePath(role));
    }
  }, [role, pathname, router]);

  useEffect(() => {
    activeLinkRef.current?.scrollIntoView({ inline: 'start', block: 'nearest' });
  }, [pathname]);

  return (
    <div className="restaurant-admin" data-testid="restaurant-admin-layout">
      <header className="glass-header restaurant-admin__header">
        <Link
          href="/"
          aria-label="На главную"
          className="glass-header__link glass-header__link--accent restaurant-admin__back"
        >
          <span aria-hidden="true">←</span>
          <span className="restaurant-admin__back-label">На главную</span>
        </Link>
        <h1 className="glass-header__title restaurant-admin__title">
          <span className="restaurant-admin__brand">Svels</span>
          <span className="restaurant-admin__badge">{badge}</span>
        </h1>
        <button
          type="button"
          className="glass-header__link restaurant-admin__logout"
          onClick={logout}
          data-testid="restaurant-admin-logout"
        >
          Выйти
        </button>
      </header>

      <div className="restaurant-admin__body">
        <nav className="restaurant-admin__nav" aria-label="Разделы админки" data-testid="restaurant-admin-nav">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                ref={active ? activeLinkRef : undefined}
                href={item.to}
                className={`restaurant-admin__nav-link${
                  active ? ' restaurant-admin__nav-link--active' : ''
                }`}
                aria-current={active ? 'page' : undefined}
                data-testid={`nav-${item.to.replace('/restaurant-admin/', '')}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="restaurant-admin__content">{children}</div>
      </div>
    </div>
  );
}
