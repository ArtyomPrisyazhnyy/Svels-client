'use client';

import { useRestaurantStylingOptional } from '../context/RestaurantStylingContext';
import { DEFAULT_RESTAURANT_STYLING } from '@/shared/types/restaurant-styling';
import { FLAME_THEME_VARS } from '../utils/flame-theme-vars';
import { resolveFlamePaint } from '../utils/flame-paint';
import type { LoyaltyFlameHeaderVisual } from '../utils/loyalty-flame-info.util';
import {
  LUCIDE_FLAME_PATH,
  loyaltyFlameTransformAroundCenter,
} from './loyalty-flame-icon-paths';

export type LoyaltyFlameIconVariant = LoyaltyFlameHeaderVisual;

interface LoyaltyFlameIconProps {
  variant: LoyaltyFlameIconVariant;
  className?: string;
  size?: 'header' | 'inline';
}

export function LoyaltyFlameIcon({
  variant,
  className = '',
  size = 'header',
}: LoyaltyFlameIconProps) {
  const { styling } = useRestaurantStylingOptional();
  const colorTheme = styling?.colorTheme ?? DEFAULT_RESTAURANT_STYLING.colorTheme;
  const vars = FLAME_THEME_VARS[colorTheme];
  const paint = resolveFlamePaint(variant, vars, 'currentColor');
  const showFill = paint.fill !== 'none';
  const offStroke = variant === 'off';

  return (
    <svg
      className={`loyalty-flame-icon loyalty-flame-icon--${size}${offStroke ? ' loyalty-flame-icon--off' : ''}${className ? ` ${className}` : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <g transform={loyaltyFlameTransformAroundCenter(paint.scale)}>
        <path
          d={LUCIDE_FLAME_PATH}
          fill="none"
          stroke={offStroke ? 'currentColor' : paint.stroke}
          strokeWidth={paint.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {showFill ? (
          <path d={LUCIDE_FLAME_PATH} fill={paint.fill} stroke="none" />
        ) : null}
        {paint.innerFill ? (
          <g transform={loyaltyFlameTransformAroundCenter(paint.innerScale)}>
            <path d={LUCIDE_FLAME_PATH} fill={paint.innerFill} stroke="none" />
          </g>
        ) : null}
      </g>
    </svg>
  );
}
