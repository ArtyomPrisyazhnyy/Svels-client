import Link from 'next/link';
import { LandingHeaderActions } from './LandingHeaderActions';

export function LandingPage() {
  return (
    <div className="landing">
      <header className="landing__header">
        <h1>Svels</h1>
        <LandingHeaderActions />
      </header>

      <section className="landing__hero">
        <h2>Платформа для ресторанов, баров и кофеен</h2>
        <p>
          Svels — white-label решение для приёма бронирований и предзаказов. Подключите заведение
          или сеть точек: после модерации откроется админ-панель, а гости будут работать с вашим
          заведением как с отдельным приложением.
        </p>
        <div className="landing__cta">
          <Link href="/auth/restaurant" className="landing__btn landing__btn--primary">
            Подключить заведение
          </Link>
        </div>
      </section>

      <section className="landing__sections landing__sections--single">
        <article className="landing__card">
          <h3>Что получает заведение</h3>
          <p>Каждая точка — отдельная страница с собственной базой гостей и брендингом Svels.</p>
          <ul>
            <li>Регистрация с УНП и адресами точек</li>
            <li>Поддержка сетей с несколькими локациями</li>
            <li>Управление меню, расписанием и планировкой зала</li>
            <li>Приём бронирований и предзаказов онлайн</li>
            <li>Отдельная регистрация гостей в каждом заведении</li>
          </ul>
          <div className="landing__card-actions">
            <LandingHeaderActions
              restaurantCta
              className="landing__btn landing__btn--primary"
              fallbackHref="/auth/restaurant"
              fallbackLabel="Подключить заведение"
              adminHref="/restaurant-admin/menu"
              adminLabel="Управление меню"
            />
          </div>
        </article>
      </section>
    </div>
  );
}
