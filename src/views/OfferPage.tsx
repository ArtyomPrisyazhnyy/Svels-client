import { LegalMarkdownBody } from '../../content/legal/markdown-body';
import { loadLegalMarkdown } from '../../content/legal/load-legal-markdown';
import { LandingHeader } from './LandingHeader';

/**
 * Публичная оферта платформы Svels для заведений.
 */
export async function OfferPage() {
  const source = await loadLegalMarkdown('offer.md');

  return (
    <div className="privacy-policy" data-testid="offer-page">
      <LandingHeader />

      <main className="privacy-policy__main privacy-policy__container legal-doc">
        <LegalMarkdownBody source={source} />
      </main>
    </div>
  );
}
