'use client';

import { useState, type FormEvent } from 'react';
import { login } from '../api/auth.api';
import { loginGuest } from '../api/restaurant-guest-auth.api';
import { useAuthStore } from '@/store/auth.store';
import { ApiError } from '@/shared/api/api-client';
import { PasswordInput } from './PasswordInput';

interface LoginFormProps {
  restaurantId?: string;
  onSuccess: () => void;
}

export function LoginForm({ restaurantId, onSuccess }: LoginFormProps) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isGuestAuth = Boolean(restaurantId);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = isGuestAuth
        ? await loginGuest(restaurantId!, { phone, password })
        : await login({ email, password });
      setAuth(response.accessToken, response.user);
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось войти');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <p className="auth-error">{error}</p>}

      {isGuestAuth ? (
        <div className="auth-field">
          <label htmlFor="login-phone">Телефон</label>
          <input
            id="login-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+375 29 123-45-67"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      ) : (
        <div className="auth-field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}

      <PasswordInput
        id="login-password"
        label="Пароль"
        autoComplete="current-password"
        required
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="auth-submit" type="submit" disabled={loading}>
        {loading ? 'Вход…' : 'Войти'}
      </button>
    </form>
  );
}
