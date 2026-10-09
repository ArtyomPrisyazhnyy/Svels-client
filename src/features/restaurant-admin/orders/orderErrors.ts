import { ApiError } from '@/shared/api/api-client';

const CODE_MESSAGES: Record<string, string> = {
  INVALID_TRANSITION: 'Этот переход статуса сейчас недоступен. Обновите список заказов.',
  PAID_ORDER_CANCEL_NOT_SUPPORTED:
    'Нельзя отменить заказ с успешной онлайн-оплатой. Обратитесь в поддержку.',
  ORDERS_PAUSED: 'Приём заказов на паузе.',
  RESTAURANT_CLOSED: 'Заведение сейчас закрыто.',
  VALIDATION: 'Проверьте введённые данные.',
};

export function formatOrderApiError(err: unknown, fallback = 'Не удалось выполнить действие'): string {
  if (err instanceof ApiError) {
    if (err.code && CODE_MESSAGES[err.code]) {
      return CODE_MESSAGES[err.code];
    }
    return err.message || fallback;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
}
