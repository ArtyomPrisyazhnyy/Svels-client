'use client';

import { useState } from 'react';
import { ContactButton } from './ContactButton';
import { Reveal } from './Reveal';
import {
  formatByn,
  LANDING_PLANS,
  monthlySavings,
  yearlyMonthlyEquivalent,
  type PricingPeriod,
} from './landing-pricing';

export function LandingPricing() {
  const [period, setPeriod] = useState<PricingPeriod>('month');
  const isYearly = period === 'year';

  return (
    <section id="pricing" className="landing__section landing__section--pricing" data-testid="landing-pricing">
      <div className="landing__container">
        <Reveal as="h2" className="landing__section-title">
          Тарифы
        </Reveal>
        <Reveal as="p" className="landing__section-subtitle" delay={60}>
          Сайт и приложение можно подключить по отдельности. Оплата в BYN.
        </Reveal>

        <Reveal className="landing__pricing-switch-wrap" delay={90}>
          <div
            className={`landing__pricing-switch${isYearly ? ' is-yearly' : ''}`}
            role="group"
            aria-label="Период оплаты"
          >
            <span className="landing__pricing-switch-thumb" aria-hidden="true" />
            <button
              type="button"
              className={`landing__pricing-switch-btn${period === 'month' ? ' is-active' : ''}`}
              aria-pressed={period === 'month'}
              onClick={() => setPeriod('month')}
            >
              В месяц
            </button>
            <button
              type="button"
              className={`landing__pricing-switch-btn${period === 'year' ? ' is-active' : ''}`}
              aria-pressed={period === 'year'}
              onClick={() => setPeriod('year')}
              data-testid="landing-pricing-yearly"
            >
              В год
            </button>
          </div>
        </Reveal>

        <div className="landing__pricing-grid">
          {LANDING_PLANS.map((plan, index) => {
            const savings = monthlySavings(plan.monthly, plan.yearly);
            const perMonth = yearlyMonthlyEquivalent(plan.yearly);

            return (
              <Reveal
                key={plan.id}
                className="landing__pricing-card"
                delay={120 + index * 70}
              >
                <h3 className="landing__pricing-name">{plan.name}</h3>
                <p className="landing__pricing-desc">{plan.description}</p>

                <div className="landing__pricing-cost">
                  <div className={`landing__pricing-price-slot${isYearly ? ' is-yearly' : ''}`}>
                    <p
                      className="landing__pricing-price landing__pricing-price--month"
                      aria-hidden={isYearly}
                    >
                      <span className="landing__pricing-amount">{formatByn(plan.monthly)}</span>
                      <span className="landing__pricing-currency">BYN</span>
                      <span className="landing__pricing-period">/ месяц</span>
                    </p>
                    <p
                      className="landing__pricing-price landing__pricing-price--year"
                      aria-hidden={!isYearly}
                    >
                      <span className="landing__pricing-amount">{formatByn(plan.yearly)}</span>
                      <span className="landing__pricing-currency">BYN</span>
                      <span className="landing__pricing-period">/ год</span>
                    </p>
                  </div>
                  <div
                    className={`landing__pricing-save-slot${isYearly ? ' is-open' : ''}`}
                    aria-hidden={!isYearly}
                  >
                    <p className="landing__pricing-save">
                      {formatByn(perMonth)} BYN/мес — на {formatByn(savings)} BYN в месяц дешевле
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="landing__pricing-cta" delay={200}>
          <ContactButton label="Оставить заявку" variant="primary" />
        </Reveal>
      </div>
    </section>
  );
}
