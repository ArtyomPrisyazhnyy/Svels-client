import type { RestaurantColorTheme } from '@/shared/types/restaurant-styling';

export interface FlameThemeVars {
  base: string;
  /** Для CSS-токенов; paint base не использует baseSoft. */
  baseSoft: string;
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

function baseBlock(
  base: string,
  softHex: string,
  softAlpha: number,
): Pick<FlameThemeVars, 'base' | 'baseSoft'> {
  const percent = Math.round(softAlpha * 100);
  return {
    base,
    baseSoft: `color-mix(in srgb, ${softHex} ${percent}%, transparent)`,
  };
}

/** Палитры огонька под фон страницы/шапки (`--rs-bg`). Alphas — как в Svels-mobile. */
export const FLAME_THEME_VARS: Record<RestaurantColorTheme, FlameThemeVars> = {
  classic: {
    ...baseBlock('#d97706', '#f59e0b', 0.42),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#0f172a'),
  },
  ocean: {
    ...baseBlock('#c2410c', '#ea580c', 0.4),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#0c4a6e'),
  },
  forest: {
    ...baseBlock('#b45309', '#d97706', 0.38),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#14532d'),
  },
  warm: {
    ...baseBlock('#9a3412', '#c2410c', 0.36),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#7c2d12'),
  },
  berry: {
    ...baseBlock('#c2410c', '#ea580c', 0.38),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#881337'),
  },
  lavender: {
    ...baseBlock('#c2410c', '#ea580c', 0.36),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#581c87'),
  },
  sand: {
    ...baseBlock('#b45309', '#d97706', 0.4),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#44403c'),
  },
  citrus: {
    ...baseBlock('#b45309', '#d97706', 0.34),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#713f12'),
  },
  graphite: {
    ...baseBlock('#b45309', '#d97706', 0.4),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#18181b'),
  },
  monochrome: {
    ...baseBlock('#c2410c', '#ea580c', 0.58),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#0a0a0a'),
  },
  monochromeDark: {
    ...baseBlock('#fbbf24', '#fbbf24', 0.32),
    ...DARK_TIERS,
    ...darkTierInners,
    edge: darkEdge('#000000'),
  },
  midnight: {
    ...baseBlock('#fb923c', '#fb923c', 0.38),
    ...DARK_TIERS,
    ...darkTierInners,
    edge: darkEdge('#020617'),
  },
  ember: {
    ...baseBlock('#fb923c', '#fb923c', 0.36),
    ...DARK_TIERS,
    ...darkTierInners,
    edge: darkEdge('#0c0a09'),
  },
  obsidian: {
    ...baseBlock('#fb923c', '#fb923c', 0.34),
    ...DARK_TIERS,
    ...darkTierInners,
    edge: darkEdge('#000000'),
  },
  moss: {
    ...baseBlock('#fb923c', '#fb923c', 0.34),
    ...DARK_TIERS,
    ...darkTierInners,
    edge: darkEdge('#022c15'),
  },
  wine: {
    ...baseBlock('#fb923c', '#fb923c', 0.34),
    ...DARK_TIERS,
    ...darkTierInners,
    edge: darkEdge('#0a0205'),
  },
  neon: {
    ...baseBlock('#fb923c', '#fb923c', 0.32),
    tier1: DARK_TIERS.tier1,
    tier1Edge: DARK_TIERS.tier1Edge,
    tier2: '#fb923c',
    tier3: DARK_TIERS.tier3,
    tier4: DARK_TIERS.tier4,
    tier5: DARK_TIERS.tier5,
    ...darkTierInners,
    edge: darkEdge('#000000'),
  },
  svelsGuest: {
    ...baseBlock('#c2410c', '#ea580c', 0.4),
    ...LIGHT_TIERS,
    ...lightTierInners,
    edge: lightEdge('#0b1a18'),
  },
};

export function flameVarsToCssProperties(
  vars: FlameThemeVars,
): Record<string, string> {
  return {
    '--flame-base': vars.base,
    '--flame-base-soft': vars.baseSoft,
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
