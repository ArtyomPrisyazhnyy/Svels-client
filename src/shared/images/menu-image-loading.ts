/**
 * Borderless column of `.restaurant-menu__grid` inside `.restaurant-public__main`
 * (max-width 1200px, padding 24px / 16px under 640px, gaps 12px / 16px).
 * 2 columns below 768px, 3 from 768px, 4 from 1024px.
 * Overlay and minimal drop the side border, so the photo is this wide.
 */
export const MENU_COLUMN_IMAGE_SIZES =
  '(min-width: 1024px) calc((min(100vw, 1200px) - 96px) / 4), (min-width: 768px) calc((min(100vw, 1200px) - 80px) / 3), (min-width: 641px) calc((100vw - 60px) / 2), calc((100vw - 44px) / 2)';

/** Classic and glass keep the 1px card border, so the photo is 2px narrower. */
export const MENU_CARD_IMAGE_SIZES =
  '(min-width: 1024px) calc((min(100vw, 1200px) - 96px) / 4 - 2px), (min-width: 768px) calc((min(100vw, 1200px) - 80px) / 3 - 2px), (min-width: 641px) calc((100vw - 60px) / 2 - 2px), calc((100vw - 44px) / 2 - 2px)';

/** Elevated media is inset by 0.5rem on each side, on top of the 1px border. */
export const MENU_CARD_ELEVATED_IMAGE_SIZES =
  '(min-width: 1024px) calc((min(100vw, 1200px) - 96px) / 4 - 18px), (min-width: 768px) calc((min(100vw, 1200px) - 80px) / 3 - 18px), (min-width: 641px) calc((100vw - 60px) / 2 - 18px), calc((100vw - 44px) / 2 - 18px)';

/** Magazine thumbs are a fixed 80px / 96px, not a grid column. */
export const MENU_MAGAZINE_IMAGE_SIZES = '(min-width: 640px) 96px, 80px';

/**
 * Styling-admin preview is one card in a side column, not the public grid.
 * Widths below are the measured photo box: sidebar 200px from 769px,
 * preview column 0.4 of the content from 1101px, paddings and 1px borders.
 */
const STYLING_PREVIEW_IMAGE_SIZES =
  '(min-width: 1101px) calc((100vw - 268px) * 0.4 - 78px), (min-width: 769px) calc(100vw - 326px), calc(100vw - 126px)';

const STYLING_PREVIEW_ELEVATED_IMAGE_SIZES =
  '(min-width: 1101px) calc((100vw - 268px) * 0.4 - 94px), (min-width: 769px) calc(100vw - 342px), calc(100vw - 142px)';

const STYLING_PREVIEW_BORDERLESS_IMAGE_SIZES =
  '(min-width: 1101px) calc((100vw - 268px) * 0.4 - 76px), (min-width: 769px) calc(100vw - 324px), calc(100vw - 124px)';

/** Modal panel is the viewport below 768px and at most 520px from there. */
export const MENU_MODAL_IMAGE_SIZES = '(min-width: 768px) 520px, 100vw';

/** Cart line thumb: 48px box minus the 1px border on each side. */
export const CART_LINE_IMAGE_SIZES = '46px';

/** Cart dock thumb: --space-10. */
export const CART_DOCK_IMAGE_SIZES = '40px';

/** Admin menu row thumb. */
export const MENU_ADMIN_THUMB_IMAGE_SIZES = '72px';

/** Cover preview in the menu item form (`max-width: 220px`). */
export const MENU_FORM_COVER_IMAGE_SIZES = '220px';

/** Side border and elevated inset, in CSS pixels. Magazine is not a column. */
export function menuCardImageInsetPx(cardStyle: string | undefined): number {
  if (cardStyle === 'overlay' || cardStyle === 'minimal') {
    return 0;
  }
  if (cardStyle === 'elevated') {
    return 18;
  }
  return 2;
}

export function menuCardImageSizes(cardStyle: string | undefined): string {
  if (cardStyle === 'magazine') {
    return MENU_MAGAZINE_IMAGE_SIZES;
  }
  if (cardStyle === 'elevated') {
    return MENU_CARD_ELEVATED_IMAGE_SIZES;
  }
  if (cardStyle === 'overlay' || cardStyle === 'minimal') {
    return MENU_COLUMN_IMAGE_SIZES;
  }
  return MENU_CARD_IMAGE_SIZES;
}

export function stylingPreviewImageSizes(cardStyle: string | undefined): string {
  if (cardStyle === 'magazine') {
    return MENU_MAGAZINE_IMAGE_SIZES;
  }
  if (cardStyle === 'elevated') {
    return STYLING_PREVIEW_ELEVATED_IMAGE_SIZES;
  }
  if (cardStyle === 'overlay' || cardStyle === 'minimal') {
    return STYLING_PREVIEW_BORDERLESS_IMAGE_SIZES;
  }
  return STYLING_PREVIEW_IMAGE_SIZES;
}

function menuColumnCssPx(viewportWidth: number): number {
  const width = Number.isFinite(viewportWidth) ? Math.max(0, viewportWidth) : 0;
  if (width >= 1024) {
    return (Math.min(width, 1200) - 96) / 4;
  }
  if (width >= 768) {
    return (Math.min(width, 1200) - 80) / 3;
  }
  if (width >= 641) {
    return (width - 60) / 2;
  }
  return (width - 44) / 2;
}

/**
 * CSS-ширина слота, совпадающая с `sizes` карточки.
 * Нужна, чтобы прелоад попал в тот же файл, который выберет srcset.
 */
export function menuCardSlotCssPx(viewportWidth: number, cardStyle: string | undefined): number {
  const width = Number.isFinite(viewportWidth) ? Math.max(0, viewportWidth) : 0;
  if (cardStyle === 'magazine') {
    return width >= 640 ? 96 : 80;
  }
  return Math.max(menuColumnCssPx(width) - menuCardImageInsetPx(cardStyle), 1);
}

/** Photo box in the styling-admin preview. Mirrors `stylingPreviewImageSizes`. */
export function stylingPreviewSlotCssPx(viewportWidth: number, cardStyle: string | undefined): number {
  const width = Number.isFinite(viewportWidth) ? Math.max(0, viewportWidth) : 0;
  if (cardStyle === 'magazine') {
    return width >= 640 ? 96 : 80;
  }
  const column = width >= 1101 ? (width - 268) * 0.4 - 78 : width >= 769 ? width - 326 : width - 126;
  const extra = cardStyle === 'elevated' ? 16 : cardStyle === 'overlay' || cardStyle === 'minimal' ? -2 : 0;
  return Math.max(column - extra, 1);
}

export function menuModalSlotCssPx(viewportWidth: number): number {
  const width = Number.isFinite(viewportWidth) ? Math.max(0, viewportWidth) : 0;
  return width >= 768 ? 520 : width;
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
