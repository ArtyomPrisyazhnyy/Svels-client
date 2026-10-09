'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { setPassword } from '../api/set-password.api';
import { useAuthStore } from '@/store/auth.store';
import { ApiError } from '@/shared/api/api-client';
import '../styles/set-password.scss';

export function SetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const setAuth = useAuthStore((s) => s.setAuth);

  const [password, setPasswordValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError('Ссылка недействительна: отсутствует токен.');
      return;
    }

    if (password.length < 8) {
      setError('Пароль должен содержать не менее 8 символов.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }

    setLoading(true);
    try {
      const response = await setPassword({ token, password });
      setAuth(response.accessToken, response.user);
      router.replace('/restaurant-admin');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось установить пароль');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="set-password-page" data-testid="set-password-page">
      <div className="set-password-card">
        <h1 className="set-password-card__title">Установка пароля</h1>
        <p className="set-password-card__subtitle">
          Задайте пароль для входа в панель управления заведением.
        </p>

        {!token && (
          <p className="set-password-error" data-testid="set-password-missing-token">
            Перейдите по ссылке из письма или приглашения от администратора платформы.
          </p>
        )}

        <form className="set-password-form" onSubmit={(e) => void handleSubmit(e)}>
          {error && (
            <p className="set-password-error" data-testid="set-password-error">{error}</p>
          )}

          <label className="set-password-field">
            <span>Новый пароль</span>
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPasswordValue(e.target.value)}
              disabled={!token}
              data-testid="set-password-input"
            />
          </label>

          <label className="set-password-field">
            <span>Повторите пароль</span>
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!token}
              data-testid="set-password-confirm"
            />
          </label>

          <button
            type="submit"
            className="set-password-submit"
            disabled={loading || !token}
            data-testid="set-password-submit"
          >
            {loading ? 'Сохранение…' : 'Сохранить и войти'}
          </button>
        </form>

        <p className="set-password-footer">
          <Link href="/auth/restaurant">Уже есть пароль? Войти</Link>
        </p>
      </div>
    </div>
  );
}
