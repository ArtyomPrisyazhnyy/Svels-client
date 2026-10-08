'use client';

import { useState } from 'react';
import { ContactButton } from './ContactButton';
import { LANDING_FAQ } from './landing-content';
import { Reveal } from './Reveal';

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="landing__section landing__section--faq" data-testid="landing-faq">
      <div className="landing__container">
        <Reveal as="h2" className="landing__section-title">
          Часто задаваемые вопросы
        </Reveal>
        <Reveal as="p" className="landing__section-subtitle" delay={60}>
          Не нашли ответ? Оставьте заявку — ответим в удобном мессенджере.
        </Reveal>

        <div className="landing__faq">
          {LANDING_FAQ.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `landing-faq-panel-${index}`;

            return (
              <div
                key={item.question}
                className={`landing__faq-item${isOpen ? ' is-open' : ''}`}
              >
                <button
                  type="button"
                  className="landing__faq-summary"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span>{item.question}</span>
                  <span className="landing__faq-icon" aria-hidden />
                </button>
                <div className="landing__faq-panel" id={panelId} role="region">
                  <p className="landing__faq-answer">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>

        <Reveal className="landing__faq-cta" delay={80}>
          <ContactButton label="Оставить заявку" variant="primary" />
        </Reveal>
      </div>
    </section>
  );
}
