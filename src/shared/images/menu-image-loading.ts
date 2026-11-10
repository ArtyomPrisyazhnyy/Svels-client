/**
 * Column width of `.restaurant-menu__grid` inside `.restaurant-public__main`
 * (max-width 1200px, padding 24px / 16px under 640px).
 * 2 columns and 12px gap below 768px, 3 columns and 16px gap from 768px,
 * 4 columns from 1024px. Keep in sync with `menuCardSlotCssPx`.
 */
export const MENU_CARD_IMAGE_SIZES =
  '(min-width: 1024px) calc((min(100vw, 1200px) - 96px) / 4), (min-width: 768px) calc((min(100vw, 1200px) - 80px) / 3), (min-width: 641px) calc((100vw - 60px) / 2), calc((100vw - 44px) / 2)';

/** Elevated media is inset by 0.5rem on each side, so the photo is 16px narrower. */
export const MENU_CARD_ELEVATED_IMAGE_SIZES =
  '(min-width: 1024px) calc((min(100vw, 1200px) - 96px) / 4 - 16px), (min-width: 768px) calc((min(100vw, 1200px) - 80px) / 3 - 16px), (min-width: 641px) calc((100vw - 60px) / 2 - 16px), calc((100vw - 44px) / 2 - 16px)';

/** Magazine thumbs are a fixed 80px / 96px, not a grid column. */
export const MENU_MAGAZINE_IMAGE_SIZES = '(min-width: 640px) 96px, 80px';

/** Modal panel is full viewport below 768px and max 520px from there. Photo height stays 260px. */
export const MENU_MODAL_IMAGE_SIZES = '(min-width: 768px) 520px, 100vw';

/** Cart line thumb: --space-10 (40px) + --space-2 (8px). */
export const CART_LINE_IMAGE_SIZES = '48px';

/** Cart dock thumb: --space-10. */
export const CART_DOCK_IMAGE_SIZES = '40px';

/** Admin menu row thumb. */
export const MENU_ADMIN_THUMB_IMAGE_SIZES = '72px';

/** Cover preview in the menu item form (`max-width: 220px`). */
export const MENU_FORM_COVER_IMAGE_SIZES = '220px';

/**
 * Extra gallery thumbs use `minmax(96px, 1fr)`. On the admin form they land
 * around 100–130px, so 130px is the upper slot.
 */
export const MENU_FORM_GALLERY_IMAGE_SIZES = '130px';

export function menuCardImageSizes(cardStyle: string | undefined): string {
  if (cardStyle === 'magazine') {
    return MENU_MAGAZINE_IMAGE_SIZES;
  }
  if (cardStyle === 'elevated') {
    return MENU_CARD_ELEVATED_IMAGE_SIZES;
  }
  return MENU_CARD_IMAGE_SIZES;
}

/**
 * CSS pixel width of the photo box. Mirrors `menuCardImageSizes` so a preload
 * hits the same candidate the browser picks from srcset.
 */
export function menuCardSlotCssPx(viewportWidth: number, cardStyle: string | undefined): number {
  const width = Number.isFinite(viewportWidth) ? Math.max(0, viewportWidth) : 0;
  if (cardStyle === 'magazine') {
    return width >= 640 ? 96 : 80;
  }

  const content = Math.min(width, 1200);
  let column: number;
  if (width >= 1024) {
    column = (content - 96) / 4;
  } else if (width >= 768) {
    column = (content - 80) / 3;
  } else if (width >= 641) {
    column = (width - 60) / 2;
  } else {
    column = (width - 44) / 2;
  }

  if (cardStyle === 'elevated') {
    return Math.max(column - 16, 1);
  }
  return Math.max(column, 1);
}

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
