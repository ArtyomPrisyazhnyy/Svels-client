'use client';

import type { OrderDto } from '@/shared/types/pre-order';
import type { UserRole } from '@/shared/types/auth';
import type { RestaurantLocation } from '@/shared/types/restaurant-location';
import { formatRestaurantLocationLine } from '@/shared/types/restaurant-location';
import { formatDateTimeMinsk, formatTimeMinsk } from './dateMinsk';
import {
  FULFILLMENT_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  STATUS_LABELS,
} from './orderLabels';
import { canShowCancelButton, getOrderActions } from './orderTransitions';

interface OrderCardProps {
  order: OrderDto;
  role: UserRole | undefined;
  locationById: Map<string, RestaurantLocation>;
  busy: boolean;
  onStatusChange: (orderId: string, status: OrderDto['status']) => void;
  onCancelClick: (order: OrderDto) => void;
}

function formatAddress(order: OrderDto): string {
  const addr = order.deliveryAddress;
  if (!addr) {
    return '—';
  }
  const parts = [
    `${addr.street}, ${addr.house}`,
    addr.apartment ? `кв. ${addr.apartment}` : null,
    addr.entrance ? `подъезд ${addr.entrance}` : null,
    addr.floor ? `эт. ${addr.floor}` : null,
    addr.intercom ? `домофон ${addr.intercom}` : null,
  ].filter(Boolean);
  return parts.join(', ');
}

function formatMoney(amount: number): string {
  return `${amount.toFixed(2)} BYN`;
}

export function OrderCard({
  order,
  role,
  locationById,
  busy,
  onStatusChange,
  onCancelClick,
}: OrderCardProps) {
  const actions = getOrderActions(order.status, role);
  const showCancel = canShowCancelButton(role) && ['new', 'accepted', 'preparing', 'ready'].includes(order.status);

  const locationLine =
    order.locationId && locationById.has(order.locationId)
      ? formatRestaurantLocationLine(locationById.get(order.locationId)!)
      : order.fulfillmentType === 'delivery'
        ? formatAddress(order)
        : '—';

  const placeLabel =
    order.fulfillmentType === 'delivery'
      ? `Адрес: ${locationLine}`
      : `Точка: ${locationLine}`;

  return (
    <article className="orders-admin__card" data-testid={`order-card-${order.id}`}>
      <header className="orders-admin__card-header">
        <div>
          <span className="orders-admin__card-number">№{order.orderNumber}</span>
          <span className="orders-admin__card-time">
            {formatTimeMinsk(order.createdAt)} · {formatDateTimeMinsk(order.createdAt).split(', ')[0]}
          </span>
        </div>
        <span className={`orders-admin__status orders-admin__status--${order.status}`}>
          {STATUS_LABELS[order.status]}
        </span>
      </header>

      <dl className="orders-admin__meta">
        <div>
          <dt>Тип</dt>
          <dd>{FULFILLMENT_LABELS[order.fulfillmentType]}</dd>
        </div>
        <div>
          <dt>Ко времени</dt>
          <dd>{order.requestedAt ? formatDateTimeMinsk(order.requestedAt) : 'Как можно скорее'}</dd>
        </div>
        <div className="orders-admin__meta-wide">
          <dt>{order.fulfillmentType === 'delivery' ? 'Адрес' : 'Точка'}</dt>
          <dd>{placeLabel.replace(/^(Адрес|Точка): /, '')}</dd>
        </div>
        {(order.recipientName || order.recipientPhone) && (
          <div className="orders-admin__meta-wide">
            <dt>Получатель</dt>
            <dd>
              {[order.recipientName, order.recipientPhone].filter(Boolean).join(' · ')}
            </dd>
          </div>
        )}
        <div>
          <dt>Гость</dt>
          <dd>{order.customerName}</dd>
        </div>
        <div>
          <dt>Телефон</dt>
          <dd>
            <a href={`tel:${order.customerPhone}`} className="orders-admin__tel">
              {order.customerPhone}
            </a>
          </dd>
        </div>
        <div>
          <dt>Оплата</dt>
          <dd>
            {PAYMENT_METHOD_LABELS[order.paymentMethod]} · {PAYMENT_STATUS_LABELS[order.paymentStatus]}
          </dd>
        </div>
      </dl>

      <ul className="orders-admin__items">
        {order.items.map((item) => (
          <li key={item.id} className="orders-admin__item">
            <div className="orders-admin__item-head">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatMoney(item.lineTotal)}</span>
            </div>
            {item.modifiers.length > 0 && (
              <ul className="orders-admin__modifiers">
                {item.modifiers.map((mod, idx) => (
                  <li key={`${item.id}-${idx}`}>
                    {mod.groupName}: {mod.optionName}
                    {mod.priceDelta !== 0 ? ` (+${mod.priceDelta.toFixed(2)})` : ''}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <p className="orders-admin__total">Итого: {formatMoney(order.totalAmount)}</p>

      {order.comment && (
        <p className="orders-admin__comment">
          <strong>Комментарий:</strong> {order.comment}
        </p>
      )}
      {order.cancelReason && (
        <p className="orders-admin__comment orders-admin__comment--cancel">
          <strong>Причина отмены:</strong> {order.cancelReason}
        </p>
      )}

      {(actions.length > 0 || showCancel) && (
        <div className="orders-admin__card-actions">
          {actions.map((action) => (
            <button
              key={action.status}
              type="button"
              className={`orders-admin__btn orders-admin__btn--${action.variant}`}
              disabled={busy}
              onClick={() => onStatusChange(order.id, action.status)}
              data-testid={`order-action-${action.status}`}
            >
              {action.label}
            </button>
          ))}
          {showCancel && (
            <button
              type="button"
              className="orders-admin__btn orders-admin__btn--danger"
              disabled={busy}
              onClick={() => onCancelClick(order)}
              data-testid="order-action-cancel"
            >
              Отменить
            </button>
          )}
        </div>
      )}
    </article>
  );
}
