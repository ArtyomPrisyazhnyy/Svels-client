import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';
import { RESTAURANT_COLOR_THEME_OPTIONS } from '../../src/shared/types/restaurant-styling';

export const ALL_COLOR_THEMES: RestaurantColorTheme[] = RESTAURANT_COLOR_THEME_OPTIONS.map(
  (option) => option.value,
);
