import Link from 'next/link';
import { LegalMarkdownBody } from '../../content/legal/markdown-body';
import {
  applyGuestTermsPlaceholders,
  loadLegalMarkdown,
} from '../../content/legal/load-legal-markdown';
import type { RestaurantLegalFields } from '@/shared/types/restaurant-legal';

interface RestaurantLegalPageProps {
  restaurantName: string;
  legal: RestaurantLegalFields;
  homePath: string;
}

export async function RestaurantLegalPage({
  restaurantName,
  legal,
  homePath,
}: RestaurantLegalPageProps) {
  const template = await loadLegalMarkdown('guest-terms-template.md');
  const source = applyGuestTermsPlaceholders(template, {
    restaurantName,
    legalName: legal.legalName ?? restaurantName,
    legalAddress: legal.legalAddress,
    unp: legal.unp,
    contactPhone: legal.contactPhone,
    contactEmail: legal.contactEmail,
  });

  return (
    <div className="privacy-policy restaurant-legal-page" data-testid="restaurant-legal-page">
      <header className="restaurant-legal-page__header">
        <div className="privacy-policy__container restaurant-legal-page__header-inner">
          <Link href={homePath} className="restaurant-legal-page__back">
            ← {restaurantName}
          </Link>
        </div>
      </header>

      <main className="privacy-policy__main privacy-policy__container legal-doc">
        <LegalMarkdownBody source={source} />
        <p className="restaurant-legal-page__platform">
          <Link href="/privacypolicy">Политика конфиденциальности Svels</Link>
        </p>
      </main>
    </div>
  );
}
