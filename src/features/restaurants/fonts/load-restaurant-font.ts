import type { RestaurantFontFamily } from '@/shared/types/restaurant-styling';
import { DEFAULT_RESTAURANT_STYLING } from '@/shared/types/restaurant-styling';

const SYSTEM_FONTS = new Set<RestaurantFontFamily>(['system', 'georgia', 'gothic60']);

function resolveFontFamily(fontFamily: RestaurantFontFamily | undefined): RestaurantFontFamily {
  if (fontFamily && !SYSTEM_FONTS.has(fontFamily)) {
    return fontFamily;
  }
  return DEFAULT_RESTAURANT_STYLING.fontFamily;
}

/** Loads a single next/font pack for the active venue font (code-split per family). */
export async function loadRestaurantFontVariableClass(
  fontFamily: RestaurantFontFamily | undefined,
): Promise<string> {
  const resolved = resolveFontFamily(fontFamily);
  if (SYSTEM_FONTS.has(resolved)) {
    return '';
  }

  switch (resolved) {
    case 'inter':
      return (await import('./packs/inter')).restaurantInter.variable;
    case 'montserrat':
      return (await import('./packs/montserrat')).restaurantMontserrat.variable;
    case 'playfair':
      return (await import('./packs/playfair')).restaurantPlayfair.variable;
    case 'marmelad':
      return (await import('./packs/marmelad')).restaurantMarmelad.variable;
    case 'comfortaa':
      return (await import('./packs/comfortaa')).restaurantComfortaa.variable;
    case 'comicRelief':
      return (await import('./packs/comic-relief')).restaurantComicRelief.variable;
    case 'roboto':
      return (await import('./packs/roboto')).restaurantRoboto.variable;
    case 'tektur':
      return (await import('./packs/tektur')).restaurantTektur.variable;
    case 'play':
      return (await import('./packs/play')).restaurantPlay.variable;
    default:
      return (await import('./packs/inter')).restaurantInter.variable;
  }
}
