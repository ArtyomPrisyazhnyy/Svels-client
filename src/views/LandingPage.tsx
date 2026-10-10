import Link from 'next/link';
import { ContactButton } from './ContactButton';
import { LandingBenefits } from './LandingBenefits';
import { LandingFaq } from './LandingFaq';
import { LandingForWhom } from './LandingForWhom';
import { LandingHeader } from './LandingHeader';
import { LandingHeroVisual } from './LandingHeroVisual';
import { getHeroPreloadProps } from './landing-scenes';
import { LandingLiveExample } from './LandingLiveExample';
import { LandingPricing } from './LandingPricing';
import { getDemoRestaurantUrl } from './landing-config';
import { Reveal } from './Reveal';

/**
 * Главная (лендинг) страница Svels.
 * Серверный каркас + клиентские острова: заявка, витрина возможностей, FAQ, тарифы.
 */

const STEPS = [
  {
    title: 'Заявка',
    text: 'Пишете в мессенджер — смотрим зал, меню и как хотите принимать гостей.',
  },
  {
    title: 'Сайт',
    text: 'За несколько дней запускаем страницу на вашем домене: бронь, меню, стиль заведения.',
  },
  {
    title: 'Приложение',
    text: 'Собираем white-label под бренд и публикуем в сторах, когда готовы меню и оформление.',
  },
];

const TRUST_CHIPS = ['0% с заказов', 'Дизайн под ваш бренд', 'Гости и данные — ваши'] as const;

export function LandingPage() {
  const demoUrl = getDemoRestaurantUrl();
  const heroPreload = getHeroPreloadProps();

  return (
    <div className="landing" data-testid="landing-page">
      <link
        rel="preload"
        as="image"
        href={heroPreload.mobile.href}
        imageSrcSet={heroPreload.mobile.imageSrcSet}
        imageSizes={heroPreload.mobile.imageSizes}
        media="(max-width: 979px)"
        type="image/avif"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={heroPreload.desktop.href}
        imageSrcSet={heroPreload.desktop.imageSrcSet}
        imageSizes={heroPreload.desktop.imageSizes}
        media="(min-width: 980px)"
        type="image/avif"
        fetchPriority="high"
      />
      <LandingHeader />

      <section className="landing__hero landing__container">
        <div className="landing__hero-copy">
          <Reveal className="landing__hero-badge">
            <span className="landing__hero-badge-dot" aria-hidden />
            Для кафе, ресторанов, кофеен и цветочных
          </Reveal>
          <Reveal as="h1" className="landing__hero-title" delay={50}>
            Сайт и мобильное приложение
            <br />
            <span className="landing__hero-title-accent">для вашего заведения</span>
          </Reveal>
          <Reveal as="p" className="landing__hero-text" delay={100}>
            Доставка, самовывоз и заказы в зале. Оплата картой онлайн, новые заказы — сразу в
            Telegram. Запуск за несколько дней.
          </Reveal>
          <Reveal className="landing__hero-chips" delay={120}>
            {TRUST_CHIPS.map((chip) => (
              <span key={chip} className="landing__hero-chip">{chip}</span>
            ))}
          </Reveal>
          <Reveal className="landing__hero-actions" delay={150}>
            <ContactButton label="Оставить заявку" variant="primary" />
            <Link href={demoUrl} className="landing-cta landing-cta--ghost landing-cta--block-mobile">
              Посмотреть живой пример
            </Link>
          </Reveal>
        </div>
        <Reveal className="landing__hero-visual" delay={120}>
          <LandingHeroVisual />
        </Reveal>
      </section>

      <section className="landing__section landing__section--steps" aria-label="Как подключаем">
        <div className="landing__container">
          <ol className="landing__steps">
            {STEPS.map((step, index) => (
              <li key={step.title} className="landing__step">
                <span className="landing__step-index">{index + 1}</span>
                <h2 className="landing__step-title">{step.title}</h2>
                <p className="landing__step-text">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <LandingBenefits />
      <LandingLiveExample />
      <LandingForWhom />
      <LandingPricing />
      <LandingFaq />

      <footer className="landing__footer">
        <div className="landing__container landing__footer-inner">
          <span className="landing__footer-brand">Svels</span>
          <span className="landing__footer-note">
            Бронь столов и предзаказы для ресторанов.
          </span>
          <Link className="landing__footer-link" href="/privacypolicy">
            Политика конфиденциальности
          </Link>
        </div>
      </footer>
    </div>
  );
}
