import type { ReactNode } from 'react';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import {
  resolvePromoBannerAspectRatio,
  type PromoBanner,
  type PromoBannerAspectRatio,
} from '@/shared/types/promo-banner';
import '@/features/restaurants/styles/promo-banner-modal.scss';

interface PromoBannerAspectMediaProps {
  banner: PromoBanner;
  /** When set, overrides strip resolution (admin preview while editing). */
  aspectRatioOverride?: PromoBannerAspectRatio;
  imageClassName?: string;
  linkClassName?: string;
  frameClassName?: string;
  frameTestId?: string;
  /** LCP strip: eager fetch, high priority, no lazy. */
  priority?: boolean;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
}

function aspectFrameClass(ratio: PromoBannerAspectRatio): string {
  return ratio === '16_9'
    ? 'promo-banner-aspect-frame promo-banner-aspect-frame--16-9'
    : 'promo-banner-aspect-frame promo-banner-aspect-frame--4-1';
}

function Frame({
  ratio,
  className,
  testId,
  children,
}: {
  ratio: PromoBannerAspectRatio;
  className?: string;
  testId?: string;
  children: ReactNode;
}) {
  const classes = className
    ? `${aspectFrameClass(ratio)} ${className}`
    : aspectFrameClass(ratio);

  return (
    <div className={classes} data-testid={testId}>
      {children}
    </div>
  );
}

export function PromoBannerAspectMedia({
  banner,
  aspectRatioOverride,
  imageClassName = '',
  linkClassName = '',
  frameClassName,
  frameTestId,
  priority = false,
  loading,
  fetchPriority,
}: PromoBannerAspectMediaProps) {
  const isStrip = banner.type === 'strip';
  const ratio = aspectRatioOverride ?? resolvePromoBannerAspectRatio(banner);
  const imageLoading = priority ? 'eager' : loading;
  const imagePriority = priority ? 'high' : fetchPriority;

  const image = (
    <ResponsiveImage
      className={`promo-banner-aspect-frame__image ${imageClassName}`.trim()}
      src={banner.imageUrl}
      webpSrc={banner.imageWebpUrl}
      alt={banner.title?.trim() || 'Акция'}
      loading={imageLoading}
      fetchPriority={imagePriority}
      decoding="async"
    />
  );

  const content = isStrip ? (
    <Frame ratio={ratio} className={frameClassName} testId={frameTestId}>
      {image}
    </Frame>
  ) : (
    <div
      className={frameClassName ? `promo-banner-modal__media ${frameClassName}` : 'promo-banner-modal__media'}
      data-testid={frameTestId}
    >
      {image}
    </div>
  );

  if (!banner.linkUrl) {
    return content;
  }

  return (
    <a
      href={banner.linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClassName}
    >
      {content}
    </a>
  );
}
