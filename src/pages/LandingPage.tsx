import { Link } from 'react-router-dom';
import { getPostAuthPath } from '../shared/routing/get-post-auth-path';
import { useAuthStore } from '../store/auth.store';
import './landing.scss';

export function LandingPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  function profileLabel(): string {
    if (!user) return '';
    if (user.role === 'super_admin') return 'Панель суперадмина';
    if (user.role === 'restaurant_admin') return 'Панель заведения';
    return user.firstName;
  }

  return (
    <div className="landing">
      <header className="landing__header">
        <h1>Svels</h1>
        <div className="landing__header-actions">
          {user ? (
            <>
              <Link to={getPostAuthPath(user.role)} className="landing__link-btn">
                {profileLabel()}
              </Link>
              <button type="button" className="landing__link-btn" onClick={logout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/guest" className="landing__link-btn">
                Вход для гостей
              </Link>
              <Link to="/auth/restaurant" className="landing__link-btn">
                Для заведений
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="landing__hero">
        <h2>Бронирование столов и предзаказы в одном месте</h2>
        <p>
          Svels помогает гостям быстро забронировать стол и оформить предзаказ, а ресторанам,
          барам и кофейням — принимать заявки, управлять залом и меню без лишней суеты.
        </p>
        <div className="landing__cta">
          <Link to="/booking" className="landing__btn landing__btn--primary">
            Забронировать стол
          </Link>
          <Link to="/pre-order" className="landing__btn landing__btn--secondary">
            Сделать предзаказ
          </Link>
        </div>
      </section>

      <section className="landing__sections">
        <article className="landing__card">
          <h3>Для гостей</h3>
          <p>Удобный сервис для тех, кто хочет спланировать визит заранее.</p>
          <ul>
            <li>Выбор даты, времени и стола</li>
            <li>Предзаказ блюд к приходу</li>
            <li>История бронирований в личном кабинете</li>
            <li>Вход по email или Google</li>
          </ul>
          <div className="landing__card-actions">
            <Link to="/auth/guest" className="landing__btn landing__btn--outline">
              Войти / зарегистрироваться
            </Link>
          </div>
        </article>

        <article className="landing__card">
          <h3>Для ресторанов, баров и кофеен</h3>
          <p>
            Подключите заведение или сеть точек: заявка проходит модерацию, после одобрения
            открывается доступ к админ-панели.
          </p>
          <ul>
            <li>Регистрация с УНП и адресами точек</li>
            <li>Поддержка сетей с несколькими локациями</li>
            <li>Управление меню, расписанием и планировкой зала</li>
            <li>Приём бронирований и предзаказов онлайн</li>
          </ul>
          <div className="landing__card-actions">
            {user?.role === 'restaurant_admin' ? (
              <Link to="/restaurant-admin/menu" className="landing__btn landing__btn--primary">
                Управление меню
              </Link>
            ) : (
              <Link to="/auth/restaurant" className="landing__btn landing__btn--primary">
                Подключить заведение
              </Link>
            )}
          </div>
        </article>
      </section>

      <p className="landing__footer-note">
        Бронирование и предзаказ доступны после входа в аккаунт гостя.
      </p>
    </div>
  );
}
