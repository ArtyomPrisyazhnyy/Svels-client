import manifest from './landing-scenes.manifest.json';

export type LandingSceneId =
  | 'hero'
  | 'hero-mobile'
  | 'feature-menu'
  | 'feature-cart'
  | 'feature-telegram'
  | 'feature-admin';

export interface LandingSceneMeta {
  id: LandingSceneId;
  width: number;
  height: number;
  widths: number[];
  sizes: string;
  alt: string;
  fallbackWidth: number;
}

const scenes = manifest.scenes as Record<LandingSceneId, LandingSceneMeta>;

export function getLandingScene(id: LandingSceneId): LandingSceneMeta {
  const scene = scenes[id];
  if (!scene) {
    throw new Error(`Unknown landing scene: ${id}`);
  }
  return scene;
}

export function buildSceneSrcSet(scene: LandingSceneMeta, ext: 'avif' | 'webp'): string {
  return scene.widths
    .map((w) => `/landing/scenes/${scene.id}-${w}.${ext} ${w}w`)
    .join(', ');
}

export function getSceneFallbackSrc(scene: LandingSceneMeta): string {
  return `/landing/scenes/${scene.id}-${scene.fallbackWidth}.png`;
}

export function getHeroPreloadProps() {
  const hero = getLandingScene('hero');
  return {
    href: `/landing/scenes/hero-${hero.widths[0]}.avif`,
    imageSrcSet: buildSceneSrcSet(hero, 'avif'),
    imageSizes: hero.sizes,
  };
}
