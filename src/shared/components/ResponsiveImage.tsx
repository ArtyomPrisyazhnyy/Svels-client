import Image from 'next/image';
import type { ImgHTMLAttributes } from 'react';
import { resolveImageUrl } from '@/shared/types/menu';

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string;
  webpSrc?: string | null;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
};

function isNextImageCandidate(url: string): boolean {
  if (url.startsWith('data:')) {
    return false;
  }
  if (url.startsWith('/')) {
    return true;
  }
  try {
    const { pathname } = new URL(url);
    return pathname.startsWith('/uploads/');
  } catch {
    return false;
  }
}

/**
 * WebP при поддержке браузером, иначе JPEG/PNG fallback.
 * Same-origin и /uploads используют next/image (размеры + lazy/priority).
 */
export function ResponsiveImage({
  src,
  webpSrc,
  alt = '',
  width,
  height,
  sizes,
  priority = false,
  className,
  loading,
  ...imgProps
}: ResponsiveImageProps) {
  const fallback = resolveImageUrl(src);
  const webp = webpSrc ? resolveImageUrl(webpSrc) : null;
  const resolvedLoading = priority ? 'eager' : (loading ?? 'lazy');
  const fetchPriority = priority ? 'high' : imgProps.fetchPriority;

  if (!webp || webp === fallback) {
    if (isNextImageCandidate(fallback)) {
      const w = width ?? 400;
      const h = height ?? 300;
      return (
        <Image
          src={fallback}
          alt={alt}
          width={w}
          height={h}
          sizes={sizes ?? '(max-width: 768px) 50vw, 33vw'}
          className={className}
          priority={priority}
          loading={priority ? undefined : resolvedLoading}
        />
      );
    }

    return (
      // data:/external URLs and WebP fallbacks stay on <img> (picture/source).
      // eslint-disable-next-line @next/next/no-img-element -- intentional non-optimizer paths
      <img
        src={fallback}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={resolvedLoading}
        fetchPriority={fetchPriority}
        {...imgProps}
      />
    );
  }

  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      <img
        src={fallback}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={resolvedLoading}
        fetchPriority={fetchPriority}
        {...imgProps}
      />
    </picture>
  );
}
