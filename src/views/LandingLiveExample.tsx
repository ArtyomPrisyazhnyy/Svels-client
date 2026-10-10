import Link from 'next/link';
import { getDemoRestaurantUrl, LANDING_LIVE_SCREENS } from './landing-config';
import { LandingPicture } from './LandingPicture';
import { getLandingScene } from './landing-scenes';
import { Reveal } from './Reveal';

export function LandingLiveExample() {
  const demoUrl = getDemoRestaurantUrl();

  return (
    <section
      id="features"
      className="landing__section landing__section--features"
      data-testid="landing-features"
      aria-labelledby="landing-features-title"
    >
      <div className="landing__container">
        <Reveal as="h2" id="landing-features-title" className="landing__section-title">
          Посмотрите, как это выглядит у гостя
        </Reveal>
        <Reveal as="p" className="landing__section-subtitle" delay={40}>
          Это рабочие экраны, а не макеты: меню, корзина, оформление заказа и админка заведения.
        </Reveal>

        <div className="landing__live-carousel" data-testid="landing-live-carousel">
          {LANDING_LIVE_SCREENS.map((screen) => (
            <figure
              key={screen.id}
              className="landing__live-slide"
              data-testid={`landing-live-${screen.id}`}
            >
              <div className="landing__live-frame">
                <LandingPicture
                  scene={getLandingScene(screen.sceneId)}
                  className="landing__live-picture"
                />
              </div>
              <figcaption className="landing__live-caption">{screen.caption}</figcaption>
            </figure>
          ))}
        </div>

        <Reveal className="landing__features-cta" delay={80}>
          <Link
            href={demoUrl}
            className="landing-cta landing-cta--primary landing-cta--block"
            data-testid="landing-demo-cta"
          >
            Открыть демо-заведение
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
