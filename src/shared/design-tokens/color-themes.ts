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
  surface: string;
  danger?: string;
  disabledText?: string;
  onPrimary?: string;
  onAccent?: string;
}

const BORDER_CANDIDATES = [
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

function resolveBorderColor(theme: ThemeColorTokens): string {
  for (const candidate of BORDER_CANDIDATES) {
    if (
      contrastRatio(candidate, theme.bg) >= 3 &&
      contrastRatio(candidate, theme.surface) >= 3
    ) {
      return candidate;
    }
  }
  return BORDER_CANDIDATES[0];
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

function finalizeTheme(theme: ThemeColorTokens): ThemeColorTokens {
  const border = resolveBorderColor(theme);
  const danger = resolveDangerColor(theme);
  const disabledText = resolveDisabledText(theme);

  return {
    ...theme,
    border,
    danger,
    disabledText,
  };
}

const RAW_RESTAURANT_COLOR_THEME_TOKENS: Record<RestaurantColorTheme, ThemeColorTokens> = {
  classic: {
    bg: '#f8fafc',
    text: '#0f172a',
    textMuted: '#64748b',
    textSoft: '#64748b',
    accent: '#0f766e',
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primarySoft: '#eff6ff',
    border: '#94a3b8',
    surface: '#ffffff',
  },
  ocean: {
    bg: '#f0f9ff',
    text: '#0c4a6e',
    textMuted: '#0369a1',
    textSoft: '#0369a1',
    accent: '#0369a1',
    primary: '#0284c7',
    primaryHover: '#0369a1',
    primarySoft: '#e0f2fe',
    border: '#7dd3fc',
    surface: '#ffffff',
  },
  forest: {
    bg: '#f0fdf4',
    text: '#14532d',
    textMuted: '#166534',
    textSoft: '#166534',
    accent: '#15803d',
    primary: '#16a34a',
    primaryHover: '#15803d',
    primarySoft: '#dcfce7',
    border: '#86efac',
    surface: '#ffffff',
  },
  warm: {
    bg: '#fff7ed',
    text: '#7c2d12',
    textMuted: '#9a3412',
    textSoft: '#9a3412',
    accent: '#c2410c',
    primary: '#ea580c',
    primaryHover: '#c2410c',
    primarySoft: '#ffedd5',
    border: '#fdba74',
    surface: '#ffffff',
  },
  berry: {
    bg: '#fff1f2',
    text: '#881337',
    textMuted: '#be123c',
    textSoft: '#be123c',
    accent: '#be123c',
    primary: '#e11d48',
    primaryHover: '#be123c',
    primarySoft: '#ffe4e6',
    border: '#fda4af',
    surface: '#ffffff',
  },
  lavender: {
    bg: '#faf5ff',
    text: '#581c87',
    textMuted: '#7e22ce',
    textSoft: '#7e22ce',
    accent: '#7c3aed',
    primary: '#8b5cf6',
    primaryHover: '#7c3aed',
    primarySoft: '#ede9fe',
    border: '#c4b5fd',
    surface: '#ffffff',
  },
  midnight: {
    bg: '#0f172a',
    text: '#f8fafc',
    textMuted: '#cbd5e1',
    textSoft: '#94a3b8',
    accent: '#38bdf8',
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primarySoft: '#1e293b',
    border: '#64748b',
    surface: '#1e293b',
  },
  ember: {
    bg: '#1c1917',
    text: '#fafaf9',
    textMuted: '#d6d3d1',
    textSoft: '#a8a29e',
    accent: '#fb923c',
    primary: '#ea580c',
    primaryHover: '#c2410c',
    primarySoft: '#292524',
    border: '#78716c',
    surface: '#292524',
  },
  obsidian: {
    bg: '#09090b',
    text: '#fafafa',
    textMuted: '#d4d4d8',
    textSoft: '#a1a1aa',
    accent: '#a78bfa',
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
    primarySoft: '#18181b',
    border: '#71717a',
    surface: '#18181b',
  },
  moss: {
    bg: '#052e16',
    text: '#ecfdf5',
    textMuted: '#bbf7d0',
    textSoft: '#86efac',
    accent: '#34d399',
    primary: '#059669',
    primaryHover: '#047857',
    primarySoft: '#064e3b',
    border: '#4ade80',
    surface: '#064e3b',
  },
  wine: {
    bg: '#1a0a0f',
    text: '#fdf2f8',
    textMuted: '#fbcfe8',
    textSoft: '#f9a8d4',
    accent: '#fb7185',
    primary: '#e11d48',
    primaryHover: '#be123c',
    primarySoft: '#2d0a14',
    border: '#f472b6',
    surface: '#2d0a14',
  },
  sand: {
    bg: '#faf8f5',
    text: '#44403c',
    textMuted: '#57534e',
    textSoft: '#78716c',
    accent: '#92400e',
    primary: '#b45309',
    primaryHover: '#92400e',
    primarySoft: '#fef3c7',
    border: '#a8a29e',
    surface: '#ffffff',
  },
  citrus: {
    bg: '#fefce8',
    text: '#713f12',
    textMuted: '#854d0e',
    textSoft: '#a16207',
    accent: '#a16207',
    primary: '#ca8a04',
    primaryHover: '#a16207',
    primarySoft: '#fef9c3',
    border: '#ca8a04',
    surface: '#ffffff',
  },
  graphite: {
    bg: '#f4f4f5',
    text: '#18181b',
    textMuted: '#3f3f46',
    textSoft: '#52525b',
    accent: '#3f3f46',
    primary: '#27272a',
    primaryHover: '#18181b',
    primarySoft: '#e4e4e7',
    border: '#71717a',
    surface: '#ffffff',
  },
  monochrome: {
    bg: '#ffffff',
    text: '#0a0a0a',
    textMuted: '#404040',
    textSoft: '#525252',
    accent: '#0a0a0a',
    primary: '#000000',
    primaryHover: '#171717',
    primarySoft: '#f5f5f5',
    border: '#737373',
    surface: '#ffffff',
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
    border: '#a3a3a3',
    surface: '#141414',
    onPrimary: '#000000',
    onAccent: '#000000',
  },
  neon: {
    bg: '#06040a',
    text: '#fdf2f8',
    textMuted: '#fbcfe8',
    textSoft: '#f9a8d4',
    accent: '#ff3d8b',
    primary: '#db2777',
    primaryHover: '#be185d',
    primarySoft: '#1f0814',
    border: '#f472b6',
    surface: '#120818',
  },
};

export const RESTAURANT_COLOR_THEME_TOKENS = Object.fromEntries(
  Object.entries(RAW_RESTAURANT_COLOR_THEME_TOKENS).map(([name, theme]) => [
    name,
    finalizeTheme(theme),
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
  const danger = theme.danger ?? '#dc2626';

  return {
    onPrimary: theme.onPrimary ?? pickOnColor(theme.primary, 3),
    onAccent: theme.onAccent ?? pickOnColor(theme.accent, 3),
    onDanger: pickOnColor(danger, 3),
  };
}
