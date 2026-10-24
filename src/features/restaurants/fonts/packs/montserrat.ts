import { Montserrat } from 'next/font/google';

export const restaurantMontserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-rs-montserrat',
  display: 'swap',
  preload: false,
});
