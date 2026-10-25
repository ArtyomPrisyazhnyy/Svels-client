import { Roboto } from 'next/font/google';

export const restaurantRoboto = Roboto({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-rs-roboto',
  display: 'swap',
  preload: false,
});
