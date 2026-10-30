import Image from 'next/image';
import { toOptimizerImageSrc } from '@/shared/images/menu-image';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';

interface FillImageProps {
  src: string;
  webpSrc?: string | null;
  alt: string;
  sizes: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  className?: string;
}

/**
 * Card photo that fills a reserved aspect-ratio box.
 * Uses the Next optimizer when the file is on an allowed host; otherwise the
 * existing picture/webp markup, still lazy and sized.
 */
export function FillImage({
  src,
  webpSrc,
  alt,
  sizes,
  loading = 'lazy',
  fetchPriority = 'low',
  className,
}: FillImageProps) {
  const optimized = toOptimizerImageSrc(webpSrc || src);
  const priority = fetchPriority === 'high';

  if (optimized) {
    return (
      <Image
        src={optimized}
        alt={alt}
        fill
        sizes={sizes}
        quality={65}
        priority={priority}
        loading={priority ? 'eager' : loading}
        fetchPriority={priority ? 'high' : fetchPriority}
        className={className}
        style={{ objectFit: 'cover' }}
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
      decoding="async"
      className={className}
    />
  );
}
