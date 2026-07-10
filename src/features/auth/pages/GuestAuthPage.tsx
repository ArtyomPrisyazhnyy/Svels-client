'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { getPostAuthPath } from '@/shared/routing/get-post-auth-path';
import { useAuthStore } from '@/store/auth.store';
import '../styles/auth.scss';

type AuthTab = 'login' | 'register';

interface GuestAuthPageProps {
  redirectFrom?: string;
}

export function GuestAuthPage({ redirectFrom }: GuestAuthPageProps) {
  const router = useRouter();
  const [tab, setTab] = useState<AuthTab>('login');
  const [googleError, setGoogleError] = useState<string | null>(null);

  function handleSuccess() {
    const role = useAuthStore.getState().user?.role ?? 'user';
    router.replace(getPostAuthPath(role, redirectFrom));
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-card__back">
          ← На главную
        </Link>
        <h1 className="auth-card__title">Вход для гостей</h1>
        <p className="auth-card__subtitle">
          Зарегистрируйтесь, чтобы бронировать столы и оформлять предзаказы
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tabs__btn ${tab === 'login' ? 'auth-tabs__btn--active' : ''}`}
            onClick={() => {
              setTab('login');
              setGoogleError(null);
            }}
          >
            Вход
          </button>
          <button
            type="button"
            className={`auth-tabs__btn ${tab === 'register' ? 'auth-tabs__btn--active' : ''}`}
            onClick={() => {
              setTab('register');
              setGoogleError(null);
            }}
          >
            Регистрация
          </button>
        </div>

        {tab === 'login' ? (
          <LoginForm onSuccess={handleSuccess} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} />
        )}

        <div className="auth-divider">или</div>

        {googleError && <p className="auth-error">{googleError}</p>}

        <GoogleSignInButton onSuccess={handleSuccess} onError={setGoogleError} />

        <p className="auth-card__footer">
          Владелец заведения? <Link href="/auth/restaurant">Регистрация для ресторанов</Link>
        </p>
      </div>
    </div>
  );
}
