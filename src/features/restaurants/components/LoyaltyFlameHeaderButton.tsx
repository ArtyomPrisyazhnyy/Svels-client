'use client';

import type { LoyaltyFlameHeaderVisual } from '../utils/loyalty-flame-info.util';
import { loyaltyFlameButtonAriaLabel } from '../utils/loyalty-flame-info.util';
import { LoyaltyFlameIcon } from './LoyaltyFlameIcon';
import '../styles/loyalty-flame-button.scss';

interface LoyaltyFlameHeaderButtonProps {
  visual: LoyaltyFlameHeaderVisual;
  streakDays?: number;
  expiring?: boolean;
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

export function LoyaltyFlameHeaderButton({
  visual,
  streakDays = 0,
  expiring = false,
  onClick,
}: LoyaltyFlameHeaderButtonProps) {
  const showCounter = visual !== 'off' && streakDays >= 1;
  const ariaLabel = loyaltyFlameButtonAriaLabel(showCounter ? streakDays : 0);

  return (
    <button
      type="button"
      className={`loyalty-flame-button ${visualClassName(visual)}${
        showCounter ? ' loyalty-flame-button--with-counter' : ''
      }${expiring ? ' loyalty-flame-button--expiring' : ''}`}
      onClick={onClick}
      aria-label={ariaLabel}
      title={ariaLabel}
      data-testid="loyalty-flame-button"
    >
      <LoyaltyFlameIcon variant={iconVariant(visual)} size="header" />
      {showCounter ? (
        <span className="loyalty-flame-button__counter" data-testid="loyalty-flame-streak-counter">
          {streakDays}
        </span>
      ) : null}
    </button>
  );
}
