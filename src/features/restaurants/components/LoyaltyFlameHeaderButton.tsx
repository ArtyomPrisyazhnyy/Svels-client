'use client';

import type { LoyaltyFlameHeaderVisual } from '../utils/loyalty-flame-info.util';
import { LoyaltyFlameIcon } from './LoyaltyFlameIcon';
import '../styles/loyalty-flame-button.scss';

interface LoyaltyFlameHeaderButtonProps {
  visual: LoyaltyFlameHeaderVisual;
  onClick: () => void;
}

function visualClassName(visual: LoyaltyFlameHeaderVisual): string {
  if (visual === 'off') {
    return 'loyalty-flame-button--off';
  }
  if (visual === 'base') {
    return 'loyalty-flame-button--base';
  }
  return `loyalty-flame-button--tier-${visual}`;
}

function iconVariant(visual: LoyaltyFlameHeaderVisual): 'off' | 'base' | 1 | 2 | 3 | 4 | 5 {
  if (visual === 'off') {
    return 'off';
  }
  if (visual === 'base') {
    return 'base';
  }
  return visual;
}

export function LoyaltyFlameHeaderButton({ visual, onClick }: LoyaltyFlameHeaderButtonProps) {
  return (
    <button
      type="button"
      className={`loyalty-flame-button ${visualClassName(visual)}`}
      onClick={onClick}
      aria-label="Огонёк лояльности"
      title="Огонёк лояльности"
      data-testid="loyalty-flame-button"
    >
      <LoyaltyFlameIcon variant={iconVariant(visual)} size="header" />
    </button>
  );
}
