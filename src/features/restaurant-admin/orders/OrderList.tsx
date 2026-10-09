'use client';

import type { OrderDto } from '@/shared/types/pre-order';
import type { UserRole } from '@/shared/types/auth';
import type { RestaurantLocation } from '@/shared/types/restaurant-location';
import { OrderCard } from './OrderCard';

interface OrderListProps {
  orders: OrderDto[];
  loading: boolean;
  role: UserRole | undefined;
  locations: RestaurantLocation[];
  busyOrderId: string | null;
  onStatusChange: (orderId: string, status: OrderDto['status']) => void;
  onCancelClick: (order: OrderDto) => void;
}

export function OrderList({
  orders,
  loading,
  role,
  locations,
  busyOrderId,
  onStatusChange,
  onCancelClick,
}: OrderListProps) {
  const locationById = new Map(locations.map((l) => [l.id, l]));

  if (loading) {
    return <p className="orders-admin__empty">Загрузка заказов…</p>;
  }

  if (orders.length === 0) {
    return <p className="orders-admin__empty">На выбранную дату заказов в этой вкладке нет.</p>;
  }

  return (
    <div className="orders-admin__list" data-testid="orders-admin-list">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          role={role}
          locationById={locationById}
          busy={busyOrderId === order.id}
          onStatusChange={onStatusChange}
          onCancelClick={onCancelClick}
        />
      ))}
    </div>
  );
}
