'use client';

import { useCallback, useEffect, useState } from 'react';
import { CurrencyAmount } from '@/shared/components/CurrencyAmount';
import { OrderLineItem } from '@/shared/components/OrderLineItem';
import type { OrderDto } from '@/shared/types/pre-order';
import { useAuthStore } from '@/store/auth.store';
import { fetchMyOrder, fetchMyOrders } from '../api/pre-orders.api';
import { useGuestDataStore } from '@/store/guest-data.store';
import { GuestOrdersListSkeleton } from './guest-page-skeletons/GuestPageSkeletons';
import { useGuestOrders } from '../hooks/useGuestOrders';
import {
  formatGuestCancelMessage,
  fulfillmentTypeLabel,
  isTerminalOrderStatus,
  ORDER_PAYMENT_STATUS_LABELS,
} from '../utils/guest-order.util';
import {
  formatVenueOrderDateTime,
  formatVenueRequestedAt,
} from '@/shared/utils/venue-datetime.util';
import { GuestOrderStatusBadge } from './GuestOrderStatusBadge';
import '../styles/guest-orders-list.scss';

const POLL_MS = 20_000;

interface GuestOrdersListProps {
  restaurantId: string;
}

export function GuestOrdersList({ restaurantId }: GuestOrdersListProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const { orders, loading, error } = useGuestOrders(restaurantId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<OrderDto | null>(null);

  const loadOrders = useCallback(async () => {
    if (!accessToken) {
      return;
    }
    try {
      const rows = await fetchMyOrders(accessToken);
      const forRestaurant = rows.filter((o) => o.restaurantId === restaurantId);
      useGuestDataStore.getState().setOrders(restaurantId, forRestaurant);
    } catch {
      // polling errors are non-fatal
    }
  }, [accessToken, restaurantId]);

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
    return (
      <div data-testid="guest-page-first-block">
        <GuestOrdersListSkeleton />
      </div>
    );
  }

  if (error) {
    return <p className="guest-orders-list__error">{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <div data-testid="guest-page-first-block">
        <p className="guest-orders-list__hint" data-testid="guest-orders-empty">
          Пока нет заказов. Добавьте блюда из меню и оформите заказ в корзине.
        </p>
      </div>
    );
  }

  return (
    <div className="guest-orders-list" data-testid="guest-orders-list">
      <div data-testid="guest-page-first-block">
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
                {formatVenueOrderDateTime(order.createdAt)}
              </p>
            </button>
          </li>
        ))}
      </ul>
      </div>

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
            {formatVenueRequestedAt(detail.requestedAt)}
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
              <OrderLineItem key={item.id} item={item} className="guest-orders-list__line" />
            ))}
          </ul>
          <p className="guest-orders-list__total">
            Итого: <CurrencyAmount amount={detail.totalAmount} />
          </p>
          {detail.cancelReason && (
            <p className="guest-orders-list__cancel" data-testid="guest-order-cancel-reason">
              {formatGuestCancelMessage(detail.cancelReason)}
            </p>
          )}
        </article>
      )}
    </div>
  );
}
