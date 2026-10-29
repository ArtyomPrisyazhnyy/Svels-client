'use client';

import type { LoyaltyFlameTier } from '../utils/loyalty-flame-info.util';

export type LoyaltyFlameIconVariant = 'off' | 'base' | LoyaltyFlameTier;

interface LoyaltyFlameIconProps {
  variant: LoyaltyFlameIconVariant;
  className?: string;
  size?: 'header' | 'inline';
}

function variantClassName(variant: LoyaltyFlameIconVariant): string {
  if (variant === 'off') {
    return 'loyalty-flame-icon--off';
  }
  if (variant === 'base') {
    return 'loyalty-flame-icon--base';
  }
  return `loyalty-flame-icon--tier-${variant}`;
}

export function LoyaltyFlameIcon({
  variant,
  className = '',
  size = 'header',
}: LoyaltyFlameIconProps) {
  const filled =
    variant === 'base' || (typeof variant === 'number' && variant !== 'off' && variant >= 2);

  return (
    <svg
      className={`loyalty-flame-icon loyalty-flame-icon--${size} ${variantClassName(variant)}${className ? ` ${className}` : ''}`}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2c1.5 3.2-.2 5.2-1.5 6.6C9 10.2 8 11.5 8 14a4 4 0 0 0 8 0c0-2.2-1-4.1-2.2-5.6-.7-.9-1.4-1.8-1.4-3.2 0-.8.2-1.7.6-2.7.3 1.2 1.1 2.1 2.2 2.9C17.1 6.7 19 9.2 19 13a7 7 0 1 1-14 0c0-2.6 1.1-4.7 2.6-6.4C9.2 4.8 10.6 3.4 12 2z"
      />
    </svg>
  );
}
