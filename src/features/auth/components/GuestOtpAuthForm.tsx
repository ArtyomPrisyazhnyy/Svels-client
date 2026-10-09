'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import {
  registerGuestWithOtp,
  resendGuestOtp,
  sendGuestOtp,
  verifyGuestOtp,
} from '../api/restaurant-guest-auth.api';
import { useAuthStore } from '@/store/auth.store';
import { useFavoritesStore } from '@/store/favorites.store';
import { ApiError } from '@/shared/api/api-client';
import { PhoneInput } from '@/shared/components/PhoneInput';
import type { OtpDeliveryChannel } from '@/shared/types/auth';
import { toPhoneApiValue, isCompleteBelarusPhone } from '@/shared/utils/phone.util';
import { useRestaurantStylingOptional } from '@/features/restaurants/context/RestaurantStylingContext';

type Step = 'phone' | 'code' | 'register';

interface GuestOtpAuthFormProps {
  restaurantId: string;
  onSuccess: () => void;
}

function channelLabel(channel: OtpDeliveryChannel): string {
  if (channel === 'telegram') {
    return 'Код отправлен в Telegram';
  }
  if (channel === 'dev') {
    return 'Код отправлен (dev-режим, смотрите лог сервера)';
  }
  return 'Код отправлен по SMS';
}

function secondsUntil(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 1000));
}

export function GuestOtpAuthForm({ restaurantId, onSuccess }: GuestOtpAuthFormProps) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const mergeFavorites = useFavoritesStore((s) => s.mergeAfterLogin);
  const { styling } = useRestaurantStylingOptional();
  const favoritesEnabled = styling.favoritesEnabled !== false;
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [channel, setChannel] = useState<OtpDeliveryChannel>('sms');
  const [resendAvailableAt, setResendAvailableAt] = useState<string | null>(null);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [registrationToken, setRegistrationToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  useEffect(() => {
    if (!resendAvailableAt) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset countdown when resend window clears
      setResendSeconds(0);
      return;
    }

    function tick() {
      setResendSeconds(secondsUntil(resendAvailableAt!));
    }

    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [resendAvailableAt]);

  async function handleSendPhone(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!isCompleteBelarusPhone(phone)) {
      setError('Укажите корректный номер телефона');
      return;
    }

    setLoading(true);

    try {
      const phoneE164 = toPhoneApiValue(phone);
      const response = await sendGuestOtp(restaurantId, { phone: phoneE164 });
      setMaskedPhone(response.maskedPhone);
      setChannel(response.channel);
      setResendAvailableAt(response.resendAvailableAt);
      setCode('');
      setStep('code');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось отправить код');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendSeconds > 0 || loading) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const phoneE164 = toPhoneApiValue(phone);
      const response = await resendGuestOtp(restaurantId, { phone: phoneE164 });
      setMaskedPhone(response.maskedPhone);
      setChannel(response.channel);
      setResendAvailableAt(response.resendAvailableAt);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось отправить код повторно');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const phoneE164 = toPhoneApiValue(phone);
      const response = await verifyGuestOtp(restaurantId, { phone: phoneE164, code });
      if (response.status === 'authenticated') {
        setAuth(response.accessToken, response.user);
        if (favoritesEnabled) {
          void mergeFavorites(restaurantId);
        }
        onSuccess();
        return;
      }

      setRegistrationToken(response.registrationToken);
      setMaskedPhone(response.maskedPhone);
      setStep('register');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось проверить код');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    if (!registrationToken) {
      setError('Сессия регистрации истекла. Запросите код снова');
      setStep('phone');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await registerGuestWithOtp(restaurantId, {
        registrationToken,
        firstName,
        lastName,
      });
      setAuth(response.accessToken, response.user);
      if (favoritesEnabled) {
        void mergeFavorites(restaurantId);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось завершить регистрацию');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'register') {
    return (
      <form className="auth-form" onSubmit={handleRegister}>
        {error && <p className="auth-error">{error}</p>}
        <p className="auth-hint">
          Номер {maskedPhone} подтверждён. Укажите имя для профиля в этом заведении.
        </p>

        <div className="auth-row">
          <div className="auth-field">
            <label htmlFor="otp-firstName">Имя</label>
            <input
              id="otp-firstName"
              type="text"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="otp-lastName">Фамилия</label>
            <input
              id="otp-lastName"
              type="text"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? 'Сохранение…' : 'Продолжить'}
        </button>
      </form>
    );
  }

  if (step === 'code') {
    return (
      <form className="auth-form" onSubmit={handleVerifyCode} data-testid="guest-otp-code-form">
        {error && <p className="auth-error" data-testid="auth-error">{error}</p>}
        <p className="auth-hint">
          {channelLabel(channel)}. Номер: <strong>{maskedPhone}</strong>
        </p>

        <div className="auth-field">
          <label htmlFor="otp-code">Код из сообщения</label>
          <input
            id="otp-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{4,8}"
            maxLength={8}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            data-testid="otp-code"
          />
        </div>

        <button
          className="auth-submit"
          type="submit"
          disabled={loading}
          data-testid="otp-verify-submit"
        >
          {loading ? 'Проверка…' : 'Подтвердить'}
        </button>

        <button
          type="button"
          className="auth-link-btn"
          disabled={loading || resendSeconds > 0}
          onClick={handleResend}
        >
          {resendSeconds > 0
            ? `Отправить ещё раз через ${resendSeconds} с`
            : 'Отправить ещё раз (SMS)'}
        </button>

        <button
          type="button"
          className="auth-link-btn"
          disabled={loading}
          onClick={() => {
            setStep('phone');
            setError(null);
            setCode('');
          }}
        >
          Изменить номер
        </button>
      </form>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSendPhone} data-testid="guest-otp-phone-form">
      {error && <p className="auth-error" data-testid="auth-error">{error}</p>}

      <div className="auth-field">
        <label htmlFor="otp-phone">Телефон</label>
        <PhoneInput
          id="otp-phone"
          required
          value={phone}
          onChange={setPhone}
          data-testid="otp-phone"
        />
      </div>

      <label className="auth-hint" style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
        <input
          type="checkbox"
          checked={privacyConsent}
          onChange={(e) => setPrivacyConsent(e.target.checked)}
          data-testid="guest-otp-privacy-consent"
        />
        <span>
          Я согласен(на) с{' '}
          <Link href="/privacypolicy" target="_blank" rel="noopener noreferrer">
            политикой конфиденциальности
          </Link>{' '}
          и обработкой персональных данных
        </span>
      </label>

      <button
        className="auth-submit"
        type="submit"
        disabled={loading || !privacyConsent}
        data-testid="otp-send-submit"
      >
        {loading ? 'Отправка…' : 'Получить код'}
      </button>
    </form>
  );
}
