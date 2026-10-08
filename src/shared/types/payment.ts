export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'voided'
  | 'failed'
  | 'expired';

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Ожидает оплаты',
  authorized: 'Средства захолдированы',
  captured: 'Оплачено',
  voided: 'Холд отменён',
  failed: 'Ошибка оплаты',
  expired: 'Сессия оплаты истекла',
};
