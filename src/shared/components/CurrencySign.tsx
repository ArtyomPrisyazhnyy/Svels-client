'use client';

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
      return 'BYN';
  }
}

/**
 * Графический знак BYN по инструкции НБРБ: лигатура текста «BYN» в шрифте nbrb.
 * @see https://www.nbrb.by/coinsbanknotes/byn-ico/nbrb-font
 */
export function CurrencySign({ className }: CurrencySignProps) {
  const { currencyDisplay } = useRestaurantStylingOptional();

  if (currencyDisplay === 'byn_glyph') {
    const classes = ['nbrb-icon', 'byn-sign', className].filter(Boolean).join(' ');
    return (
      <span className={classes} role="img" aria-label="белорусский рубль">
        BYN
      </span>
    );
  }

  return (
    <span className={className ? `currency-text ${className}` : 'currency-text'}>
      {renderCurrencyText(currencyDisplay)}
    </span>
  );
}
