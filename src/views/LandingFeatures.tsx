'use client';

import { useEffect, useState } from 'react';
import { ContactButton } from './ContactButton';
import { LANDING_SHOWCASES, type ShowcaseId } from './landing-content';
import { Reveal } from './Reveal';

const ROTATE_MS = 5600;

export function LandingFeatures() {
  const [activeId, setActiveId] = useState<ShowcaseId>('booking');
  const [paused, setPaused] = useState(false);
  const active = LANDING_SHOWCASES.find((item) => item.id === activeId) ?? LANDING_SHOWCASES[0];

  useEffect(() => {
    if (paused) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveId((current) => {
        const index = LANDING_SHOWCASES.findIndex((item) => item.id === current);
        return LANDING_SHOWCASES[(index + 1) % LANDING_SHOWCASES.length].id;
      });
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      id="features"
      className="landing__section landing__section--features"
      data-testid="landing-features"
    >
      <div className="landing__container">
        <Reveal as="h2" className="landing__section-title landing__section-title--left">
          Как это выглядит у гостя
        </Reveal>
        <Reveal as="p" className="landing__section-subtitle landing__section-subtitle--left" delay={50}>
          Не список обещаний — рабочие экраны: бронь, заказ, сайт и приложение заведения.
        </Reveal>

        <div
          className="landing__showcase"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="landing__showcase-list" role="tablist" aria-label="Возможности">
            {LANDING_SHOWCASES.map((item) => {
              const selected = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`landing-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`landing-scene-${item.id}`}
                  className={`landing__showcase-tab${selected ? ' is-active' : ''}`}
                  onClick={() => setActiveId(item.id)}
                >
                  <span className="landing__showcase-kicker">{item.kicker}</span>
                  <span className="landing__showcase-title">{item.title}</span>
                  <span className="landing__showcase-text">{item.description}</span>
                </button>
              );
            })}
          </div>

          <div
            className="landing__showcase-stage"
            role="tabpanel"
            id={`landing-scene-${active.id}`}
            aria-labelledby={`landing-tab-${active.id}`}
            data-testid={`landing-scene-${active.id}`}
          >
            <ShowcaseScene id={active.id} />
          </div>
        </div>

        <Reveal className="landing__features-cta" delay={80}>
          <ContactButton label="Подобрать решение" variant="primary" />
        </Reveal>
      </div>
    </section>
  );
}

function ShowcaseScene({ id }: { id: ShowcaseId }) {
  switch (id) {
    case 'booking':
      return (
        <div className="landing-mock landing-mock--booking">
          <div className="landing-mock__meta">
            <span>пт, 18 апр</span>
            <span>19:00</span>
            <span>4 гостя</span>
          </div>
          <div className="landing-mock__floor">
            <i className="is-busy" />
            <i />
            <i className="is-pick" />
            <i />
            <i className="is-busy" />
            <i />
            <b>стол 7</b>
          </div>
        </div>
      );
    case 'preorder':
      return (
        <div className="landing-mock landing-mock--preorder">
          <ul>
            <li>
              <i />
              <span>
                Сенча
                <small>горячий · 400 мл</small>
              </span>
              <em>12</em>
            </li>
            <li>
              <i />
              <span>
                Тарт
                <small>к чаю</small>
              </span>
              <em>9</em>
            </li>
          </ul>
          <footer>
            <span>К оплате 21 BYN</span>
            <strong>Оплатить</strong>
          </footer>
        </div>
      );
    case 'site':
      return (
        <div className="landing-mock landing-mock--site">
          <div className="landing-browser landing-browser--embed">
            <div className="landing-browser__bar">
              <span className="landing-browser__dots">
                <i />
                <i />
                <i />
              </span>
              <span className="landing-browser__url">bistro-lotos.by</span>
            </div>
            <div className="landing-browser__body">
              <div className="landing-browser__hero">
                <span className="landing-browser__mark">Bistro Lotos</span>
                <strong>Меню и бронь</strong>
              </div>
              <div className="landing-browser__grid">
                <span>Сенча</span>
                <span>Матча</span>
                <span>Десерт</span>
              </div>
            </div>
          </div>
        </div>
      );
    case 'app':
      return (
        <div className="landing-mock landing-mock--app">
          <div className="landing-phone landing-phone--embed">
            <div className="landing-phone__notch" />
            <div className="landing-phone__screen">
              <header>
                <b>Bistro Lotos</b>
                <span>Меню</span>
              </header>
              <ul>
                <li>
                  <i />
                  Матча латте
                  <em>16</em>
                </li>
                <li>
                  <i />
                  Сенча
                  <em>12</em>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    case 'admin':
      return (
        <div className="landing-mock landing-mock--admin">
          <aside>
            <b>Svels</b>
            <span className="is-on">Меню</span>
            <span>Зал</span>
            <span>График</span>
          </aside>
          <div>
            <header>Позиции</header>
            <ul>
              <li>
                Сенча
                <i className="is-on" />
              </li>
              <li>
                Матча
                <i className="is-on" />
              </li>
              <li>
                Десерт дня
                <i />
              </li>
            </ul>
          </div>
        </div>
      );
  }
}
