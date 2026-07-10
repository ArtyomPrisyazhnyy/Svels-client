import type { CSSProperties } from 'react';
import {
  DEFAULT_RESTAURANT_STYLING,
  type RestaurantColorTheme,
  type RestaurantFontFamily,
  type RestaurantStyling,
} from '@/shared/types/restaurant-styling';

const FONT_STACKS: Record<RestaurantFontFamily, string> = {
  system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  inter: 'var(--font-rs-inter), system-ui, sans-serif',
  georgia: 'Georgia, "Times New Roman", serif',
  montserrat: 'var(--font-rs-montserrat), system-ui, sans-serif',
  playfair: 'var(--font-rs-playfair), Georgia, serif',
  gothic60: '"Gothic №60", system-ui, sans-serif',
  marmelad: 'var(--font-rs-marmelad), system-ui, sans-serif',
  comfortaa: 'var(--font-rs-comfortaa), system-ui, sans-serif',
  comicRelief: 'var(--font-rs-comic-relief), "Comic Sans MS", system-ui, sans-serif',
  roboto: 'var(--font-rs-roboto), system-ui, sans-serif',
};

interface ThemeVars {
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
  onPrimary?: string;
  onAccent?: string;
}

const COLOR_THEMES: Record<RestaurantColorTheme, ThemeVars> = {
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
  },
};

export function getGoogleFontHref(_fontFamily: RestaurantFontFamily): string | null {
  // Шрифты теперь само-хостятся через next/font (см. fonts/restaurant-fonts.ts).
  // Функция оставлена для обратной совместимости, но более не используется.
  return null;
}

function resolveFontFamily(fontFamily: RestaurantStyling['fontFamily']): RestaurantFontFamily {
  if (fontFamily && fontFamily in FONT_STACKS) {
    return fontFamily;
  }

  return DEFAULT_RESTAURANT_STYLING.fontFamily;
}

function resolveColorTheme(colorTheme: RestaurantStyling['colorTheme']): RestaurantColorTheme {
  if (colorTheme && colorTheme in COLOR_THEMES) {
    return colorTheme;
  }

  return DEFAULT_RESTAURANT_STYLING.colorTheme;
}

export function buildRestaurantStylingVars(
  styling: Pick<RestaurantStyling, 'fontFamily' | 'colorTheme' | 'buttonShape'>,
): CSSProperties {
  const fontFamily = resolveFontFamily(styling.fontFamily);
  const colorTheme = resolveColorTheme(styling.colorTheme);
  const buttonShape = styling.buttonShape ?? DEFAULT_RESTAURANT_STYLING.buttonShape;
  const theme = COLOR_THEMES[colorTheme];

  return {
    ['--rs-font' as string]: FONT_STACKS[fontFamily],
    ['--rs-btn-radius' as string]: buttonShape === 'pill' ? '999px' : '0.625rem',
    ['--rs-bg' as string]: theme.bg,
    ['--rs-text' as string]: theme.text,
    ['--rs-text-muted' as string]: theme.textMuted,
    ['--rs-text-soft' as string]: theme.textSoft,
    ['--rs-accent' as string]: theme.accent,
    ['--rs-primary' as string]: theme.primary,
    ['--rs-primary-hover' as string]: theme.primaryHover,
    ['--rs-primary-soft' as string]: theme.primarySoft,
    ['--rs-border' as string]: theme.border,
    ['--rs-surface' as string]: theme.surface,
    ['--rs-on-primary' as string]: theme.onPrimary ?? '#ffffff',
    ['--rs-on-accent' as string]: theme.onAccent ?? '#ffffff',
  };
}

export function getFontStack(fontFamily: RestaurantFontFamily): string {
  return FONT_STACKS[fontFamily];
}

export function getRestaurantStylingDomProps(
  styling: Pick<
    RestaurantStyling,
    | 'buttonShape'
    | 'buttonVariant'
    | 'switcherStyle'
    | 'cardStyle'
    | 'magazineCardLayout'
    | 'menuCategoryNavEnabled'
    | 'headerStyle'
    | 'footerLayout'
    | 'footerAccent'
  >,
): Record<string, string> {
  return {
    'data-rs-button-shape': styling.buttonShape ?? DEFAULT_RESTAURANT_STYLING.buttonShape,
    'data-rs-button-variant': styling.buttonVariant ?? DEFAULT_RESTAURANT_STYLING.buttonVariant,
    'data-rs-switcher-style': styling.switcherStyle ?? DEFAULT_RESTAURANT_STYLING.switcherStyle,
    'data-rs-card-style': styling.cardStyle ?? DEFAULT_RESTAURANT_STYLING.cardStyle,
    'data-rs-magazine-layout':
      styling.magazineCardLayout ?? DEFAULT_RESTAURANT_STYLING.magazineCardLayout,
    'data-rs-menu-category-nav':
      (styling.menuCategoryNavEnabled ?? DEFAULT_RESTAURANT_STYLING.menuCategoryNavEnabled)
        ? 'true'
        : 'false',
    'data-rs-header-style': styling.headerStyle ?? DEFAULT_RESTAURANT_STYLING.headerStyle,
    'data-rs-footer-layout': styling.footerLayout ?? DEFAULT_RESTAURANT_STYLING.footerLayout,
    'data-rs-footer-accent': styling.footerAccent ?? DEFAULT_RESTAURANT_STYLING.footerAccent,
  };
}
