import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';
import '@/shared/styles/glass-header.scss';
import '@/shared/styles/byn-sign.scss';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'),
  title: {
    default: 'Svels — сайт и приложение для заказов в вашем заведении',
    template: '%s | Svels',
  },
  description:
    'Онлайн-заказы на доставку, самовывоз и в зале на вашем сайте и в приложении под вашим брендом. Без процента с выручки. Запуск за несколько дней.',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Svels',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
