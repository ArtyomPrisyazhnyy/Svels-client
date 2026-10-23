import type { RestaurantColorTheme } from '@/shared/types/restaurant-styling';
import { blendOver, contrastRatio, pickOnColor } from '@/shared/design-tokens/wcag-contrast';

export interface ThemeColorTokens {
  bg: string;
  text: string;
  textMuted: string;
  textSoft: string;
  accent: string;
  primary: string;
  primaryHover: string;
  primarySoft: string;
  border: string;
  inputBorder: string;
  surface: string;
  danger?: string;
  disabledText?: string;
  onPrimary?: string;
  onAccent?: string;
}

const INPUT_BORDER_CANDIDATES = [
  '#334155',
  '#475569',
  '#64748b',
  '#6b7280',
  '#737373',
  '#94a3b8',
] as const;

const DANGER_CANDIDATES = [
  '#b91c1c',
  '#dc2626',
  '#ef4444',
  '#f87171',
  '#fca5a5',
  '#fecaca',
  '#ffe4e6',
] as const;

const TEXT_SOFT_OVERRIDES: Partial<Record<RestaurantColorTheme, string>> = {
  citrus: '#a16207',
  ocean: '#0369a1',
  forest: '#166534',
  warm: '#9a3412',
  berry: '#be123c',
  lavender: '#7e22ce',
};

const ACCENT_OVERRIDES: Partial<Record<RestaurantColorTheme, string>> = {
  citrus: '#a16207',
};

function resolveInputBorderColor(theme: ThemeColorTokens): string {
  for (const candidate of INPUT_BORDER_CANDIDATES) {
    if (contrastRatio(candidate, theme.surface) >= 3) {
      return candidate;
    }
  }
  return INPUT_BORDER_CANDIDATES[0];
}

function resolveDangerColor(theme: ThemeColorTokens): string {
  for (const candidate of DANGER_CANDIDATES) {
    if (contrastRatio(candidate, theme.surface) >= 4.5) {
      return candidate;
    }
  }
  return DANGER_CANDIDATES[DANGER_CANDIDATES.length - 1];
}

function resolveDisabledText(theme: ThemeColorTokens): string {
  for (const alpha of [0.62, 0.58, 0.55, 0.5, 0.45, 0.4]) {
    const color = blendOver(theme.surface, theme.text, alpha);
    if (contrastRatio(color, theme.surface) >= 3) {
      return color;
    }
  }
  return theme.textMuted;
}

function resolveTextSoft(themeName: RestaurantColorTheme, theme: ThemeColorTokens): string {
  const base = TEXT_SOFT_OVERRIDES[themeName] ?? theme.textSoft;
  if (
    contrastRatio(base, theme.bg) >= 4.5 &&
    contrastRatio(base, theme.surface) >= 4.5
  ) {
    return base;
  }
  return theme.textMuted;
}

function finalizeTheme(themeName: RestaurantColorTheme, theme: ThemeColorTokens): ThemeColorTokens {
  const textSoft = resolveTextSoft(themeName, theme);
  const accent = ACCENT_OVERRIDES[themeName] ?? theme.accent;
  const withSoft = { ...theme, textSoft, accent };
  return {
    ...withSoft,
    inputBorder: resolveInputBorderColor(withSoft),
    danger: resolveDangerColor(withSoft),
    disabledText: resolveDisabledText(withSoft),
  };
}

