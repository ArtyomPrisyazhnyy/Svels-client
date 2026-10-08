'use client';

import { useState, type FormEvent } from 'react';
import { login } from '../api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { ApiError } from '@/shared/api/api-client';
import { PasswordInput } from './PasswordInput';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login({ email, password });
      setAuth(response.accessToken, response.user);
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось войти');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} data-testid="login-form">
      {error && <p className="auth-error" data-testid="auth-error">{error}</p>}

      <div className="auth-field">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="login-email"
        />
      </div>

      <PasswordInput
        id="login-password"
        label="Пароль"
        autoComplete="current-password"
        required
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        data-testid="login-password"
      />

      <button className="auth-submit" type="submit" disabled={loading} data-testid="login-submit">
        {loading ? 'Вход…' : 'Войти'}
      </button>
    </form>
  );
}
