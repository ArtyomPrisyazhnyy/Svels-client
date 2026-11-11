import type { RestaurantColorTheme } from '@/shared/types/restaurant-styling';
import {
  FLAME_BASE_SOFT_MIX_PERCENT,
  FLAME_DARK_BASE_SOFT_MIX_PERCENT,
} from './flame-geometry.ts';

export interface FlameThemeVars {
  base: string;
  baseSoft: string;
  baseInner: string;
  tier1: string;
  tier1Edge: string;
  tier1Inner: string;
  tier2: string;
  tier2Inner: string;
  tier3: string;
  tier3Inner: string;
  tier4: string;
  tier4Inner: string;
  tier5: string;
  tier5Inner: string;
  edge: string;
}

/** Семантика tier 1–5 одинакова на светлых темах: янтарь → оранж → красный → фиолет → синий. */
const LIGHT_TIERS = {
  tier1: '#fbbf24',
  tier1Edge: '#a16207',
  tier2: '#ea580c',
  tier3: '#dc2626',
  tier4: '#9333ea',
  tier5: '#2563eb',
} as const;

/** На тёмных фонах — те же hue-ступени, чуть ярче заливки. */
const DARK_TIERS = {
  tier1: '#fde047',
  tier1Edge: '#854d0e',
  tier2: '#fb923c',
  tier3: '#f87171',
  tier4: '#e879f9',
  tier5: '#60a5fa',
} as const;

function lightEdge(textHex: string): string {
  return `color-mix(in srgb, ${textHex} 34%, transparent)`;
}

function darkEdge(textHex: string): string {
  return `color-mix(in srgb, ${textHex} 55%, transparent)`;
}

const lightTierInners = {
  tier1Inner: '#fef08a',
  tier2Inner: '#fdba74',
  tier3Inner: '#fca5a5',
  tier4Inner: '#e9d5ff',
  tier5Inner: '#93c5fd',
};

const darkTierInners = {
  tier1Inner: '#fef9c3',
  tier2Inner: '#ffedd5',
  tier3Inner: '#fecaca',
  tier4Inner: '#fae8ff',
  tier5Inner: '#dbeafe',
};

function lightBase(base: string, softHex: string, baseInner: string): Pick<FlameThemeVars, 'base' | 'baseSoft' | 'baseInner'> {
  return {
    base,
    baseSoft: `color-mix(in srgb, ${softHex} ${FLAME_BASE_SOFT_MIX_PERCENT}%, transparent)`,
    baseInner,
  };
}

function darkBase(base: string, softHex: string, baseInner: string): Pick<FlameThemeVars, 'base' | 'baseSoft' | 'baseInner'> {
  return {
    base,
    baseSoft: `color-mix(in srgb, ${softHex} ${FLAME_DARK_BASE_SOFT_MIX_PERCENT}%, transparent)`,
    baseInner,
  };
}

/** Палитры огонька под фон страницы/шапки (`--rs-bg`). */
export const FLAME_THEME_VARS: Record<RestaurantColorTheme, FlameThemeVars> = {
  classic: {
    ...lightBase('#d97706', '#f59e0b', '#fde68a'),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#0f172a'),
  },
  ocean: {
    ...lightBase('#c2410c', '#ea580c', '#fdba74'),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#0c4a6e'),
  },
  forest: {
    ...lightBase('#b45309', '#d97706', '#fde68a'),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#14532d'),
  },
  warm: {
    ...lightBase('#9a3412', '#c2410c', '#fdba74'),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#7c2d12'),
  },
  berry: {
    ...lightBase('#c2410c', '#ea580c', '#fdba74'),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#881337'),
  },
  lavender: {
    ...lightBase('#c2410c', '#ea580c', '#fdba74'),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#581c87'),
  },
  sand: {
    ...lightBase('#b45309', '#d97706', '#fde68a'),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#44403c'),
  },
  citrus: {
    ...lightBase('#b45309', '#d97706', '#fde68a'),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#713f12'),
  },
  graphite: {
    ...lightBase('#b45309', '#d97706', '#fde68a'),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#18181b'),
  },
  monochrome: {
    ...lightBase('#c2410c', '#ea580c', '#fdba74'),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#0a0a0a'),
  },
  monochromeDark: {
    ...darkBase('#fbbf24', '#fbbf24', '#fef9c3'),
    ...DARK_TIERS,
    ...darkTierInners,
    edge: darkEdge('#000000'),
  },
  midnight: {
    ...darkBase('#fb923c', '#fb923c', '#fed7aa'),
    ...DARK_TIERS,
    ...darkTierInners,
    edge: darkEdge('#020617'),
  },
  ember: {
    ...darkBase('#fb923c', '#fb923c', '#fed7aa'),
    ...DARK_TIERS,
    ...darkTierInners,
    edge: darkEdge('#0c0a09'),
  },
  obsidian: {
    ...darkBase('#fb923c', '#fb923c', '#fed7aa'),
    ...DARK_TIERS,
    ...darkTierInners,
    edge: darkEdge('#000000'),
  },
  moss: {
    ...darkBase('#fb923c', '#fb923c', '#fed7aa'),
    ...DARK_TIERS,
    ...darkTierInners,
    edge: darkEdge('#022c15'),
  },
  wine: {
    ...darkBase('#fb923c', '#fb923c', '#fed7aa'),
    ...DARK_TIERS,
    ...darkTierInners,
    edge: darkEdge('#0a0205'),
  },
  neon: {
    ...darkBase('#fb923c', '#fb923c', '#fed7aa'),
    tier1: DARK_TIERS.tier1,
    tier1Edge: DARK_TIERS.tier1Edge,
    tier2: '#fb923c',
    tier3: DARK_TIERS.tier3,
    tier4: DARK_TIERS.tier4,
    tier5: DARK_TIERS.tier5,
    ...darkTierInners,
    edge: darkEdge('#000000'),
  },
};

export function flameVarsToCssProperties(
  vars: FlameThemeVars,
): Record<string, string> {
  return {
    '--flame-base': vars.base,
    '--flame-base-soft': vars.baseSoft,
    '--flame-base-inner': vars.baseInner,
    '--flame-tier-1': vars.tier1,
    '--flame-tier-1-edge': vars.tier1Edge,
    '--flame-tier-1-inner': vars.tier1Inner,
    '--flame-tier-2': vars.tier2,
    '--flame-tier-2-inner': vars.tier2Inner,
    '--flame-tier-3': vars.tier3,
    '--flame-tier-3-inner': vars.tier3Inner,
    '--flame-tier-4': vars.tier4,
    '--flame-tier-4-inner': vars.tier4Inner,
    '--flame-tier-5': vars.tier5,
    '--flame-tier-5-inner': vars.tier5Inner,
    '--flame-edge': vars.edge,
  };
}
