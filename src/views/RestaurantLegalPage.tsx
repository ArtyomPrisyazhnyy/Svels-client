import Link from 'next/link';
import { LegalMarkdownBody } from '../../content/legal/markdown-body';
import {
  applyGuestTermsPlaceholders,
  loadLegalMarkdown,
} from '../../content/legal/load-legal-markdown';
import type { RestaurantLegalFields } from '@/shared/types/restaurant-legal';
import { PageTitle } from '@/shared/ui/PageTitle/PageTitle';

interface RestaurantLegalPageProps {
  restaurantName: string;
  legal: RestaurantLegalFields;
  homePath: string;
}

export async function RestaurantLegalPage({
  restaurantName,
  legal,
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
    <div className="venue-subpage privacy-policy restaurant-legal-page" data-testid="restaurant-legal-page">
      <main className="venue-subpage__main privacy-policy__main legal-doc">
        <PageTitle title="Реквизиты и условия" testId="restaurant-legal-page-title" />
        <LegalMarkdownBody source={source} />
        <p className="restaurant-legal-page__platform">
          <Link href="/privacypolicy">Политика конфиденциальности Svels</Link>
        </p>
      </main>
    </div>
  );
}
