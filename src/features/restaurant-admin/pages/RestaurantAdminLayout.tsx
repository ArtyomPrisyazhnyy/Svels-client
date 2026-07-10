'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../../store/auth.store';
import '../styles/restaurant-admin.scss';
import '../styles/restaurant-admin-layout.scss';

export default function RestaurantAdminLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const pathname = usePathname();

  const navItems = [
    { to: '/restaurant-admin/preview', label: 'Страница заведения' },
    { to: '/restaurant-admin/branding', label: 'Брендинг' },
    { to: '/restaurant-admin/styling', label: 'Стилизация' },
    { to: '/restaurant-admin/menu', label: 'Меню' },
    { to: '/restaurant-admin/order-settings', label: 'Условия заказа' },
    { to: '/restaurant-admin/booking-settings', label: 'Бронирование' },
    { to: '/restaurant-admin/floor-plan', label: 'Планировка' },
    { to: '/restaurant-admin/bookings', label: 'Брони' },
    { to: '/restaurant-admin/social-links', label: 'Соцсети' },
    { to: '/restaurant-admin/account', label: 'Аккаунт' },
  ];

  return (
    <div className="restaurant-admin">
      <header className="glass-header restaurant-admin__header">
        <Link href="/" className="glass-header__link glass-header__link--accent restaurant-admin__back">
          ← На главную
        </Link>
        <h1 className="glass-header__title">
          Svels
          <span className="restaurant-admin__badge">Админ заведения</span>
        </h1>
        <button type="button" className="glass-header__link restaurant-admin__logout" onClick={logout}>
          Выйти
        </button>
      </header>

      <div className="restaurant-admin__body">
        <nav className="restaurant-admin__nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={`restaurant-admin__nav-link${
                pathname.startsWith(item.to) ? ' restaurant-admin__nav-link--active' : ''
              }`}
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
