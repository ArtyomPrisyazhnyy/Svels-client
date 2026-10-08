import type { ImgHTMLAttributes } from 'react';
import { resolveImageUrl } from '@/shared/types/menu';

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string;
  webpSrc?: string | null;
};

/**
 * WebP при поддержке браузером, иначе JPEG/PNG fallback.
 *
 * Не использовать display:contents на <picture> — в Chromium ломается
 * выбор <source type="image/webp"> и всегда грузится fallback (jpg/png).
 */
export function ResponsiveImage({ src, webpSrc, alt = '', ...imgProps }: ResponsiveImageProps) {
  const fallback = resolveImageUrl(src);
  const webp = webpSrc ? resolveImageUrl(webpSrc) : null;

  if (!webp || webp === fallback) {
    return <img src={fallback} alt={alt} {...imgProps} />;
  }

  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      <img src={fallback} alt={alt} {...imgProps} />
    </picture>
  );
}
