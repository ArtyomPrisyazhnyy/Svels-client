'use client';

import { CurrencySign } from '@/shared/components/CurrencySign';

interface CurrencyAmountProps {
  amount: number | string;
  fractionDigits?: number;
  className?: string;
}

export function CurrencyAmount({
  amount,
  fractionDigits = 0,
  className,
}: CurrencyAmountProps) {
  return (
    <span className={className ? `byn-price ${className}` : 'byn-price'}>
      {Number(amount).toFixed(fractionDigits)}
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
      {' ('}
      {sign}
      {Math.abs(delta).toFixed(0)}
      <CurrencySign />
      {')'}
    </span>
  );
}
