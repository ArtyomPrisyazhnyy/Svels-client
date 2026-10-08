import Link from 'next/link';
import { ContactButton } from './ContactButton';
import { LandingHeader } from './LandingHeader';
import { LandingFaq } from './LandingFaq';
import { LandingFeatures } from './LandingFeatures';
import { LandingHeroScene } from './LandingHeroScene';
import { LandingPricing } from './LandingPricing';
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

export function LandingPage() {
  return (
    <div className="landing" data-testid="landing-page">
      <LandingHeader />

      <section className="landing__hero landing__container">
        <div className="landing__hero-copy">
          <Reveal className="landing__hero-badge">
            <span className="landing__hero-badge-dot" aria-hidden />
            Для ресторанов, баров и кофеен
          </Reveal>
          <Reveal as="h1" className="landing__hero-title" delay={50}>
            Сайт и мобильное приложение
            <br />
            <span className="landing__hero-title-accent">для вашего заведения</span>
          </Reveal>
          <Reveal as="p" className="landing__hero-text" delay={100}>
            Гость бронирует стол, заказывает заранее и открывает вас по адресу
            заведения — не платформы. Выглядит как ваш продукт, потому что это он и есть.
          </Reveal>
          <Reveal className="landing__hero-actions" delay={150}>
            <ContactButton label="Оставить заявку" variant="primary" />
            <a href="#features" className="landing-cta landing-cta--ghost">Смотреть экраны</a>
          </Reveal>
        </div>
        <Reveal className="landing__hero-visual" delay={120}>
          <LandingHeroScene />
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

      <LandingFeatures />
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
