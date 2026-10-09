import { LandingPicture } from './LandingPicture';
import { getLandingScene } from './landing-scenes';

/** Raster hero device scenes (built offline via `npm run landing:scenes`). */
export function LandingHeroVisual() {
  const hero = getLandingScene('hero');
  const heroMobile = getLandingScene('hero-mobile');

  return (
    <div className="landing-hero-visual" data-testid="landing-hero-scene" aria-hidden>
      <LandingPicture scene={hero} className="landing-hero-visual__desktop" priority />
      <LandingPicture scene={heroMobile} className="landing-hero-visual__mobile" priority />
    </div>
  );
}
