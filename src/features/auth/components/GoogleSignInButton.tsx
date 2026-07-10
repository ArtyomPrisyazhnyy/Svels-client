'use client';

import { useEffect, useRef } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { loginWithGoogle } from '../api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { ApiError } from '@/shared/api/api-client';
import { GOOGLE_CLIENT_ID } from '@/shared/config/env';

interface GoogleSignInButtonProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  );
}

export function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clientId = GOOGLE_CLIENT_ID.trim();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  async function handleGoogleSuccess(response: CredentialResponse) {
    if (!response.credential) {
      onError('Google не вернул токен');
      return;
    }

    try {
      const auth = await loginWithGoogle(response.credential);
      setAuth(auth.accessToken, auth.user);
      onSuccess();
    } catch (err) {
      console.error('[Google Sign-In] Ошибка бэкенда:', err);
      onError(err instanceof ApiError ? err.message : 'Не удалось войти через Google');
    }
  }

  useEffect(() => {
    if (!clientId || !googleButtonRef.current) {
      return;
    }

    const iframe = googleButtonRef.current.querySelector('iframe');
    if (iframe) {
      iframe.style.width = '100%';
    }
  });

  if (!clientId) {
    return (
      <button
        type="button"
        className="auth-google-btn"
        onClick={() =>
          onError('Добавьте NEXT_PUBLIC_GOOGLE_CLIENT_ID в .env и перезапустите dev-сервер')
        }
      >
        <GoogleIcon />
        Продолжить с Google
      </button>
    );
  }

  return (
    <div className="auth-google">
      <button type="button" className="auth-google-btn auth-google-btn--overlay" tabIndex={-1} aria-hidden="true">
        <GoogleIcon />
        Продолжить с Google
      </button>
      <div ref={googleButtonRef} className="auth-google__widget">
        <GoogleLogin
          text="continue_with"
          shape="rectangular"
          theme="outline"
          size="large"
          width="356"
          onSuccess={handleGoogleSuccess}
          onError={() => {
            onError(
              'Ошибка виджета Google. Откройте консоль браузера (F12 → Console) для подробностей.',
            );
          }}
        />
      </div>
    </div>
  );
}
