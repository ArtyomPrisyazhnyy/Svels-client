/**
 * Геометрия и непрозрачности огонька в шапке — зеркало Svels-mobile
 * (`flame-theme-vars`, `flame-paint`, LoyaltyFlameHeaderButton).
 * Менять только синхронно с мобильным клиентом.
 */

export const FLAME_HEADER_ICON_SIZE_PX = 22;
export const FLAME_HEADER_STREAK_GAP_PX = 4;
export const FLAME_HEADER_STREAK_FONT_SIZE_PX = 15;
export const FLAME_HEADER_STREAK_FONT_WEIGHT = 700;

export const FLAME_BASE_SOFT_MIX_PERCENT = 58;
export const FLAME_DARK_BASE_SOFT_MIX_PERCENT = 56;

/** Состояние off — только контур, вся иконка @0.5. */
export const FLAME_OFF_PAINT = {
  strokeWidth: 1.75,
  scale: 1,
  iconOpacity: 0.5,
} as const;

/** Базовый уровень (серия без tier): заливка + ядро + glow. */
export const FLAME_BASE_PAINT = {
  strokeWidth: 1.85,
  scale: 1.04,
  coreOpacity: 0.82,
  coreScale: 0.38,
  glowOpacity: 0.22,
  glowScale: 1.1,
  iconOpacity: 1,
} as const;

export const FLAME_TIER1_PAINT = {
  strokeWidth: 2.6,
  scale: 1.04,
} as const;

export const FLAME_TIER2_PAINT = {
  strokeWidth: 2,
  scale: 1.05,
  innerScale: 0.42,
} as const;

export const FLAME_TIER3_PAINT = {
  strokeWidth: 2.15,
  scale: 1.06,
  innerScale: 0.5,
} as const;

export const FLAME_TIER4_PAINT = {
  strokeWidth: 2.45,
  scale: 1.06,
  innerScale: 0.56,
} as const;

export const FLAME_TIER5_PAINT = {
  strokeWidth: 2.7,
  scale: 1.06,
  innerScale: 0.62,
} as const;
