import type { ImgHTMLAttributes } from 'react';
import { FillImage } from '@/shared/components/FillImage';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import {
  hasImageVariants,
  imageVariantFallbackSrc,
  imageVariantSrcSet,
  normalizeImageVariants,
} from '@/shared/images/image-variants';
import { resolveImageUrl } from '@/shared/types/menu';
import type { ImageVariants } from '@/shared/types/image-variants';
import './product-photo.scss';

type ProductPhotoProps = {
  src: string;
  webpSrc?: string | null;
  imageVariants?: ImageVariants | null;
  alt: string;
  sizes: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  className?: string;
  onError?: ImgHTMLAttributes<HTMLImageElement>['onError'];
  /**
   * Закрывает бокс с position: relative (карточка, модалка).
   * Тот же cover, что у next/image fill.
   */
  fill?: boolean;
  /**
   * Запасной путь без imageVariants: next/image только для быстрого origin
   * (локальные /uploads и Yandex). Медленный S3 рисуется напрямую.
   */
  optimize?: boolean;
};

function resolvedVariants(variants: ImageVariants | null | undefined): ImageVariants | null {
  const list = normalizeImageVariants(variants, resolveImageUrl);
  if (list.length === 0) {
    return null;
  }
  const resolved: ImageVariants = {};
  for (const variant of list) {
    resolved[variant.slot] = {
      width: variant.width,
      webp: variant.webp,
      jpg: variant.jpg,
    };
  }
  return resolved;
}

/**
 * Фото товара. Готовые sm/md/lg отдаются напрямую через srcset/sizes,
 * без прокси `/_next/image`. Пока пресетов нет — прежний URL.
 */
export function ProductPhoto({
  src,
  webpSrc,
  imageVariants,
  alt,
  sizes,
  loading,
  fetchPriority,
  className,
  onError,
  fill = false,
  optimize = false,
}: ProductPhotoProps) {
  const variants = resolvedVariants(imageVariants);
  const fillClass = fill ? 'product-photo--fill' : undefined;

  if (!variants || !hasImageVariants(variants)) {
    const legacyClass = [fillClass, className].filter(Boolean).join(' ') || undefined;
    if (optimize) {
      return (
        <FillImage
          src={src}
          webpSrc={webpSrc}
          alt={alt}
          sizes={sizes}
          loading={loading}
          fetchPriority={fetchPriority}
          className={legacyClass}
        />
      );
    }

    return (
      <ResponsiveImage
        src={src}
        webpSrc={webpSrc}
        alt={alt}
        sizes={sizes}
        loading={loading}
        fetchPriority={fetchPriority}
        className={legacyClass}
        onError={onError}
      />
    );
  }

  const webpSrcSet = imageVariantSrcSet(variants, 'webp');
  const jpgSrcSet = imageVariantSrcSet(variants, 'jpg');

  return (
    <picture className={fillClass}>
      {webpSrcSet ? <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} /> : null}
      <img
        src={imageVariantFallbackSrc(variants, src, resolveImageUrl)}
        srcSet={jpgSrcSet || undefined}
        sizes={sizes}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        className={className}
        onError={onError}
      />
    </picture>
  );
}
