'use client';

import { CURRENCY_GLYPH } from '@/shared/config/currency';
import { useRestaurantStylingOptional } from '@/features/restaurants/context/RestaurantStylingContext';
import type { RestaurantCurrencyDisplay } from '@/shared/types/restaurant-styling';

interface CurrencySignProps {
  className?: string;
}

function renderCurrencyText(display: RestaurantCurrencyDisplay): string {
  switch (display) {
    case 'byn':
      return ' BYN';
    case 'r':
      return ' р';
    case 'rub':
      return ' руб';
    default:
      return CURRENCY_GLYPH;
  }
}

export function CurrencySign({ className }: CurrencySignProps) {
  const { currencyDisplay } = useRestaurantStylingOptional();

  if (currencyDisplay === 'byn_glyph') {
    return (
      <span
        className={className ? `byn-sign ${className}` : 'byn-sign'}
        role="img"
        aria-label="белорусский рубль"
      >
        {CURRENCY_GLYPH}
      </span>
    );
  }

  return (
    <span className={className ? `currency-text ${className}` : 'currency-text'}>
      {renderCurrencyText(currencyDisplay)}
    </span>
  );
}
