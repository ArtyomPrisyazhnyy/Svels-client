import Image from 'next/image';
import Link from 'next/link';
import { getDemoRestaurantUrl, LANDING_LIVE_SCREENS } from './landing-config';
import { Reveal } from './Reveal';

function TelegramOrderMock() {
  return (
    <div className="landing-telegram-mock" data-testid="landing-telegram-mock">
      <div className="landing-telegram-mock__topbar">
        <span className="landing-telegram-mock__back" aria-hidden>‹</span>
        <div className="landing-telegram-mock__peer">
          <span className="landing-telegram-mock__avatar" aria-hidden>S</span>
          <div>
            <strong className="landing-telegram-mock__name">Svels · Заказы</strong>
            <span className="landing-telegram-mock__sub">бот</span>
          </div>
        </div>
      </div>
      <div className="landing-telegram-mock__messages">
        <div className="landing-telegram-mock__bubble">
          <p className="landing-telegram-mock__title">Новый заказ #1842</p>
          <p className="landing-telegram-mock__line">Капучино ×1 · 8,50 BYN</p>
          <p className="landing-telegram-mock__line">Круассан ×2 · 12,40 BYN</p>
          <p className="landing-telegram-mock__line">Доставка · ул. Немига, 12</p>
        </div>
        <button type="button" className="landing-telegram-mock__inline" disabled>
          ✅ Принять
        </button>
        <button type="button" className="landing-telegram-mock__inline" disabled>
          ❌ Отклонить
        </button>
      </div>
    </div>
  );
}

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
            <figure key={screen.id} className="landing__live-slide" data-testid={`landing-live-${screen.id}`}>
              <div className="landing__live-frame">
                {screen.kind === 'telegram' ? (
                  <TelegramOrderMock />
                ) : (
                  <Image
                    src={screen.imageSrc ?? ''}
                    alt=""
                    width={screen.width ?? 390}
                    height={screen.height ?? 844}
                    className="landing__live-shot"
                    unoptimized
                    sizes="(max-width: 767px) 78vw, 240px"
                  />
                )}
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
