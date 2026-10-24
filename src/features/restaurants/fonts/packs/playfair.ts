import { Playfair_Display } from 'next/font/google';

export const restaurantPlayfair = Playfair_Display({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-rs-playfair',
  display: 'swap',
  preload: false,
});
