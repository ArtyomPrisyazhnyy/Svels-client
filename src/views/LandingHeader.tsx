'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ContactButton } from './ContactButton';

const LANDING_SECTION_LINKS = [
  { href: '/#benefits', label: 'Как это работает' },
  { href: '/#features', label: 'Пример' },
  { href: '/#pricing', label: 'Тарифы' },
  { href: '/#faq', label: 'FAQ' },
] as const;

/**
 * Единая шапка лендинга (главная, политика конфиденциальности и др.).
 * Якоря ведут на главную — с других страниц открывается / и скролл к разделу.
 */
export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="landing__header">
      <div className="landing__container landing__header-inner">
        <Link className="landing__brand" href="/" aria-label="Svels">
          <span className="landing__brand-mark">Svels</span>
        </Link>

        <nav className="landing__nav landing__nav--desktop" aria-label="Разделы">
          {LANDING_SECTION_LINKS.map(({ href, label }) => (
            <a key={href} href={href} className="landing__nav-link">
              {label}
            </a>
          ))}
        </nav>

        <div className="landing__header-actions">
          <ContactButton label="Оставить заявку" variant="primary" className="landing__header-cta" />
          <button
            type="button"
            className="landing__menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="landing-mobile-menu"
            aria-label={menuOpen ? 'Закрыть меню' : 'Меню'}
            onClick={() => setMenuOpen((open) => !open)}
            data-testid="landing-menu-toggle"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              {menuOpen ? (
                <path d="M4 4l10 10M14 4L4 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M3 5h12M3 9h12M3 13h12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="landing-mobile-menu" className="landing__mobile-menu" data-testid="landing-mobile-menu">
          <nav className="landing__mobile-menu-nav" aria-label="Разделы">
            {LANDING_SECTION_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="landing__mobile-menu-link"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
