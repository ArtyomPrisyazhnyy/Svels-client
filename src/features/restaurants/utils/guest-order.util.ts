import type {
  FulfillmentType,
  OrderPaymentStatus,
  PreOrderStatus,
} from '@/shared/types/pre-order';
import { FULFILLMENT_OPTIONS, type FulfillmentKey } from '@/shared/types/order-settings';

export const PRE_ORDER_STATUS_LABELS: Record<PreOrderStatus, string> = {
  new: 'Новый',
  accepted: 'Принят',
  preparing: 'Готовится',
  ready: 'Готов',
  completed: 'Выполнен',
  cancelled: 'Отменён',
};

export const ORDER_PAYMENT_STATUS_LABELS: Record<OrderPaymentStatus, string> = {
  not_required: 'Оплата при получении',
  pending: 'Ожидает оплаты',
  authorized: 'Оплата авторизована',
  paid: 'Оплачен',
  voided: 'Оплата отменена',
  failed: 'Ошибка оплаты',
};

export const FULFILLMENT_TYPE_LABELS: Record<FulfillmentType, string> = {
  delivery: 'Доставка',
  takeaway: 'Самовывоз',
  dine_in: 'На месте',
};

export function fulfillmentKeyToType(key: FulfillmentKey): FulfillmentType {
  switch (key) {
    case 'fulfillmentDelivery':
      return 'delivery';
    case 'fulfillmentTakeaway':
      return 'takeaway';
    case 'fulfillmentDineIn':
      return 'dine_in';
  }
}

export function fulfillmentTypeLabel(type: FulfillmentType): string {
  return FULFILLMENT_TYPE_LABELS[type];
}

export function fulfillmentKeyLabel(key: FulfillmentKey): string {
  return FULFILLMENT_OPTIONS.find((o) => o.key === key)?.title ?? key;
}

export function isTerminalOrderStatus(status: PreOrderStatus): boolean {
  return status === 'completed' || status === 'cancelled';
}
