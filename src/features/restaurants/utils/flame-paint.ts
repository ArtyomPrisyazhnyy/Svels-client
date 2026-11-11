import type { FlameThemeVars } from './flame-theme-vars';
import type { LoyaltyFlameHeaderVisual } from './loyalty-flame-info.util';
import {
  FLAME_BASE_PAINT,
  FLAME_OFF_PAINT,
  FLAME_TIER1_PAINT,
  FLAME_TIER2_PAINT,
  FLAME_TIER3_PAINT,
  FLAME_TIER4_PAINT,
  FLAME_TIER5_PAINT,
} from './flame-geometry.ts';

export type FlamePaint = {
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeWidth: number;
  scale: number;
  /** Непрозрачность всей SVG-иконки (off = 0.5). */
  iconOpacity: number;
  /** Внешнее свечение (base). */
  glowFill: string | null;
  glowOpacity: number;
  glowScale: number;
  /** Светлое ядро. null — без внутреннего языка. */
  innerFill: string | null;
  innerOpacity: number;
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
      fillOpacity: 0,
      stroke: mutedColor,
      strokeWidth: FLAME_OFF_PAINT.strokeWidth,
      scale: FLAME_OFF_PAINT.scale,
      iconOpacity: FLAME_OFF_PAINT.iconOpacity,
      glowFill: null,
      glowOpacity: 0,
      glowScale: 1,
      innerFill: null,
      innerOpacity: 0,
      innerScale: 0,
    };
  }

  if (variant === 'base') {
    return {
      fill: vars.base,
      fillOpacity: FLAME_BASE_PAINT.fillOpacity,
      stroke: vars.base,
      strokeWidth: FLAME_BASE_PAINT.strokeWidth,
      scale: FLAME_BASE_PAINT.scale,
      iconOpacity: FLAME_BASE_PAINT.iconOpacity,
      glowFill: vars.base,
      glowOpacity: FLAME_BASE_PAINT.glowOpacity,
      glowScale: FLAME_BASE_PAINT.glowScale,
      innerFill: vars.base,
      innerOpacity: FLAME_BASE_PAINT.coreOpacity,
      innerScale: FLAME_BASE_PAINT.coreScale,
    };
  }

  if (variant === 1) {
    return {
      fill: vars.tier1,
      fillOpacity: 1,
      stroke: vars.tier1Edge,
      strokeWidth: FLAME_TIER1_PAINT.strokeWidth,
      scale: FLAME_TIER1_PAINT.scale,
      iconOpacity: 1,
      glowFill: null,
      glowOpacity: 0,
      glowScale: 1,
      innerFill: null,
      innerOpacity: 0,
      innerScale: 0,
    };
  }

  if (variant === 2) {
    return {
      fill: vars.tier2,
      fillOpacity: 1,
      stroke: vars.edge,
      strokeWidth: FLAME_TIER2_PAINT.strokeWidth,
      scale: FLAME_TIER2_PAINT.scale,
      iconOpacity: 1,
      glowFill: null,
      glowOpacity: 0,
      glowScale: 1,
      innerFill: vars.tier2Inner,
      innerOpacity: 1,
      innerScale: FLAME_TIER2_PAINT.innerScale,
    };
  }

  if (variant === 3) {
    return {
      fill: vars.tier3,
      fillOpacity: 1,
      stroke: vars.edge,
      strokeWidth: FLAME_TIER3_PAINT.strokeWidth,
      scale: FLAME_TIER3_PAINT.scale,
      iconOpacity: 1,
      glowFill: null,
      glowOpacity: 0,
      glowScale: 1,
      innerFill: vars.tier3Inner,
      innerOpacity: 1,
      innerScale: FLAME_TIER3_PAINT.innerScale,
    };
  }

  if (variant === 4) {
    return {
      fill: vars.tier4,
      fillOpacity: 1,
      stroke: vars.edge,
      strokeWidth: FLAME_TIER4_PAINT.strokeWidth,
      scale: FLAME_TIER4_PAINT.scale,
      iconOpacity: 1,
      glowFill: null,
      glowOpacity: 0,
      glowScale: 1,
      innerFill: vars.tier4Inner,
      innerOpacity: 1,
      innerScale: FLAME_TIER4_PAINT.innerScale,
    };
  }

  return {
    fill: vars.tier5,
    fillOpacity: 1,
    stroke: vars.edge,
    strokeWidth: FLAME_TIER5_PAINT.strokeWidth,
    scale: FLAME_TIER5_PAINT.scale,
    iconOpacity: 1,
    glowFill: null,
    glowOpacity: 0,
    glowScale: 1,
    innerFill: vars.tier5Inner,
    innerOpacity: 1,
    innerScale: FLAME_TIER5_PAINT.innerScale,
  };
}
