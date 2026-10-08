import { LandingHeader } from './LandingHeader';

/**
 * Страница политики конфиденциальности платформы Svels.
 */
export function PrivacyPolicyPage() {
  return (
    <div className="privacy-policy" data-testid="privacy-policy-page">
      <LandingHeader />

      <main className="privacy-policy__main privacy-policy__container">
        <h1 className="privacy-policy__title">Политика конфиденциальности</h1>
      </main>
    </div>
  );
}
