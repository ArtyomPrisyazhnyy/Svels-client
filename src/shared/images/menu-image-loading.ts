/**
 * Column width of `.restaurant-menu__grid` inside `.restaurant-public__main`
 * (max-width 1200px, padding 24px / 16px under 640px, gaps 12px / 16px).
 */
export const MENU_CARD_IMAGE_SIZES =
  '(min-width: 1024px) 276px, (min-width: 768px) calc((min(100vw, 1200px) - 80px) / 3), (min-width: 641px) calc((100vw - 60px) / 2), calc((100vw - 44px) / 2)';

/** Magazine thumbs are a fixed 80px / 96px, not a grid column. */
export const MENU_MAGAZINE_IMAGE_SIZES = '(min-width: 640px) 96px, 80px';

/** Mobile-first row: 2 columns. Magazine is a single column until 720px. */
export function eagerMenuImageCount(cardStyle: string | undefined): number {
  return cardStyle === 'magazine' ? 1 : 2;
}

export function menuImageLoading(index: number, eagerCount: number): 'eager' | 'lazy' {
  return index < eagerCount ? 'eager' : 'lazy';
}

/**
 * The promo strip is the LCP element when it exists, so menu photos stay low
 * priority. Without a strip, the first card can be the LCP image.
 */
export function menuImageFetchPriority(
  index: number,
  deferToBanner: boolean,
): 'high' | 'low' {
  if (deferToBanner || index > 0) {
    return 'low';
  }
  return 'high';
}
