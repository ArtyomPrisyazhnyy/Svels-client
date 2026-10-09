import type { FulfillmentType, OrderPaymentStatus, PreOrderPaymentMethod, PreOrderStatus } from '@/shared/types/pre-order';

export type OrdersTabId = 'new' | 'in_progress' | 'ready' | 'completed' | 'cancelled';

export const ORDERS_TABS: Array<{ id: OrdersTabId; label: string }> = [
  { id: 'new', label: 'Новые' },
  { id: 'in_progress', label: 'В работе' },
  { id: 'ready', label: 'Готовы' },
  { id: 'completed', label: 'Завершённые' },
  { id: 'cancelled', label: 'Отменённые' },
];

export const TAB_STATUSES: Record<OrdersTabId, PreOrderStatus[]> = {
  new: ['new'],
  in_progress: ['accepted', 'preparing'],
  ready: ['ready'],
  completed: ['completed'],
  cancelled: ['cancelled'],
};

export function tabStatusQuery(tab: OrdersTabId): string {
  return TAB_STATUSES[tab].join(',');
}

export const FULFILLMENT_LABELS: Record<FulfillmentType, string> = {
  delivery: 'Доставка',
  takeaway: 'Самовывоз',
  dine_in: 'В зале',
};

export const PAYMENT_METHOD_LABELS: Record<PreOrderPaymentMethod, string> = {
  cash: 'Наличные',
  card: 'Карта на месте',
  online: 'Онлайн',
};

export const PAYMENT_STATUS_LABELS: Record<OrderPaymentStatus, string> = {
  not_required: 'не требуется',
  pending: 'ожидает оплаты',
  authorized: 'авторизована',
  paid: 'оплачен',
  voided: 'отменена',
  failed: 'ошибка оплаты',
};

export const STATUS_LABELS: Record<PreOrderStatus, string> = {
  new: 'Новый',
  accepted: 'Принят',
  preparing: 'Готовится',
  ready: 'Готов',
  completed: 'Завершён',
  cancelled: 'Отменён',
};
