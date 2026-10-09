import type { LandingSceneMeta } from './landing-scenes';
import { buildSceneSrcSet, getSceneFallbackSrc } from './landing-scenes';

interface LandingPictureProps {
  scene: LandingSceneMeta;
  className?: string;
  priority?: boolean;
}

export function LandingPicture({ scene, className, priority = false }: LandingPictureProps) {
  const avif = buildSceneSrcSet(scene, 'avif');
  const webp = buildSceneSrcSet(scene, 'webp');
  const fallback = getSceneFallbackSrc(scene);

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={avif} sizes={scene.sizes} />
      <source type="image/webp" srcSet={webp} sizes={scene.sizes} />
      <img
        src={fallback}
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
