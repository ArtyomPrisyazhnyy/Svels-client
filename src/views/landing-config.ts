/** URL демо-заведения для CTA лендинга (без хардкода реальных брендов). */
export function getDemoRestaurantUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_DEMO_RESTAURANT_URL?.trim();
  if (fromEnv) {
    return fromEnv;
  }
  return '/restaurants/demo';
}

export interface LandingBenefitCard {
  title: string;
  text: string;
  icon: 'commission' | 'loyalty' | 'cart' | 'telegram';
}

export const LANDING_BENEFITS: LandingBenefitCard[] = [
  {
    icon: 'commission',
    title: 'Заказы без комиссии',
    text:
      'Агрегаторы и платформы берут процент с каждого заказа. У Svels — фиксированная подписка: чем больше заказов, тем больше вы экономите.',
  },
  {
    icon: 'loyalty',
    title: 'Гости возвращаются',
    text:
      'Личный кабинет, история заказов и программа лояльности с визитами. Гость заказывает у вас снова — а не ищет в агрегаторе.',
  },
  {
    icon: 'cart',
    title: 'Корзина, которая не мешает заказать',
    text:
      'Оформление в два шага, телефон и имя подставляются сами, оплата картой онлайн. Меньше брошенных корзин.',
  },
  {
    icon: 'telegram',
    title: 'Ни одного пропущенного заказа',
    text:
      'Новые заказы приходят в Telegram персонала с кнопками «Принять» и «Отклонить». Не нужно держать открытой админку.',
  },
];

export interface LandingAudienceCard {
  title: string;
  text: string;
}

export const LANDING_AUDIENCE: LandingAudienceCard[] = [
  {
    title: 'Кафе и рестораны',
    text: 'Доставка, самовывоз и заказ к столу. Несколько точек — одна админка.',
  },
  {
    title: 'Кофейни',
    text: 'Заказ навынос к нужному времени: гость забирает кофе без очереди.',
  },
  {
    title: 'Цветочные',
    text: 'Каталог букетов, доставка другому человеку с отдельным получателем.',
  },
  {
    title: 'Сети',
    text: 'У каждой точки своё меню и адрес, общий бренд и база гостей.',
  },
];

export interface LandingLiveScreen {
  id: string;
  caption: string;
  kind: 'image' | 'telegram';
  imageSrc?: string;
  width?: number;
  height?: number;
}

export const LANDING_LIVE_SCREENS: LandingLiveScreen[] = [
  {
    id: 'menu',
    caption: 'Меню в стиле заведения',
    kind: 'image',
    imageSrc: '/landing/menu.webp',
  },
  {
    id: 'cart',
    caption: 'Корзина в два шага',
    kind: 'image',
    imageSrc: '/landing/cart-mobile.webp',
  },
  {
    id: 'telegram',
    caption: 'Заказ в Telegram персонала',
    kind: 'telegram',
  },
  {
    id: 'admin',
    caption: 'Админка: заказы и меню',
    kind: 'image',
    imageSrc: '/landing/admin-orders.webp',
    width: 1280,
    height: 720,
  },
];
