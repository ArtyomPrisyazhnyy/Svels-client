'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/api-client';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { PAYMENT_STATUS_LABELS, type PaymentStatus } from '@/shared/types/payment';
import type { PaymentInfo } from '@/shared/types/pre-order';
import { useAuthStore } from '@/store/auth.store';
import { syncPayment } from '../api/pre-orders.api';
import '../styles/payment-result.scss';

interface PaymentResultPageProps {
  restaurantId: string;
  preOrderId?: string;
  paymentId?: string;
  returnStatus?: string;
}

export function PaymentResultPage({
  restaurantId,
  preOrderId,
  paymentId,
  returnStatus,
}: PaymentResultPageProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const paths = useRestaurantGuestPaths(restaurantId);
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paymentId || !accessToken) {
      setLoading(false);
      if (!accessToken) {
        setError('Войдите в аккаунт, чтобы увидеть статус оплаты');
      } else if (!paymentId) {
        setError('Не указан идентификатор платежа');
      }
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const synced = await syncPayment(paymentId!, accessToken!);
        if (!cancelled) {
          setPayment(synced);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Не удалось проверить оплату');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [paymentId, accessToken]);

  const status = payment?.status;
  const isSuccess =
    status === 'captured' ||
    status === 'authorized' ||
    returnStatus === 'success';

  return (
    <main className="payment-result" data-testid="payment-result-page">
      <div className="payment-result__card">
        <h1>Оплата заказа</h1>

        {loading && <p className="payment-result__hint">Проверяем статус оплаты…</p>}

        {!loading && error && <p className="payment-result__error">{error}</p>}

        {!loading && !error && payment && (
          <>
            <p
              className={`payment-result__status${
                isSuccess ? ' payment-result__status--ok' : ' payment-result__status--bad'
              }`}
            >
              {PAYMENT_STATUS_LABELS[payment.status as PaymentStatus]}
            </p>
            {payment.test && (
              <p className="payment-result__hint">Тестовый платёж bePaid (песочница).</p>
            )}
            {payment.lastMessage && (
              <p className="payment-result__hint">{payment.lastMessage}</p>
            )}
            {preOrderId && (
              <p className="payment-result__meta">Заказ: {preOrderId.slice(0, 8)}…</p>
            )}
          </>
        )}

        <div className="payment-result__actions">
          <Link href={paths.home} className="payment-result__btn">
            На страницу заведения
          </Link>
          <Link href={paths.account} className="payment-result__btn payment-result__btn--secondary">
            Личный кабинет
          </Link>
        </div>
      </div>
    </main>
  );
}
