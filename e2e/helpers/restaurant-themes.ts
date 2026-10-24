import { ALL_RESTAURANT_COLOR_THEMES } from '../../src/shared/design-tokens/color-themes';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';

/** Every theme from `color-themes.ts` — used by axe contrast and WCAG unit tests. */
export const E2E_RESTAURANT_COLOR_THEMES: RestaurantColorTheme[] =
  ALL_RESTAURANT_COLOR_THEMES as RestaurantColorTheme[];

/** Subset with committed Playwright visual baselines for error playground. */
export const E2E_ERROR_VISUAL_THEMES: RestaurantColorTheme[] = [
  'classic',
  'midnight',
  'neon',
  'citrus',
];
