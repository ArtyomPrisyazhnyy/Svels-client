import Image from 'next/image';
import { LANDING_DEMO_DOMAIN } from '@/views/landing-demo-constants';

/** Hero: iPhone 15 Pro + macOS browser с реальными скриншотами демо-заведения. */
export function LandingHeroScene() {
  return (
    <div className="landing-hero-devices" aria-hidden data-testid="landing-hero-scene">
      <div className="landing-browser landing-browser--hero landing-browser--mac">
        <div className="landing-browser__bar">
          <span className="landing-browser__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="landing-browser__tab">Чайка — меню</span>
          <span className="landing-browser__url">{LANDING_DEMO_DOMAIN}</span>
        </div>
        <div className="landing-browser__shot landing-browser__shot--hero">
          <Image
            src="/landing/hero-desktop.webp"
            alt=""
            width={1280}
            height={800}
            className="landing-browser__img"
            priority
            sizes="(max-width: 979px) 0px, 520px"
          />
        </div>
      </div>

      <div className="landing-iphone15">
        <span className="landing-iphone15__btn landing-iphone15__btn--silent" aria-hidden />
        <span className="landing-iphone15__btn landing-iphone15__btn--volume" aria-hidden />
        <span className="landing-iphone15__btn landing-iphone15__btn--power" aria-hidden />
        <div className="landing-iphone15__bezel">
          <div className="landing-iphone15__island" aria-hidden />
          <div className="landing-iphone15__screen">
            <Image
              src="/landing/hero-phone.webp"
              alt=""
              width={390}
              height={844}
              className="landing-iphone15__img"
              priority
              sizes="(max-width: 979px) 46vw, 200px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
