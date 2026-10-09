'use client';

import Link from 'next/link';
import '../styles/order-success-view.scss';

interface OrderSuccessViewProps {
  orderNumber: number;
  ordersHref: string;
  onClose?: () => void;
}

export function OrderSuccessView({ orderNumber, ordersHref, onClose }: OrderSuccessViewProps) {
  return (
    <div className="order-success-view" data-testid="cart-order-success">
      <p className="order-success-view__title">Заказ №{orderNumber} принят</p>
      <p className="order-success-view__hint">
        Мы начали обработку заказа. Статус можно отслеживать в разделе «Мои заказы».
      </p>
      <div className="order-success-view__actions">
        <Link href={ordersHref} className="order-success-view__link" onClick={onClose}>
          Мои заказы
        </Link>
        {onClose && (
          <button type="button" className="order-success-view__close" onClick={onClose}>
            Закрыть
          </button>
        )}
      </div>
    </div>
  );
}
