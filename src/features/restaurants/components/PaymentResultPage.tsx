'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/api-client';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { PAYMENT_STATUS_LABELS, type PaymentStatus } from '@/shared/types/payment';
import type { OrderDto, PaymentInfo } from '@/shared/types/pre-order';
import { useAuthStore } from '@/store/auth.store';
import { fetchMyOrder, syncPayment } from '../api/pre-orders.api';
import { ORDER_PAYMENT_STATUS_LABELS } from '../utils/guest-order.util';
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
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- auth gate before fetch
      setLoading(false);
      setError('Войдите в аккаунт, чтобы увидеть статус оплаты');
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (paymentId) {
          const synced = await syncPayment(paymentId, accessToken!);
          if (!cancelled) {
            setPayment(synced);
          }
        }
        if (preOrderId) {
          const orderRow = await fetchMyOrder(accessToken!, preOrderId);
          if (!cancelled) {
            setOrder(orderRow);
          }
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
  }, [paymentId, preOrderId, accessToken]);

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

        {!loading && !error && (payment || order) && (
          <>
            {order && (
              <p className="payment-result__meta" data-testid="payment-result-order-number">
                Заказ №{order.orderNumber}
              </p>
            )}
            {order && (
              <p className="payment-result__hint" data-testid="payment-result-order-payment-status">
                Статус оплаты заказа: {ORDER_PAYMENT_STATUS_LABELS[order.paymentStatus]}
              </p>
            )}
            {payment && (
              <p
                className={`payment-result__status${
                  isSuccess ? ' payment-result__status--ok' : ' payment-result__status--bad'
                }`}
              >
                {PAYMENT_STATUS_LABELS[payment.status as PaymentStatus]}
              </p>
            )}
            {payment?.test && (
              <p className="payment-result__hint">Тестовый платёж bePaid (песочница).</p>
            )}
            {payment?.lastMessage && (
              <p className="payment-result__hint">{payment.lastMessage}</p>
            )}
          </>
        )}

        <div className="payment-result__actions">
          <Link href={paths.preOrder} className="payment-result__btn">
            Мои заказы
          </Link>
          <Link href={paths.home} className="payment-result__btn payment-result__btn--secondary">
            На страницу заведения
          </Link>
        </div>
      </div>
    </main>
  );
}
