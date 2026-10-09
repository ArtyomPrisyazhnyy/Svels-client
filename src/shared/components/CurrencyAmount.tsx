'use client';

import { CurrencySign } from '@/shared/components/CurrencySign';
import { formatCurrencyAmount } from '@/shared/utils/currency-format.util';

interface CurrencyAmountProps {
  amount: number | string;
  fractionDigits?: number;
  className?: string;
}

export function CurrencyAmount({
  amount,
  fractionDigits,
  className,
}: CurrencyAmountProps) {
  return (
    <span className={className ? `byn-price ${className}` : 'byn-price'}>
      <span className="byn-price__amount">{formatCurrencyAmount(amount, fractionDigits)}</span>
      <CurrencySign />
    </span>
  );
}

interface PriceDeltaProps {
  delta: number;
}

export function PriceDelta({ delta }: PriceDeltaProps) {
  if (!delta) {
    return null;
  }

  const sign = delta > 0 ? '+' : '−';

  return (
    <span className="byn-price">
      <span className="byn-price__amount">
        {' ('}
        {sign}
        {Math.abs(delta).toFixed(0)}
      </span>
      <CurrencySign />
      <span className="byn-price__amount">{')'}</span>
    </span>
  );
}
