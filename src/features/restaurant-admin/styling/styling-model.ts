import {
  createDefaultRestaurantStyling,
  RESTAURANT_COLOR_THEME_OPTIONS,
  type RestaurantColorTheme,
  type RestaurantStyling,
  type UpdateRestaurantStylingPayload,
} from '@/shared/types/restaurant-styling';

export type StylingLayoutId = 'studio' | 'canvas' | 'inspector';

export const STYLING_LAYOUTS: Array<{ value: StylingLayoutId; label: string }> = [
  { value: 'studio', label: 'Студия' },
  { value: 'canvas', label: 'Холст' },
  { value: 'inspector', label: 'Инспектор' },
];

export function isStylingLayoutId(value: string | undefined): value is StylingLayoutId {
  return value === 'studio' || value === 'canvas' || value === 'inspector';
}

export function resolvePlaygroundTheme(theme: string | undefined): RestaurantColorTheme {
  if (theme && RESTAURANT_COLOR_THEME_OPTIONS.some((option) => option.value === theme)) {
    return theme as RestaurantColorTheme;
  }
  return 'classic';
}

export function resolvePlaygroundLayout(layout: string | undefined): StylingLayoutId {
  return isStylingLayoutId(layout) ? layout : 'studio';
}

export function normalizeStyling(data: RestaurantStyling): RestaurantStyling {
  const defaults = createDefaultRestaurantStyling(data.restaurantId);
  return {
    ...defaults,
    ...data,
    favoritesEnabled: data.favoritesEnabled !== false,
    magazineCardLayout: data.magazineCardLayout ?? defaults.magazineCardLayout,
    menuCategoryNavEnabled: Boolean(data.menuCategoryNavEnabled),
  };
}

export function toStylingPayload(styling: RestaurantStyling): UpdateRestaurantStylingPayload {
  return {
    fontFamily: styling.fontFamily,
    colorTheme: styling.colorTheme,
    currencyDisplay: styling.currencyDisplay,
    buttonShape: styling.buttonShape,
    buttonVariant: styling.buttonVariant,
    switcherStyle: styling.switcherStyle,
    cardStyle: styling.cardStyle,
    magazineCardLayout: styling.magazineCardLayout,
    menuCategoryNavEnabled: styling.menuCategoryNavEnabled,
    favoritesEnabled: styling.favoritesEnabled,
    headerStyle: styling.headerStyle,
    footerLayout: styling.footerLayout,
    footerAccent: styling.footerAccent,
  };
}

export function stylingEquals(left: RestaurantStyling, right: RestaurantStyling): boolean {
  const a = toStylingPayload(left);
  const b = toStylingPayload(right);
  return (Object.keys(a) as Array<keyof UpdateRestaurantStylingPayload>).every(
    (key) => a[key] === b[key],
  );
}
