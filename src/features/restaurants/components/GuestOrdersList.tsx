'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/api-client';
import { CurrencyAmount } from '@/shared/components/CurrencyAmount';
import type { OrderDto } from '@/shared/types/pre-order';
import { useAuthStore } from '@/store/auth.store';
import { fetchMyOrder, fetchMyOrders } from '../api/pre-orders.api';
import {
  fulfillmentTypeLabel,
  isTerminalOrderStatus,
  ORDER_PAYMENT_STATUS_LABELS,
} from '../utils/guest-order.util';
import { GuestOrderStatusBadge } from './GuestOrderStatusBadge';
import '../styles/guest-orders-list.scss';

const POLL_MS = 20_000;

interface GuestOrdersListProps {
  restaurantId: string;
}

function formatRequestedAt(iso: string | null): string {
  if (!iso) {
    return 'Как можно скорее';
  }
  const date = new Date(iso);
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function GuestOrdersList({ restaurantId }: GuestOrdersListProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    try {
      const rows = await fetchMyOrders(accessToken);
      const forRestaurant = rows.filter((o) => o.restaurantId === restaurantId);
      setOrders(forRestaurant);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить заказы');
    } finally {
      setLoading(false);
    }
  }, [accessToken, restaurantId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    void loadOrders();
  }, [loadOrders]);

  const hasActiveOrders = orders.some((o) => !isTerminalOrderStatus(o.status));

  useEffect(() => {
    if (!hasActiveOrders) {
      return;
    }
    const timer = window.setInterval(() => {
      void loadOrders();
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [hasActiveOrders, loadOrders]);

  useEffect(() => {
    if (!selectedId || !accessToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset detail when selection cleared
      setDetail(null);
      return;
    }

    let cancelled = false;

    void fetchMyOrder(accessToken, selectedId)
      .then((order) => {
        if (!cancelled) {
          setDetail(order);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDetail(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedId, accessToken]);

  useEffect(() => {
    if (!selectedId || !hasActiveOrders || !accessToken) {
      return;
    }
    const timer = window.setInterval(() => {
      void fetchMyOrder(accessToken, selectedId).then((order) => setDetail(order)).catch(() => {});
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [selectedId, hasActiveOrders, accessToken]);

  if (loading) {
    return <p className="guest-orders-list__hint">Загрузка заказов…</p>;
  }

  if (error) {
    return <p className="guest-orders-list__error">{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <p className="guest-orders-list__hint" data-testid="guest-orders-empty">
        Пока нет заказов. Добавьте блюда из меню и оформите заказ в корзине.
      </p>
    );
  }

  return (
    <div className="guest-orders-list" data-testid="guest-orders-list">
      <ul className="guest-orders-list__items">
        {orders.map((order) => (
          <li key={order.id}>
            <button
              type="button"
              className={`guest-orders-list__item${
                selectedId === order.id ? ' guest-orders-list__item--active' : ''
              }`}
              onClick={() => setSelectedId(order.id === selectedId ? null : order.id)}
              data-testid={`guest-order-row-${order.orderNumber}`}
            >
              <div className="guest-orders-list__item-head">
                <strong>№{order.orderNumber}</strong>
                <GuestOrderStatusBadge status={order.status} />
              </div>
              <p className="guest-orders-list__item-meta">
                {fulfillmentTypeLabel(order.fulfillmentType)} ·{' '}
                <CurrencyAmount amount={order.totalAmount} />
              </p>
              <p className="guest-orders-list__item-date">
                {new Date(order.createdAt).toLocaleString('ru-RU')}
              </p>
            </button>
          </li>
        ))}
      </ul>

      {detail && selectedId === detail.id && (
        <article className="guest-orders-list__detail" data-testid="guest-order-detail">
          <h2>Заказ №{detail.orderNumber}</h2>
          <p className="guest-orders-list__detail-row">
            <span>Статус</span>
            <GuestOrderStatusBadge status={detail.status} />
          </p>
          <p className="guest-orders-list__detail-row">
            <span>Оплата</span>
            {ORDER_PAYMENT_STATUS_LABELS[detail.paymentStatus]}
          </p>
          <p className="guest-orders-list__detail-row">
            <span>Получение</span>
            {fulfillmentTypeLabel(detail.fulfillmentType)}
          </p>
          <p className="guest-orders-list__detail-row">
            <span>Время</span>
            {formatRequestedAt(detail.requestedAt)}
          </p>
          {detail.deliveryAddress && (
            <p className="guest-orders-list__detail-row">
              <span>Адрес</span>
              {[
                detail.deliveryAddress.street,
                detail.deliveryAddress.house,
                detail.deliveryAddress.apartment,
              ]
                .filter(Boolean)
                .join(', ')}
            </p>
          )}
          <ul className="guest-orders-list__lines">
            {detail.items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <CurrencyAmount amount={item.lineTotal} />
              </li>
            ))}
          </ul>
          <p className="guest-orders-list__total">
            Итого: <CurrencyAmount amount={detail.totalAmount} />
          </p>
          {detail.cancelReason && (
            <p className="guest-orders-list__cancel">Причина отмены: {detail.cancelReason}</p>
          )}
        </article>
      )}
    </div>
  );
}
