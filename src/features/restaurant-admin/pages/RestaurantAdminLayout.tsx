'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
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

  return (
    <div className="restaurant-admin" data-testid="restaurant-admin-layout">
      <header className="glass-header restaurant-admin__header">
        <Link href="/" className="glass-header__link glass-header__link--accent restaurant-admin__back">
          ← На главную
        </Link>
        <h1 className="glass-header__title">
          Svels
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
        <nav className="restaurant-admin__nav" data-testid="restaurant-admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={`restaurant-admin__nav-link${
                pathname.startsWith(item.to) ? ' restaurant-admin__nav-link--active' : ''
              }`}
              data-testid={`nav-${item.to.replace('/restaurant-admin/', '')}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="restaurant-admin__content">
          <p className="restaurant-admin__welcome">
            {user?.firstName}, управляйте заведением для предзаказов.
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}
