import type { LandingSceneMeta } from './landing-scenes';
import { buildSceneSrcSet, getSceneFallbackSrc } from './landing-scenes';

const TRANSPARENT_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

interface LandingPictureProps {
  scene: LandingSceneMeta;
  className?: string;
  priority?: boolean;
  /**
   * When set, sources only match this media query.
   * The img fallback is a 1×1 pixel so a non-matching viewport does not download the scene.
   */
  media?: string;
}

export function LandingPicture({ scene, className, priority = false, media }: LandingPictureProps) {
  const avif = buildSceneSrcSet(scene, 'avif');
  const webp = buildSceneSrcSet(scene, 'webp');
  const fallback = getSceneFallbackSrc(scene);
  const png = `${fallback} ${scene.fallbackWidth}w`;

  return (
    <picture className={className}>
      <source media={media} type="image/avif" srcSet={avif} sizes={scene.sizes} />
      <source media={media} type="image/webp" srcSet={webp} sizes={scene.sizes} />
      {media ? <source media={media} type="image/png" srcSet={png} sizes={scene.sizes} /> : null}
      <img
        src={media ? TRANSPARENT_PIXEL : fallback}
        width={scene.width}
        height={scene.height}
        alt={scene.alt}
        className="landing-picture__img"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
  );
}
