import { LANDING_BENEFITS } from './landing-config';
import { LandingBenefitIcon } from './LandingBenefitIcon';
import { Reveal } from './Reveal';

export function LandingBenefits() {
  return (
    <section
      id="benefits"
      className="landing__section landing__section--benefits"
      data-testid="landing-benefits"
      aria-labelledby="landing-benefits-title"
    >
      <div className="landing__container">
        <Reveal as="h2" id="landing-benefits-title" className="landing__section-title">
          Как Svels приносит вам деньги
        </Reveal>
        <Reveal as="p" className="landing__section-subtitle" delay={40}>
          Мы берём фиксированную плату, а не процент. Всё, что гости заказывают у вас, остаётся у вас.
        </Reveal>

        <ul className="landing__benefits-grid">
          {LANDING_BENEFITS.map((card, index) => (
            <Reveal as="li" key={card.title} className="landing__benefit-card" delay={60 + index * 40}>
              <span className="landing__benefit-icon" aria-hidden>
                <LandingBenefitIcon icon={card.icon} />
              </span>
              <h3 className="landing__benefit-title">{card.title}</h3>
              <p className="landing__benefit-text">{card.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
