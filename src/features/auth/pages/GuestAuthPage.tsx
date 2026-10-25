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
    <main id="main-content" className="auth-page" tabIndex={-1}>
      <div className="auth-card">
        <Link href="/" className="auth-card__back">
          ← На главную
        </Link>
        <h1 className="auth-card__title">Вход для гостей</h1>
        <p className="auth-card__subtitle">
          Зарегистрируйтесь, чтобы бронировать столы и оформлять предзаказы
        </p>

        <div className="auth-tabs" role="tablist" aria-label="Режим авторизации">
          <button
            type="button"
            role="tab"
            id="guest-auth-tab-login"
            aria-selected={tab === 'login'}
            aria-controls="guest-auth-tabpanel"
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
            role="tab"
            id="guest-auth-tab-register"
            aria-selected={tab === 'register'}
            aria-controls="guest-auth-tabpanel"
            className={`auth-tabs__btn ${tab === 'register' ? 'auth-tabs__btn--active' : ''}`}
            onClick={() => {
              setTab('register');
              setGoogleError(null);
            }}
          >
            Регистрация
          </button>
        </div>

        <div
          role="tabpanel"
          id="guest-auth-tabpanel"
          aria-labelledby={tab === 'login' ? 'guest-auth-tab-login' : 'guest-auth-tab-register'}
        >
          {tab === 'login' ? (
            <LoginForm onSuccess={handleSuccess} />
          ) : (
            <RegisterForm onSuccess={handleSuccess} />
          )}
        </div>

        <div className="auth-divider">или</div>

        {googleError && <p className="auth-error">{googleError}</p>}

        <GoogleSignInButton onSuccess={handleSuccess} onError={setGoogleError} />

        <p className="auth-card__footer">
          Владелец заведения? <Link href="/auth/restaurant">Регистрация для ресторанов</Link>
        </p>
      </div>
    </main>
  );
}
