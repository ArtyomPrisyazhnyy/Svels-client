import {
  Comfortaa,
  Comic_Relief,
  Inter,
  Marmelad,
  Montserrat,
  Playfair_Display,
  Roboto,
} from 'next/font/google';

/**
 * Все шрифты ресторанов само-хостятся через next/font.
 * preload: false — браузер грузит только тот @font-face,
 * который реально используется через --rs-font, а не все сразу.
 * next/font автоматически генерирует fallback с метриками
 * (size-adjust/ascent-override) → нет CLS при загрузке шрифта.
 */
export const restaurantInter = Inter({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-rs-inter',
  display: 'swap',
  preload: false,
});

export const restaurantMontserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-rs-montserrat',
  display: 'swap',
  preload: false,
});

export const restaurantPlayfair = Playfair_Display({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-rs-playfair',
  display: 'swap',
  preload: false,
});

export const restaurantMarmelad = Marmelad({
  weight: '400',
  subsets: ['cyrillic', 'latin'],
  variable: '--font-rs-marmelad',
  display: 'swap',
  preload: false,
});

export const restaurantComfortaa = Comfortaa({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-rs-comfortaa',
  display: 'swap',
  preload: false,
});

export const restaurantComicRelief = Comic_Relief({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-rs-comic-relief',
  display: 'swap',
  preload: false,
});

export const restaurantRoboto = Roboto({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-rs-roboto',
  display: 'swap',
  preload: false,
});

/** Классы, определяющие все CSS-переменные шрифтов на корне стилизации. */
export const RESTAURANT_FONT_CLASSES = [
  restaurantInter.variable,
  restaurantMontserrat.variable,
  restaurantPlayfair.variable,
  restaurantMarmelad.variable,
  restaurantComfortaa.variable,
  restaurantComicRelief.variable,
  restaurantRoboto.variable,
].filter(Boolean).join(' ');
