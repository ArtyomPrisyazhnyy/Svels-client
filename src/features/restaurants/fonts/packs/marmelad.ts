import { Marmelad } from 'next/font/google';

export const restaurantMarmelad = Marmelad({
  weight: '400',
  subsets: ['cyrillic', 'latin'],
  variable: '--font-rs-marmelad',
  display: 'swap',
  preload: false,
});
