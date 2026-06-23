import { useState, type FormEvent } from 'react';
import { register } from '../api/auth.api';
import { useAuthStore } from '../../../store/auth.store';
import { ApiError } from '../../../shared/api/api-client';
import { PasswordInput } from './PasswordInput';

interface RegisterFormProps {
  onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);

    try {
      const response = await register({ email, password, firstName, lastName });
      setAuth(response.accessToken, response.user);
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось зарегистрироваться');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <p className="auth-error">{error}</p>}

      <div className="auth-row">
        <div className="auth-field">
          <label htmlFor="register-firstName">Имя</label>
          <input
            id="register-firstName"
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="register-lastName">Фамилия</label>
          <input
            id="register-lastName"
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <PasswordInput
        id="register-password"
        label="Пароль"
        autoComplete="new-password"
        required
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <PasswordInput
        id="register-confirm-password"
        label="Подтвердите пароль"
        autoComplete="new-password"
        required
        minLength={8}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button className="auth-submit" type="submit" disabled={loading}>
        {loading ? 'Регистрация…' : 'Зарегистрироваться'}
      </button>
    </form>
  );
}
