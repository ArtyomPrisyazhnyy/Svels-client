import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth.store';
import '../styles/restaurant-admin.scss';
import '../styles/restaurant-admin-layout.scss';

export default function RestaurantAdminLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocation();

  const navItems = [
    { to: '/restaurant-admin/menu', label: 'Меню' },
  ];

  return (
    <div className="restaurant-admin">
      <header className="restaurant-admin__header">
        <Link to="/" className="restaurant-admin__back">
          ← На главную
        </Link>
        <h1>
          Svels
          <span className="restaurant-admin__badge">Админ заведения</span>
        </h1>
        <button type="button" className="restaurant-admin__logout" onClick={logout}>
          Выйти
        </button>
      </header>

      <div className="restaurant-admin__body">
        <nav className="restaurant-admin__nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`restaurant-admin__nav-link${
                location.pathname.startsWith(item.to) ? ' restaurant-admin__nav-link--active' : ''
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
          <Outlet />
        </div>
      </div>
    </div>
  );
}
