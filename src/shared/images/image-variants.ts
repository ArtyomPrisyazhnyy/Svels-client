import type { ImageVariants } from '../types/image-variants';

const VARIANT_SLOTS = ['sm', 'md', 'lg'] as const;

export type ImageVariantSlot = (typeof VARIANT_SLOTS)[number];

export interface NormalizedImageVariant {
  slot: ImageVariantSlot;
  width: number;
  webp: string;
  jpg: string;
}

/**
 * Слоты sm → md → lg с положительной шириной и хотя бы одним URL.
 * Одинаковая ширина остаётся один раз. Абсолютные ссылки storage не переписываются.
 */
export function normalizeImageVariants(
  variants: ImageVariants | null | undefined,
  resolveUrl: (url: string) => string = (url) => url,
): NormalizedImageVariant[] {
  if (!variants || typeof variants !== 'object') {
    return [];
  }

  const normalized: NormalizedImageVariant[] = [];
  for (const slot of VARIANT_SLOTS) {
    const raw = variants[slot];
    if (!raw || typeof raw !== 'object') {
      continue;
    }
    const width = raw.width;
    if (typeof width !== 'number' || !Number.isFinite(width) || width <= 0) {
      continue;
    }
    const webp = typeof raw.webp === 'string' ? raw.webp.trim() : '';
    const jpg = typeof raw.jpg === 'string' ? raw.jpg.trim() : '';
    if (!webp && !jpg) {
      continue;
    }
    normalized.push({
      slot,
      width,
      webp: webp ? resolveUrl(webp) : '',
      jpg: jpg ? resolveUrl(jpg) : '',
    });
  }

  const seenWidths = new Set<number>();
  return normalized
    .filter((variant) => {
      if (seenWidths.has(variant.width)) {
        return false;
      }
      seenWidths.add(variant.width);
      return true;
    })
    .sort((a, b) => a.width - b.width);
}

export function hasImageVariants(variants: ImageVariants | null | undefined): boolean {
  return normalizeImageVariants(variants).length > 0;
}

/**
 * Тот же выбор, что у `srcset` с дескриптором `w`:
 * наименьший кандидат, у которого width >= слот в CSS-пикселях × devicePixelRatio.
 * Если все меньше — самый большой.
 */
export function selectImageVariant(
  variants: ImageVariants | null | undefined,
  slotCssPx: number,
  devicePixelRatio = 1,
): NormalizedImageVariant | null {
  const list = normalizeImageVariants(variants);
  if (list.length === 0) {
    return null;
  }

  const dpr = Number.isFinite(devicePixelRatio) && devicePixelRatio > 0 ? devicePixelRatio : 1;
  const slot = Number.isFinite(slotCssPx) && slotCssPx > 0 ? slotCssPx : 0;
  const target = slot * dpr;
  return list.find((variant) => variant.width >= target) ?? list[list.length - 1];
}

export function imageVariantSrcSet(
  variants: ImageVariants | null | undefined,
  format: 'webp' | 'jpg',
): string {
  return normalizeImageVariants(variants)
    .filter((variant) => variant[format])
    .map((variant) => `${variant[format]} ${variant.width}w`)
    .join(', ');
}

/** `src` у `<img>`: самый широкий jpeg, иначе исходная обложка. */
export function imageVariantFallbackSrc(
  variants: ImageVariants | null | undefined,
  originalSrc: string,
  resolveUrl: (url: string) => string = (url) => url,
): string {
  const list = normalizeImageVariants(variants, resolveUrl);
  for (let index = list.length - 1; index >= 0; index -= 1) {
    if (list[index].jpg) {
      return list[index].jpg;
    }
  }
  return originalSrc ? resolveUrl(originalSrc) : '';
}

/** URL, который браузер запросит первым: webp выбранного слота, иначе jpeg. */
export function preferredVariantUrl(
  variants: ImageVariants | null | undefined,
  slotCssPx: number,
  devicePixelRatio = 1,
): string | null {
  const selected = selectImageVariant(variants, slotCssPx, devicePixelRatio);
  if (!selected) {
    return null;
  }
  return selected.webp || selected.jpg || null;
}
