'use client';

import { VenueHeaderAction } from '@/shared/ui/VenueHeader/VenueHeaderAction';
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
  onClick,
}: LoyaltyFlameHeaderButtonProps) {
  const showStreak = streakDays >= 1;
  const label = loyaltyFlameButtonAriaLabel(streakDays);

  return (
    <VenueHeaderAction
      wide={showStreak}
      className={`loyalty-flame-button ${visualClassName(visual)}`}
      onClick={onClick}
      label={label}
      title={label}
      testId="loyalty-flame-button"
    >
      <LoyaltyFlameIcon variant={iconVariant(visual)} size="header" />
      {showStreak ? (
        <span className="loyalty-flame-button__count" data-testid="loyalty-flame-streak">
          {streakDays}
        </span>
      ) : null}
    </VenueHeaderAction>
  );
}
