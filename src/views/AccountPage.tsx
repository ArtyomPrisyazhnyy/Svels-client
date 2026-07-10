'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchMyRegistration } from '@/features/auth/api/restaurant-registration.api';
import type { MyRegistrationStatus } from '@/features/auth/api/restaurant-registration.api';
import { useAuthProfileSync } from '@/hooks/useAuthProfileSync';
import { getPostAuthPath } from '@/shared/routing/get-post-auth-path';
import { useAuthStore } from '@/store/auth.store';
import './home.scss';

export function AccountPage() {
  useAuthProfileSync();

  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const logout = useAuthStore((s) => s.logout);
  const [registration, setRegistration] = useState<MyRegistrationStatus | null | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!user) {
      router.replace('/auth/guest?from=/account');
      return;
    }

    if (user.role === 'super_admin' || user.role === 'restaurant_admin') {
      router.replace(getPostAuthPath(user.role));
    }
  }, [user, router]);

  useEffect(() => {
    if (!accessToken || user?.role !== 'user') {
      setRegistration(null);
      return;
    }

    fetchMyRegistration(accessToken)
      .then(setRegistration)
      .catch(() => setRegistration(null));
  }, [accessToken, user?.role]);

  if (!user || user.role !== 'user') {
    return null;
  }

  return (
    <div className="home">
      <header className="glass-header home__header">
        <Link href="/" className="glass-header__link glass-header__link--accent home__back">
          ← На главную
        </Link>
        <h1 className="glass-header__title">Личный кабинет</h1>
        <button type="button" className="glass-header__link home__logout" onClick={logout}>
          Выйти
        </button>
      </header>

      <main className="home__main">
        <p className="home__greeting">
          Здравствуйте, {user.firstName} {user.lastName}
        </p>
        <p className="home__email">{user.email}</p>

        {registration === undefined && user.role === 'user' && (
          <p className="home__hint">Загрузка статуса заявки…</p>
        )}

        {registration?.status === 'pending' && (
          <div className="home__notice home__notice--pending">
            <strong>Заявка «{registration.name}» на модерации</strong>
            <p>
              После одобления суперадминистратором откроется панель управления меню. Страница
              обновится автоматически — или перезайдите в аккаунт.
            </p>
          </div>
        )}

        {registration?.status === 'rejected' && (
          <div className="home__notice home__notice--rejected">
            <strong>Заявка «{registration.name}» отклонена</strong>
            {registration.rejectionReason && <p>{registration.rejectionReason}</p>}
            <Link href="/auth/restaurant">Подать заявку снова</Link>
          </div>
        )}

        {registration?.status === 'approved' && (
          <div className="home__notice home__notice--info">
            <p>Заявка одобрена. Обновите страницу или войдите снова, чтобы открыть панель заведения.</p>
          </div>
        )}

        <section className="home__section">
          <h2>Для гостей</h2>
          <div className="home__links">
            <Link href="/booking">Бронирование</Link>
            <Link href="/pre-order">Предзаказ</Link>
          </div>
        </section>

        {!registration && registration !== undefined && (
          <section className="home__section">
            <h2>Для заведений</h2>
            <p className="home__hint">
              Вы владелец ресторана, бара или кофейни? Подайте заявку на подключение.
            </p>
            <Link href="/auth/restaurant" className="home__panel-link">
              Подключить заведение
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
