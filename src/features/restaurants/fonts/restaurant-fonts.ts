import { restaurantComfortaa } from './packs/comfortaa';
import { restaurantComicRelief } from './packs/comic-relief';
import { restaurantInter } from './packs/inter';
import { restaurantMarmelad } from './packs/marmelad';
import { restaurantMontserrat } from './packs/montserrat';
import { restaurantPlay } from './packs/play';
import { restaurantPlayfair } from './packs/playfair';
import { restaurantRoboto } from './packs/roboto';
import { restaurantTektur } from './packs/tektur';

export {
  restaurantInter,
  restaurantMontserrat,
  restaurantPlayfair,
  restaurantMarmelad,
  restaurantComfortaa,
  restaurantComicRelief,
  restaurantRoboto,
  restaurantTektur,
  restaurantPlay,
};

/** Все шрифты для превью в админке (не использовать на публичных страницах). */
export const RESTAURANT_FONT_CLASSES = [
  restaurantInter.variable,
  restaurantMontserrat.variable,
  restaurantPlayfair.variable,
  restaurantMarmelad.variable,
  restaurantComfortaa.variable,
  restaurantComicRelief.variable,
  restaurantRoboto.variable,
  restaurantTektur.variable,
  restaurantPlay.variable,
].join(' ');
