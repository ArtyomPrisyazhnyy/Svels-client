import type { FlameThemeVars } from './flame-theme-vars';
import type { LoyaltyFlameHeaderVisual } from './loyalty-flame-info.util';

export type FlamePaint = {
  fill: string;
  stroke: string;
  strokeWidth: number;
  scale: number;
  /** Светлое ядро. null — сплошное пламя без внутреннего языка. */
  innerFill: string | null;
  innerScale: number;
};

/**
 * Уровни 1–5 различаются цветом и рисунком самого огонька
 * (контур на иконке, ядро). Круга-подложки нет.
 * 6+ использует стиль 5-го уровня.
 */
export function resolveFlamePaint(
  variant: LoyaltyFlameHeaderVisual,
  vars: FlameThemeVars,
  mutedColor: string,
): FlamePaint {
  if (variant === 'off') {
    return {
      fill: 'none',
      stroke: mutedColor,
      strokeWidth: 1.75,
      scale: 1,
      innerFill: null,
      innerScale: 0,
    };
  }

  if (variant === 'base') {
    return {
      fill: vars.baseSoft,
      stroke: vars.base,
      strokeWidth: 1.75,
      scale: 1.04,
      innerFill: null,
      innerScale: 0,
    };
  }

  if (variant === 1) {
    return {
      fill: vars.tier1,
      stroke: vars.tier1Edge,
      strokeWidth: 2.6,
      scale: 1.04,
      innerFill: null,
      innerScale: 0,
    };
  }

  if (variant === 2) {
    return {
      fill: vars.tier2,
      stroke: vars.edge,
      strokeWidth: 2,
      scale: 1.05,
      innerFill: vars.tier2Inner,
      innerScale: 0.42,
    };
  }

  if (variant === 3) {
    return {
      fill: vars.tier3,
      stroke: vars.edge,
      strokeWidth: 2.15,
      scale: 1.06,
      innerFill: vars.tier3Inner,
      innerScale: 0.5,
    };
  }

  if (variant === 4) {
    return {
      fill: vars.tier4,
      stroke: vars.edge,
      strokeWidth: 2.45,
      scale: 1.06,
      innerFill: vars.tier4Inner,
      innerScale: 0.56,
    };
  }

  return {
    fill: vars.tier5,
    stroke: vars.edge,
    strokeWidth: 2.7,
    scale: 1.06,
    innerFill: vars.tier5Inner,
    innerScale: 0.62,
  };
}
