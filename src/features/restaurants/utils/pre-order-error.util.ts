import { ApiError } from '@/shared/api/api-client';

const DEFAULT_MESSAGE = 'Не удалось оформить заказ. Попробуйте ещё раз или свяжитесь с заведением.';

const CODE_MESSAGES: Record<string, string> = {
  ORDERS_PAUSED: 'Заведение сейчас не принимает заказы.',
  RESTAURANT_CLOSED: 'Заведение сейчас закрыто. Выберите другое время или способ получения.',
  INVALID_REQUESTED_AT: 'Выбранное время недоступно. Выберите другой слот или «как можно скорее».',
  ITEM_UNAVAILABLE:
    'Одно из блюд в корзине недоступно. Удалите эту позицию и оформите заказ снова.',
  INVALID_MODIFIERS: 'Состав блюда изменился. Откройте позицию в меню и добавьте её в корзину заново.',
  ADDRESS_REQUIRED: 'Укажите адрес доставки: улицу и номер дома.',
  LOCATION_REQUIRED: 'Выберите точку заведения для самовывоза или заказа в зале.',
  FULFILLMENT_DISABLED: 'Выбранный способ получения сейчас недоступен.',
  PAYMENT_METHOD_DISABLED: 'Выбранный способ оплаты сейчас недоступен.',
};

export function getPreOrderErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return DEFAULT_MESSAGE;
  }

  if (error.code && CODE_MESSAGES[error.code]) {
    return CODE_MESSAGES[error.code];
  }

  if (error.message && error.status >= 400 && error.status < 500) {
    return error.message;
  }

  return DEFAULT_MESSAGE;
}

export function isItemUnavailableError(error: unknown): boolean {
  return error instanceof ApiError && error.code === 'ITEM_UNAVAILABLE';
}
