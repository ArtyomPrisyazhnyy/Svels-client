import type { Metadata } from 'next';
import { PrivacyPolicyPage } from '@/views/PrivacyPolicyPage';
import '@/views/landing.scss';
import '@/views/privacy-policy.scss';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description: 'Политика конфиденциальности сервиса Svels.',
};

export default function PrivacyPolicyRoute() {
  return <PrivacyPolicyPage />;
}
