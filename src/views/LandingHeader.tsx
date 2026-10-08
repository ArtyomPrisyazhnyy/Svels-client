import { ContactButton } from './ContactButton';

const LANDING_SECTION_LINKS = [
  { href: '/#features', label: 'Возможности' },
  { href: '/#pricing', label: 'Тарифы' },
  { href: '/#faq', label: 'FAQ' },
] as const;

/**
 * Единая шапка лендинга (главная, политика конфиденциальности и др.).
 * Якоря ведут на главную — с других страниц открывается / и скролл к разделу.
 */
export function LandingHeader() {
  return (
    <header className="landing__header">
      <div className="landing__container">
        <a className="landing__brand" href="/" aria-label="Svels">
          <span className="landing__brand-mark">Svels</span>
        </a>
        <nav className="landing__nav" aria-label="Разделы">
          {LANDING_SECTION_LINKS.map(({ href, label }) => (
            <a key={href} href={href} className="landing__nav-link">
              {label}
            </a>
          ))}
        </nav>
        <ContactButton label="Оставить заявку" variant="primary" className="landing__header-cta" />
      </div>
    </header>
  );
}
