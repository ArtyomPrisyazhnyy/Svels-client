import { LANDING_AUDIENCE } from './landing-config';
import { Reveal } from './Reveal';

export function LandingForWhom() {
  return (
    <section
      id="for-whom"
      className="landing__section landing__section--for-whom"
      data-testid="landing-for-whom"
      aria-labelledby="landing-for-whom-title"
    >
      <div className="landing__container">
        <Reveal as="h2" id="landing-for-whom-title" className="landing__section-title">
          Подходит вашему формату
        </Reveal>

        <ul className="landing__audience-grid">
          {LANDING_AUDIENCE.map((card, index) => (
            <Reveal as="li" key={card.title} className="landing__audience-card" delay={50 + index * 35}>
              <h3 className="landing__audience-title">{card.title}</h3>
              <p className="landing__audience-text">{card.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
