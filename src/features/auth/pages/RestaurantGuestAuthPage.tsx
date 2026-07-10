'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { getPostAuthPath } from '@/shared/routing/get-post-auth-path';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { useAuthStore } from '@/store/auth.store';
import '../styles/auth.scss';

type AuthTab = 'login' | 'register';

interface RestaurantGuestAuthPageProps {
  restaurantId: string;
  restaurantName: string;
  redirectFrom?: string;
}

export function RestaurantGuestAuthPage({
  restaurantId,
  restaurantName,
  redirectFrom,
}: RestaurantGuestAuthPageProps) {
  const router = useRouter();
  const [tab, setTab] = useState<AuthTab>('login');
  const paths = useRestaurantGuestPaths(restaurantId);

  function handleSuccess() {
    const user = useAuthStore.getState().user;
    router.replace(
      getPostAuthPath(user?.role ?? 'user', redirectFrom, restaurantId, paths.tenantMode),
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href={paths.home} className="auth-card__back">
          ← {restaurantName}
        </Link>
        <h1 className="auth-card__title">Вход в {restaurantName}</h1>
        <p className="auth-card__subtitle">
          Регистрация по номеру телефона действует только для этого заведения. Для других
          ресторанов нужен отдельный аккаунт.
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tabs__btn ${tab === 'login' ? 'auth-tabs__btn--active' : ''}`}
            onClick={() => setTab('login')}
          >
            Вход
          </button>
          <button
            type="button"
            className={`auth-tabs__btn ${tab === 'register' ? 'auth-tabs__btn--active' : ''}`}
            onClick={() => setTab('register')}
          >
            Регистрация
          </button>
        </div>

        {tab === 'login' ? (
          <LoginForm restaurantId={restaurantId} onSuccess={handleSuccess} />
        ) : (
          <RegisterForm restaurantId={restaurantId} onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
}
