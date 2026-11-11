/**
 * Column width of `.restaurant-menu__grid` inside `.restaurant-public__main`
 * (max-width 1200px, padding 24px / 16px under 640px, gaps 12px / 16px).
 */
export const MENU_CARD_IMAGE_SIZES =
  '(min-width: 1024px) 276px, (min-width: 768px) calc((min(100vw, 1200px) - 80px) / 3), (min-width: 641px) calc((100vw - 60px) / 2), calc((100vw - 44px) / 2)';

/** Magazine thumbs are a fixed 80px / 96px, not a grid column. */
export const MENU_MAGAZINE_IMAGE_SIZES = '(min-width: 640px) 96px, 80px';

/** Modal panel is the viewport below 768px and at most 520px from there. */
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
 * CSS-ширина слота, совпадающая с `sizes` карточки.
 * Нужна, чтобы прелоад попал в тот же файл, который выберет srcset.
 */
export function menuCardSlotCssPx(viewportWidth: number, cardStyle: string | undefined): number {
  const width = Number.isFinite(viewportWidth) ? Math.max(0, viewportWidth) : 0;
  if (cardStyle === 'magazine') {
    return width >= 640 ? 96 : 80;
  }
  if (width >= 1024) {
    return 276;
  }
  if (width >= 768) {
    return (Math.min(width, 1200) - 80) / 3;
  }
  if (width >= 641) {
    return (width - 60) / 2;
  }
  return Math.max((width - 44) / 2, 1);
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
