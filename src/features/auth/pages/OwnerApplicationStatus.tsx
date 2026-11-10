'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { fetchMyRegistration } from '@/features/auth/api/restaurant-registration.api';
import type { MyRegistrationStatus } from '@/features/auth/api/restaurant-registration.api';
import { registerRestaurant } from '@/features/auth/api/restaurant.api';
import { ApiError } from '@/shared/api/api-client';
import { Button, Field, Input, Stack, Textarea } from '@/shared/ui';
import { useAuthStore } from '@/store/auth.store';
import '../styles/owner-application-status.scss';

export function OwnerApplicationStatus() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const logout = useAuthStore((s) => s.logout);
  const [registration, setRegistration] = useState<MyRegistrationStatus | null | undefined>(undefined);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [unp, setUnp] = useState('');
  const [city, setCity] = useState('Минск');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    let cancelled = false;
    fetchMyRegistration(accessToken)
      .then((data) => {
        if (!cancelled) setRegistration(data);
      })
      .catch(() => {
        if (!cancelled) {
          setRegistration(null);
          setLoadError('Не удалось узнать статус заявки. Обновите страницу.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!accessToken) return;
    setFormError(null);

    if (!/^\d{9}$/.test(unp)) {
      setFormError('УНП — это 9 цифр из свидетельства о регистрации. Пример: 123456789. Буквы и пробелы уберите.');
      return;
    }
    if (city.trim().length < 2 || address.trim().length < 5) {
      setFormError('Нужны город и адрес, например: Минск, ул. Немига 5. Адрес короче 5 символов не примут.');
      return;
    }

    setSubmitting(true);
    try {
      await registerRestaurant(accessToken, {
        name: businessName.trim(),
        unp,
        description: description.trim() || undefined,
        isChain: false,
        locations: [{ city: city.trim(), address: address.trim() }],
      });
      const next = await fetchMyRegistration(accessToken);
      setRegistration(next);
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : 'Заявку отправить не удалось. Проверьте УНП и адрес и попробуйте ещё раз.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="owner-status" data-testid="owner-application-status" data-status={registration?.status ?? 'unknown'}>
      <h1 className="owner-status__title">Заявка на заведение</h1>
      <p className="owner-status__lead">
        {user?.email
          ? `Вы вошли как ${user.email}. Этот адрес и пароль понадобятся, чтобы вернуться после проверки.`
          : 'Сохраните email и пароль — они нужны, чтобы вернуться после проверки.'}
      </p>

      {accessToken && registration === undefined ? (
        <Stack gap={3} testId="owner-status-loading">
          <div className="owner-status__skeleton" />
          <div className="owner-status__skeleton" />
        </Stack>
      ) : null}

      {loadError ? <p className="owner-status__error">{loadError}</p> : null}

      {registration?.status === 'pending' ? (
        <section className="owner-status__card">
          <h2>Заявка «{registration.name}» на проверке</h2>
          <p>
            Мы сверяем название, УНП и адрес. Панель, где заполняют меню, часы и оформление, откроется после проверки.
            Ускорить этот шаг с этой страницы нельзя — его делает команда Svels.
          </p>
          <p>
            Когда заявку одобрят, выйдите и войдите снова через вкладку «Уже есть аккаунт». Откроется чеклист запуска сайта.
            Пока проверки нет, сайт для гостей не создаётся.
          </p>
        </section>
      ) : null}

      {registration?.status === 'rejected' ? (
        <section className="owner-status__card">
          <h2>Заявку «{registration.name}» не приняли</h2>
          <p>{registration.rejectionReason?.trim() || 'Причина не указана. Напишите в поддержку Svels и спросите, что исправить.'}</p>
          <p>Исправьте данные в форме ниже и отправьте заявку ещё раз. Новый аккаунт создавать не нужно.</p>
        </section>
      ) : null}

      {registration?.status === 'approved' ? (
        <section className="owner-status__card">
          <h2>Заявку «{registration.name}» одобрили</h2>
          <p>
            Выйдите и войдите ещё раз тем же email и паролем. После входа откроется чеклист: описание, часы, меню и ссылка для гостей.
          </p>
        </section>
      ) : null}

      {!accessToken || registration === null || registration?.status === 'rejected' ? (
        <form className="owner-status__card" onSubmit={(event) => void handleSubmit(event)}>
          <h2>{registration?.status === 'rejected' ? 'Отправить заявку снова' : 'Аккаунт есть, заявки на заведение нет'}</h2>
          <p className="owner-status__hint">
            Заполните карточку заведения. УНП — 9 цифр, без букв. Одного адреса достаточно, сеть можно добавить позже.
          </p>
          <Field label="Название" htmlFor="owner-business" required>
            <Input id="owner-business" required minLength={2} value={businessName} onChange={(event) => setBusinessName(event.target.value)} />
          </Field>
          {formError ? <p className="owner-status__error">{formError}</p> : null}
          <Field
            label="УНП"
            htmlFor="owner-unp"
            required
            hint="9 цифр из свидетельства. Пример: 123456789."
          >
            <Input
              id="owner-unp"
              required
              inputMode="numeric"
              maxLength={9}
              placeholder="123456789"
              value={unp}
              onChange={(event) => setUnp(event.target.value.replace(/\D/g, '').slice(0, 9))}
            />
          </Field>
          <Field label="Город" htmlFor="owner-city" required>
            <Input id="owner-city" required minLength={2} value={city} onChange={(event) => setCity(event.target.value)} />
          </Field>
          <Field label="Адрес" htmlFor="owner-address" required hint="Улица и дом, не короче 5 символов. Пример: ул. Немига 5.">
            <Input
              id="owner-address"
              required
              minLength={5}
              placeholder="ул. Немига 5"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </Field>
          <Field label="Описание" htmlFor="owner-description" hint="Необязательно. Два предложения о том, что вы продаёте.">
            <Textarea id="owner-description" rows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
          </Field>
          <Button type="submit" loading={submitting} testId="owner-retry-submit">
            Отправить заявку
          </Button>
        </form>
      ) : null}

      <Button type="button" variant="ghost" onClick={logout} testId="owner-status-logout">
        Выйти
      </Button>
    </div>
  );
}
