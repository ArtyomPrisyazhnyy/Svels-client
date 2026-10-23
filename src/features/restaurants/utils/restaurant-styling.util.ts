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
  tektur: 'var(--font-rs-tektur), system-ui, sans-serif',
  play: 'var(--font-rs-play), system-ui, sans-serif',
};

import {
  RESTAURANT_COLOR_THEME_TOKENS,
  resolveThemeOnColors,
} from '@/shared/design-tokens/color-themes';

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
  if (colorTheme && colorTheme in RESTAURANT_COLOR_THEME_TOKENS) {
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
  const theme = RESTAURANT_COLOR_THEME_TOKENS[colorTheme];
  const { onPrimary, onAccent, onDanger } = resolveThemeOnColors(theme);

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
    ['--rs-danger' as string]: theme.danger ?? '#dc2626',
    ['--rs-on-danger' as string]: onDanger,
    ['--rs-on-primary' as string]: onPrimary,
    ['--rs-on-accent' as string]: onAccent,
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
