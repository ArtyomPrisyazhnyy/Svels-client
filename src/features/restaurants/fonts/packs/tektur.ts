import { Tektur } from 'next/font/google';

export const restaurantTektur = Tektur({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-rs-tektur',
  display: 'swap',
  preload: false,
});
