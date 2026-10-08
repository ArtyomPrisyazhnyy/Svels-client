import { CURRENCY_LIGATURE } from '@/shared/config/currency';

/** Текстовое представление цены (для title, aria, data-атрибутов) */
export function formatPricePlain(price: number | string, fractionDigits = 0): string {
  return `${Number(price).toFixed(fractionDigits)} ${CURRENCY_LIGATURE}`;
}

/** @deprecated Используйте компонент CurrencyAmount */
export function formatPrice(price: number | string, fractionDigits = 0): string {
  return `${Number(price).toFixed(fractionDigits)}\u00A0${CURRENCY_LIGATURE}`;
}

/** @deprecated Используйте компонент PriceDelta */
export function formatPriceDelta(delta: number): string {
  if (!delta) {
    return '';
  }

  const sign = delta > 0 ? '+' : '−';
  return ` (${sign}${Math.abs(delta).toFixed(0)}\u00A0${CURRENCY_LIGATURE})`;
}
