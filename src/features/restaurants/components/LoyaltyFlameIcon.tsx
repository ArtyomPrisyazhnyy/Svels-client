'use client';

import type { LoyaltyFlameTier } from '../utils/loyalty-flame-info.util';
import { LUCIDE_FLAME_PATH } from './loyalty-flame-icon-paths';

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
  return (
    <svg
      className={`loyalty-flame-icon loyalty-flame-icon--${size} ${variantClassName(variant)}${className ? ` ${className}` : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path className="loyalty-flame-icon__shape" d={LUCIDE_FLAME_PATH} />
    </svg>
  );
}
