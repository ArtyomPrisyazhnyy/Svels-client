import type { Metadata } from 'next';
import { OfferPage } from '@/views/OfferPage';
import '@/views/landing.scss';
import '@/views/privacy-policy.scss';

export const metadata: Metadata = {
  title: 'Публичная оферта',
  description: 'Публичная оферта на оказание услуг платформы Svels.',
};

export default function OfferRoute() {
  return <OfferPage />;
}