const RAW_RESTAURANT_COLOR_THEME_TOKENS: Record<RestaurantColorTheme, ThemeColorTokens> = {
  classic: {
    bg: '#f8fafc',
    text: '#0f172a',
    textMuted: '#64748b',
    textSoft: '#94a3b8',
    accent: '#0f766e',
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primarySoft: '#eff6ff',
    border: '#e2e8f0',
    surface: '#ffffff',
    inputBorder: '#e2e8f0',
  },
  ocean: {
    bg: '#f0f9ff',
    text: '#0c4a6e',
    textMuted: '#0369a1',
    textSoft: '#7dd3fc',
    accent: '#0369a1',
    primary: '#0284c7',
    primaryHover: '#0369a1',
    primarySoft: '#e0f2fe',
    border: '#bae6fd',
    surface: '#ffffff',
    inputBorder: '#bae6fd',
  },
  forest: {
    bg: '#f0fdf4',
    text: '#14532d',
    textMuted: '#166534',
    textSoft: '#86efac',
    accent: '#15803d',
    primary: '#16a34a',
    primaryHover: '#15803d',
    primarySoft: '#dcfce7',
    border: '#bbf7d0',
    surface: '#ffffff',
    inputBorder: '#bbf7d0',
  },
  warm: {
    bg: '#fff7ed',
    text: '#7c2d12',
    textMuted: '#9a3412',
    textSoft: '#fdba74',
    accent: '#c2410c',
    primary: '#ea580c',
    primaryHover: '#c2410c',
    primarySoft: '#ffedd5',
    border: '#fed7aa',
    surface: '#ffffff',
    inputBorder: '#fed7aa',
  },
  berry: {
    bg: '#fff1f2',
    text: '#881337',
    textMuted: '#be123c',
    textSoft: '#fda4af',
    accent: '#be123c',
    primary: '#e11d48',
    primaryHover: '#be123c',
    primarySoft: '#ffe4e6',
    border: '#fecdd3',
    surface: '#ffffff',
    inputBorder: '#fecdd3',
  },
  lavender: {
    bg: '#faf5ff',
    text: '#581c87',
    textMuted: '#7e22ce',
    textSoft: '#c4b5fd',
    accent: '#7c3aed',
    primary: '#8b5cf6',
    primaryHover: '#7c3aed',
    primarySoft: '#ede9fe',
    border: '#ddd6fe',
    surface: '#ffffff',
    inputBorder: '#ddd6fe',
  },
  midnight: {
    bg: '#0f172a',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    textSoft: '#64748b',
    accent: '#38bdf8',
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    primarySoft: '#1e293b',
    border: '#334155',
    surface: '#1e293b',
    inputBorder: '#334155',
  },
  ember: {
    bg: '#1c1917',
    text: '#fafaf9',
    textMuted: '#a8a29e',
    textSoft: '#78716c',
    accent: '#fb923c',
    primary: '#f97316',
    primaryHover: '#ea580c',
    primarySoft: '#292524',
    border: '#44403c',
    surface: '#292524',
    inputBorder: '#44403c',
  },
  obsidian: {
    bg: '#09090b',
    text: '#fafafa',
    textMuted: '#a1a1aa',
    textSoft: '#71717a',
    accent: '#a78bfa',
    primary: '#8b5cf6',
    primaryHover: '#7c3aed',
    primarySoft: '#18181b',
    border: '#3f3f46',
    surface: '#18181b',
    inputBorder: '#3f3f46',
  },
  moss: {
    bg: '#052e16',
    text: '#ecfdf5',
    textMuted: '#86efac',
    textSoft: '#4ade80',
    accent: '#34d399',
    primary: '#10b981',
    primaryHover: '#059669',
    primarySoft: '#064e3b',
    border: '#166534',
    surface: '#064e3b',
    inputBorder: '#166534',
  },
  wine: {
    bg: '#1a0a0f',
    text: '#fdf2f8',
    textMuted: '#f9a8d4',
    textSoft: '#f472b6',
    accent: '#fb7185',
    primary: '#f43f5e',
    primaryHover: '#e11d48',
    primarySoft: '#2d0a14',
    border: '#4c0519',
    surface: '#2d0a14',
    inputBorder: '#4c0519',
  },
  sand: {
    bg: '#faf8f5',
    text: '#44403c',
    textMuted: '#78716c',
    textSoft: '#a8a29e',
    accent: '#92400e',
    primary: '#b45309',
    primaryHover: '#92400e',
    primarySoft: '#fef3c7',
    border: '#e7e5e4',
    surface: '#ffffff',
    inputBorder: '#e7e5e4',
  },
  citrus: {
    bg: '#fefce8',
    text: '#713f12',
    textMuted: '#a16207',
    textSoft: '#fde047',
    accent: '#ca8a04',
    primary: '#eab308',
    primaryHover: '#ca8a04',
    primarySoft: '#fef9c3',
    border: '#fde68a',
    surface: '#ffffff',
    inputBorder: '#fde68a',
  },
  graphite: {
    bg: '#f4f4f5',
    text: '#18181b',
    textMuted: '#52525b',
    textSoft: '#a1a1aa',
    accent: '#52525b',
    primary: '#3f3f46',
    primaryHover: '#27272a',
    primarySoft: '#e4e4e7',
    border: '#d4d4d8',
    surface: '#ffffff',
    inputBorder: '#d4d4d8',
  },
  monochrome: {
    bg: '#ffffff',
    text: '#0a0a0a',
    textMuted: '#404040',
    textSoft: '#737373',
    accent: '#0a0a0a',
    primary: '#000000',
    primaryHover: '#171717',
    primarySoft: '#f5f5f5',
    border: '#e5e5e5',
    surface: '#ffffff',
    inputBorder: '#e5e5e5',
  },
  monochromeDark: {
    bg: '#000000',
    text: '#ffffff',
    textMuted: '#d4d4d4',
    textSoft: '#a3a3a3',
    accent: '#ffffff',
    primary: '#ffffff',
    primaryHover: '#e5e5e5',
    primarySoft: '#262626',
    border: '#333333',
    surface: '#141414',
    onPrimary: '#000000',
    onAccent: '#000000',
    inputBorder: '#333333',
  },
  neon: {
    bg: '#06040a',
    text: '#fdf2f8',
    textMuted: '#f9a8d4',
    textSoft: '#9d174d',
    accent: '#ff3d8b',
    primary: '#ec4899',
    primaryHover: '#db2777',
    primarySoft: '#1f0814',
    border: '#4a0e2e',
    surface: '#120818',
    inputBorder: '#4a0e2e',
  },
};

export const RESTAURANT_COLOR_THEME_TOKENS = Object.fromEntries(
  Object.entries(RAW_RESTAURANT_COLOR_THEME_TOKENS).map(([name, theme]) => [
    name,
    finalizeTheme(name as RestaurantColorTheme, theme),
  ]),
) as Record<RestaurantColorTheme, ThemeColorTokens>;

export const ALL_RESTAURANT_COLOR_THEMES = Object.keys(
  RESTAURANT_COLOR_THEME_TOKENS,
) as RestaurantColorTheme[];

export const GLOBAL_SEMANTIC_TOKENS = {
  danger: '#dc2626',
  onDanger: '#ffffff',
} as const;

export function resolveThemeOnColors(theme: ThemeColorTokens): {
  onPrimary: string;
  onAccent: string;
  onDanger: string;
} {
  const danger = theme.danger ?? GLOBAL_SEMANTIC_TOKENS.danger;
  const preferredPrimary = theme.onPrimary ?? '#ffffff';
  const preferredAccent = theme.onAccent ?? '#ffffff';

  return {
    onPrimary: pickOnColor(theme.primary, 3, preferredPrimary),
    onAccent: pickOnColor(theme.accent, 3, preferredAccent),
    onDanger: pickOnColor(danger, 3, GLOBAL_SEMANTIC_TOKENS.onDanger),
  };
}

export const THEME_TOKEN_CHANGE_BASELINE: Record<RestaurantColorTheme, ThemeColorTokens> =
  RAW_RESTAURANT_COLOR_THEME_TOKENS;
