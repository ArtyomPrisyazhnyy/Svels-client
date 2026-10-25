import { Play } from 'next/font/google';

export const restaurantPlay = Play({
  weight: ['400', '700'],
  subsets: ['cyrillic', 'latin'],
  variable: '--font-rs-play',
  display: 'swap',
  preload: false,
});
