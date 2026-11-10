/**
 * Пресеты обложки товара с storage.
 * Контракт ответа API: `null` или объект со слотами sm ≈ 400px, md ≈ 800px, lg ≈ 1200px.
 * `width` берётся из ответа, а не подставляется константой.
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
