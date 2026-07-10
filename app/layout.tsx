import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';
import '@/shared/styles/glass-header.scss';
import '@/shared/styles/byn-sign.scss';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'),
  title: {
    default: 'Svels — бронирование столов и предзаказы',
    template: '%s | Svels',
  },
  description:
    'Svels помогает гостям быстро забронировать стол и оформить предзаказ, а ресторанам — принимать заявки и управлять меню онлайн.',
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
