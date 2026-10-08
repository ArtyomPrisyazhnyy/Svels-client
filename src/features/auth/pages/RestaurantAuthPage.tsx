'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { register } from '../api/auth.api';
import { registerRestaurant } from '../api/restaurant.api';
import { LoginForm } from '../components/LoginForm';
import { getPostAuthPath } from '../../../shared/routing/get-post-auth-path';
import { useAuthStore } from '../../../store/auth.store';
import { ApiError } from '../../../shared/api/api-client';
import { PasswordInput } from '../components/PasswordInput';
import '../styles/auth.scss';
import '../styles/restaurant-auth.scss';
import '../styles/restaurant-auth-form.scss';

type RestaurantTab = 'register' | 'login';

interface LocationField {
  label: string;
  city: string;
  address: string;
}

export function RestaurantAuthPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [tab, setTab] = useState<RestaurantTab>('register');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [businessName, setBusinessName] = useState('');
  const [unp, setUnp] = useState('');
  const [isChain, setIsChain] = useState(false);
  const [description, setDescription] = useState('');
  const [locations, setLocations] = useState<LocationField[]>([
    { label: '', city: '', address: '' },
  ]);

  function updateLocation(index: number, field: keyof LocationField, value: string) {
    setLocations((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }

  function addLocation() {
    setLocations((prev) => [...prev, { label: '', city: '', address: '' }]);
  }

  function removeLocation(index: number) {
    if (locations.length <= 1) return;
    setLocations((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleRegisterSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (!/^\d{9}$/.test(unp)) {
      setError('УНП должен содержать 9 цифр');
      return;
    }

    const filledLocations = locations.filter((l) => l.address.trim() && l.city.trim());
    if (!filledLocations.length) {
      setError('Укажите город и адрес хотя бы одной точки');
      return;
    }

    setLoading(true);

    try {
      const auth = await register({ email, password, firstName, lastName });
      setAuth(auth.accessToken, auth.user);

      await registerRestaurant(auth.accessToken, {
        name: businessName,
        unp,
        description: description || undefined,
        isChain,
        locations: filledLocations.map((l) => ({
          label: l.label.trim() || undefined,
          city: l.city.trim(),
          address: l.address.trim(),
        })),
      });

      setSuccess(
        'Заявка отправлена на модерацию. После одобления суперадминистратором вы получите доступ к панели заведения.',
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось отправить заявку');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page" data-testid="restaurant-auth-page">
      <div className="auth-card auth-card--wide">
        <Link href="/" className="auth-card__back">
          ← На главную
        </Link>
        <h1 className="auth-card__title">Для заведений</h1>
        <p className="auth-card__subtitle">
          Регистрация ресторана, бара или кофейни. Сети могут указать несколько точек.
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tabs__btn ${tab === 'register' ? 'auth-tabs__btn--active' : ''}`}
            data-testid="auth-tab-register"
            onClick={() => {
              setTab('register');
              setError(null);
              setSuccess(null);
            }}
          >
            Подать заявку
          </button>
          <button
            type="button"
            className={`auth-tabs__btn ${tab === 'login' ? 'auth-tabs__btn--active' : ''}`}
            data-testid="auth-tab-login"
            onClick={() => {
              setTab('login');
              setError(null);
              setSuccess(null);
            }}
          >
            Уже есть аккаунт
          </button>
        </div>

        {tab === 'login' ? (
          <div>
            <p className="restaurant-auth__hint">
              Войдите аккаунтом администратора заведения. Если заявка ещё на модерации — дождитесь
              одобрения.
            </p>
            {error && <p className="auth-error">{error}</p>}
            <LoginForm
              onSuccess={() => {
                const role = useAuthStore.getState().user?.role ?? 'user';
                router.replace(getPostAuthPath(role));
              }}
            />
          </div>
        ) : (
          <form className="auth-form restaurant-auth" onSubmit={handleRegisterSubmit}>
            {error && (
              <p className="auth-error" data-testid="auth-error">
                {error}
              </p>
            )}
            {success && (
              <p className="auth-success" data-testid="auth-success">
                {success}
              </p>
            )}

            <fieldset className="restaurant-auth__section">
              <legend>Контактное лицо</legend>
              <div className="auth-row">
                <div className="auth-field">
                  <label htmlFor="rest-firstName">Имя</label>
                  <input
                    id="rest-firstName"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="rest-lastName">Фамилия</label>
                  <input
                    id="rest-lastName"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="auth-field">
                <label htmlFor="rest-email">Email</label>
                <input
                  id="rest-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <PasswordInput
                id="rest-password"
                label="Пароль"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordInput
                id="rest-confirm"
                label="Подтвердите пароль"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </fieldset>

            <fieldset className="restaurant-auth__section">
              <legend>Заведение</legend>
              <div className="auth-field">
                <label htmlFor="rest-business">Название заведения / сети</label>
                <input
                  id="rest-business"
                  required
                  minLength={2}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="rest-unp">УНП</label>
                <input
                  id="rest-unp"
                  required
                  inputMode="numeric"
                  pattern="\d{9}"
                  maxLength={9}
                  placeholder="123456789"
                  value={unp}
                  onChange={(e) => setUnp(e.target.value.replace(/\D/g, '').slice(0, 9))}
                />
              </div>
              <label className="restaurant-auth__checkbox">
                <input
                  type="checkbox"
                  checked={isChain}
                  onChange={(e) => setIsChain(e.target.checked)}
                />
                Это сеть — несколько точек под одним брендом
              </label>
              <div className="auth-field">
                <label htmlFor="rest-desc">Описание (необязательно)</label>
                <textarea
                  id="rest-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </fieldset>

            <fieldset className="restaurant-auth__section">
              <legend>{isChain ? 'Точки сети' : 'Адрес заведения'}</legend>
              {locations.map((loc, index) => (
                <div key={index} className="restaurant-auth__location">
                  {isChain && (
                    <div className="auth-field">
                      <label htmlFor={`loc-label-${index}`}>Название точки</label>
                      <input
                        id={`loc-label-${index}`}
                        placeholder="Например: на Немиге"
                        value={loc.label}
                        onChange={(e) => updateLocation(index, 'label', e.target.value)}
                      />
                    </div>
                  )}
                  <div className="auth-field">
                    <label htmlFor={`loc-city-${index}`}>Город</label>
                    <input
                      id={`loc-city-${index}`}
                      required={index === 0}
                      minLength={2}
                      placeholder="Минск"
                      value={loc.city}
                      onChange={(e) => updateLocation(index, 'city', e.target.value)}
                    />
                  </div>
                  <div className="auth-field">
                    <label htmlFor={`loc-address-${index}`}>Адрес</label>
                    <input
                      id={`loc-address-${index}`}
                      required={index === 0}
                      minLength={5}
                      value={loc.address}
                      onChange={(e) => updateLocation(index, 'address', e.target.value)}
                    />
                  </div>
                  {isChain && locations.length > 1 && (
                    <button
                      type="button"
                      className="restaurant-auth__remove"
                      onClick={() => removeLocation(index)}
                    >
                      Удалить точку
                    </button>
                  )}
                </div>
              ))}
              {isChain && (
                <button type="button" className="restaurant-auth__add" onClick={addLocation}>
                  + Добавить точку
                </button>
              )}
            </fieldset>

            <button className="auth-submit" type="submit" disabled={loading || !!success}>
              {loading ? 'Отправка…' : 'Отправить заявку'}
            </button>
          </form>
        )}

        <p className="auth-card__footer">
          Уже подавали заявку на подключение? Перейдите на вкладку «Вход».
        </p>
      </div>
    </div>
  );
}
