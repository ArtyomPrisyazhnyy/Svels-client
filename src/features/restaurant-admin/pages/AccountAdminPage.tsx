'use client';

import { FormEvent, useState } from 'react';
import { ApiError } from '../../../shared/api/api-client';
import { useAuthStore } from '../../../store/auth.store';
import { changePassword } from '../api/account.api';
import '../styles/account-admin.scss';

export default function AccountAdminPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (!accessToken) {
      setError('Сессия истекла. Войдите снова.');
      return;
    }

    setSaving(true);

    try {
      await changePassword(accessToken, password);
      setPassword('');
      setConfirmPassword('');
      setSuccess('Пароль успешно изменён');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось изменить пароль');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="account-admin">
      <header className="account-admin__header">
        <h2>Аккаунт</h2>
        <p className="account-admin__intro">
          {user?.email} · {user?.firstName} {user?.lastName}
        </p>
      </header>

      {user?.authProvider === 'google' && (
        <p className="account-admin__notice">
          Вы входите через Google. Здесь можно задать пароль для входа по email — оба способа будут
          работать.
        </p>
      )}

      {error && <p className="account-admin__error">{error}</p>}
      {success && <p className="account-admin__success">{success}</p>}

      <form className="account-admin__form" onSubmit={handleSubmit}>
        <h3 className="account-admin__form-title">Смена пароля</h3>

        <label className="account-admin__field">
          <span>Новый пароль</span>
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={saving}
            required
          />
        </label>

        <label className="account-admin__field">
          <span>Повторите пароль</span>
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={saving}
            required
          />
        </label>

        <button type="submit" className="account-admin__submit" disabled={saving}>
          {saving ? 'Сохранение…' : 'Сохранить пароль'}
        </button>
      </form>
    </section>
  );
}
