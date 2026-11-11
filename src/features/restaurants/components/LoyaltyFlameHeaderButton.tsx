'use client';

import {
  loyaltyFlameButtonAriaLabel,
  type LoyaltyFlameHeaderVisual,
} from '../utils/loyalty-flame-info.util';
import { LoyaltyFlameIcon } from './LoyaltyFlameIcon';
import '../styles/loyalty-flame-button.scss';

interface LoyaltyFlameHeaderButtonProps {
  visual: LoyaltyFlameHeaderVisual;
  /** Серия визитов. Число рисуется только при значении >= 1. */
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
  const showStreak = streakDays >= 1;
  const label = loyaltyFlameButtonAriaLabel(streakDays);

  return (
    <button
      type="button"
      className={`loyalty-flame-button ${visualClassName(visual)}${
        showStreak ? ' loyalty-flame-button--with-count' : ''
      }${expiring ? ' loyalty-flame-button--expiring' : ''}`}
      onClick={onClick}
      aria-label={label}
      title={label}
      data-testid="loyalty-flame-button"
    >
      <LoyaltyFlameIcon variant={iconVariant(visual)} size="header" />
      {showStreak ? (
        <span className="loyalty-flame-button__count" data-testid="loyalty-flame-streak">
          {streakDays}
        </span>
      ) : null}
    </button>
  );
}
