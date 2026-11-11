/**
 * Пресеты обложки с storage.
 * Контракт API: `null`, пока варианты не посчитаны, иначе объект со слотами
 * sm ≈ 400, md ≈ 800, lg ≈ 1200. `width` берётся из ответа, не из константы.
 */
export interface ImageVariantSource {
  width: number;
  webp: string;
  jpg: string;
}

export interface ImageVariants {
  sm?: ImageVariantSource;
  md?: ImageVariantSource;
  lg?: ImageVariantSource;
}
