export type RestaurantFontFamily =
  | 'system'
  | 'inter'
  | 'georgia'
  | 'montserrat'
  | 'playfair'
  | 'gothic60'
  | 'marmelad'
  | 'comfortaa'
  | 'comicRelief'
  | 'roboto'
  | 'tektur'
  | 'play';

export type RestaurantColorTheme =
  | 'classic'
  | 'ocean'
  | 'forest'
  | 'warm'
  | 'berry'
  | 'lavender'
  | 'midnight'
  | 'ember'
  | 'obsidian'
  | 'moss'
  | 'wine'
  | 'sand'
  | 'citrus'
  | 'graphite'
  | 'monochrome'
  | 'monochromeDark'
  | 'neon'
  | 'svelsGuest';

export type RestaurantCurrencyDisplay = 'byn_glyph' | 'byn' | 'r' | 'rub';

export type RestaurantButtonShape = 'rounded' | 'pill';

export type RestaurantButtonVariant = 'filled' | 'outline' | 'soft';

export type RestaurantSwitcherStyle = 'pill' | 'segmented' | 'tabs';

export type RestaurantCardStyle =
  | 'classic'
  | 'elevated'
  | 'overlay'
  | 'minimal'
  | 'glass'
  | 'magazine';

/** Компоновка журнальной карточки (при cardStyle = magazine). */
export type MagazineCardLayout = 'content_left' | 'media_left';

export type RestaurantHeaderStyle = 'glass' | 'solid' | 'bordered';

export type RestaurantFooterLayout = 'columns' | 'centered' | 'minimal';

export type RestaurantFooterAccent = 'flat' | 'tinted' | 'top-border';

export interface RestaurantStyling {
  restaurantId: string;
  fontFamily: RestaurantFontFamily;
  colorTheme: RestaurantColorTheme;
  currencyDisplay: RestaurantCurrencyDisplay;
  buttonShape: RestaurantButtonShape;
  buttonVariant: RestaurantButtonVariant;
  switcherStyle: RestaurantSwitcherStyle;
  cardStyle: RestaurantCardStyle;
  magazineCardLayout: MagazineCardLayout;
  menuCategoryNavEnabled: boolean;
  favoritesEnabled: boolean;
  headerStyle: RestaurantHeaderStyle;
  footerLayout: RestaurantFooterLayout;
  footerAccent: RestaurantFooterAccent;
  updatedAt: string;
}

export type UpdateRestaurantStylingPayload = Partial<
  Pick<
    RestaurantStyling,
    | 'fontFamily'
    | 'colorTheme'
    | 'currencyDisplay'
    | 'buttonShape'
    | 'buttonVariant'
    | 'switcherStyle'
    | 'cardStyle'
    | 'magazineCardLayout'
    | 'menuCategoryNavEnabled'
    | 'favoritesEnabled'
    | 'headerStyle'
    | 'footerLayout'
    | 'footerAccent'
  >
>;

export interface RestaurantFontOption {
  value: RestaurantFontFamily;
  label: string;
  sample: string;
}

export interface RestaurantColorThemeOption {
  value: RestaurantColorTheme;
  label: string;
  description: string;
  swatches: [string, string, string];
}

export interface RestaurantCurrencyOption {
  value: RestaurantCurrencyDisplay;
  label: string;
  description: string;
}

export const DEFAULT_RESTAURANT_STYLING = {
  fontFamily: 'system' as const,
  colorTheme: 'classic' as const,
  currencyDisplay: 'byn_glyph' as const,
  buttonShape: 'rounded' as const,
  buttonVariant: 'filled' as const,
  switcherStyle: 'pill' as const,
  cardStyle: 'classic' as const,
  magazineCardLayout: 'content_left' as const,
  menuCategoryNavEnabled: false,
  favoritesEnabled: true,
  headerStyle: 'glass' as const,
  footerLayout: 'columns' as const,
  footerAccent: 'flat' as const,
};

export const RESTAURANT_FONT_OPTIONS: RestaurantFontOption[] = [
  { value: 'system', label: 'Системный', sample: 'Aa Бb 123' },
  { value: 'inter', label: 'Inter', sample: 'Aa Бb 123' },
  { value: 'georgia', label: 'Georgia', sample: 'Aa Бb 123' },
  { value: 'montserrat', label: 'Montserrat', sample: 'Aa Бb 123' },
  { value: 'playfair', label: 'Playfair Display', sample: 'Aa Бb 123' },
  { value: 'gothic60', label: 'Gothic №60', sample: 'Aa Бb 123' },
  { value: 'marmelad', label: 'Marmelad', sample: 'Aa Бb 123' },
  { value: 'comfortaa', label: 'Comfortaa', sample: 'Aa Бb 123' },
  { value: 'comicRelief', label: 'Comic Relief', sample: 'Aa Бb 123' },
  { value: 'roboto', label: 'Roboto', sample: 'Aa Бb 123' },
  { value: 'tektur', label: 'Tektur', sample: 'Aa Бb 123' },
  { value: 'play', label: 'Play', sample: 'Aa Бb 123' },
];

export const RESTAURANT_COLOR_THEME_OPTIONS: RestaurantColorThemeOption[] = [
  {
    value: 'classic',
    label: 'Классическая',
    description: 'Текущее оформление — бирюзовые акценты и синие кнопки',
    swatches: ['#0f766e', '#2563eb', '#f8fafc'],
  },
  {
    value: 'ocean',
    label: 'Океан',
    description: 'Спокойные синие оттенки',
    swatches: ['#0369a1', '#0284c7', '#f0f9ff'],
  },
  {
    value: 'forest',
    label: 'Лес',
    description: 'Натуральные зелёные тона',
    swatches: ['#15803d', '#16a34a', '#f0fdf4'],
  },
  {
    value: 'warm',
    label: 'Тёплая',
    description: 'Янтарные и терракотовые акценты',
    swatches: ['#c2410c', '#ea580c', '#fff7ed'],
  },
  {
    value: 'berry',
    label: 'Ягодная',
    description: 'Бордовые и розовые акценты',
    swatches: ['#be123c', '#e11d48', '#fff1f2'],
  },
  {
    value: 'lavender',
    label: 'Лавандовая',
    description: 'Мягкие фиолетовые оттенки',
    swatches: ['#7c3aed', '#8b5cf6', '#faf5ff'],
  },
  {
    value: 'sand',
    label: 'Песочная',
    description: 'Нейтральные бежевые и кофейные тона',
    swatches: ['#92400e', '#b45309', '#faf8f5'],
  },
  {
    value: 'citrus',
    label: 'Цитрус',
    description: 'Солнечные жёлтые акценты',
    swatches: ['#ca8a04', '#eab308', '#fefce8'],
  },
  {
    value: 'graphite',
    label: 'Графит',
    description: 'Сдержанная серая палитра',
    swatches: ['#52525b', '#3f3f46', '#f4f4f5'],
  },
  {
    value: 'monochrome',
    label: 'Монохром',
    description: 'Чёрно-белый контраст — чистый белый фон и чёрные акценты',
    swatches: ['#0a0a0a', '#000000', '#ffffff'],
  },
  {
    value: 'monochromeDark',
    label: 'Чёрно-белая',
    description: 'Антоним монохрома — чёрный фон и белый текст',
    swatches: ['#ffffff', '#e5e5e5', '#000000'],
  },
  {
    value: 'midnight',
    label: 'Полночь',
    description: 'Тёмное оформление с синими акцентами',
    swatches: ['#38bdf8', '#3b82f6', '#0f172a'],
  },
  {
    value: 'ember',
    label: 'Угли',
    description: 'Тёплый тёмный фон с янтарными акцентами',
    swatches: ['#fb923c', '#f97316', '#1c1917'],
  },
  {
    value: 'obsidian',
    label: 'Обсидиан',
    description: 'Глубокий чёрный с фиолетовыми акцентами',
    swatches: ['#a78bfa', '#8b5cf6', '#09090b'],
  },
  {
    value: 'moss',
    label: 'Ночной лес',
    description: 'Тёмно-зелёное оформление с изумрудными акцентами',
    swatches: ['#34d399', '#10b981', '#052e16'],
  },
  {
    value: 'wine',
    label: 'Винная',
    description: 'Бордовый тёмный фон с розовыми акцентами',
    swatches: ['#fb7185', '#f43f5e', '#1a0a0f'],
  },
  {
    value: 'neon',
    label: 'Неон',
    description: 'Глубокий чёрный фон с яркими неоновыми розовыми акцентами',
    swatches: ['#ff3d8b', '#ec4899', '#06040a'],
  },
  {
    value: 'svelsGuest',
    label: 'Svels гостевой',
    description: 'Белый фон, бирюзовые кнопки и коралловые акценты',
    swatches: ['#0f766e', '#f2795b', '#ffffff'],
  },
];

export const RESTAURANT_CURRENCY_OPTIONS: RestaurantCurrencyOption[] = [
  {
    value: 'byn_glyph',
    label: 'Знак BYN',
    description: 'Официальный графический знак белорусского рубля',
  },
  { value: 'byn', label: 'BYN', description: 'Текстовое обозначение BYN' },
  { value: 'r', label: 'р', description: 'Краткое «р» после суммы' },
  { value: 'rub', label: 'руб', description: 'Полное «руб» после суммы' },
];

export interface RestaurantButtonShapeOption {
  value: RestaurantButtonShape;
  label: string;
  description: string;
}

export interface RestaurantButtonVariantOption {
  value: RestaurantButtonVariant;
  label: string;
  description: string;
}

export interface RestaurantSwitcherStyleOption {
  value: RestaurantSwitcherStyle;
  label: string;
  description: string;
}

export const RESTAURANT_BUTTON_SHAPE_OPTIONS: RestaurantButtonShapeOption[] = [
  {
    value: 'rounded',
    label: 'Скруглённые',
    description: 'Умеренное скругление углов',
  },
  {
    value: 'pill',
    label: 'Капсула',
    description: 'Полностью скруглённые кнопки',
  },
];

export const RESTAURANT_BUTTON_VARIANT_OPTIONS: RestaurantButtonVariantOption[] = [
  {
    value: 'filled',
    label: 'Заливка',
    description: 'Яркие кнопки с цветным фоном',
  },
  {
    value: 'outline',
    label: 'Контур',
    description: 'Прозрачный фон и цветная обводка',
  },
  {
    value: 'soft',
    label: 'Мягкие',
    description: 'Светлый фон и цветной текст',
  },
];

export const RESTAURANT_SWITCHER_STYLE_OPTIONS: RestaurantSwitcherStyleOption[] = [
  {
    value: 'pill',
    label: 'Капсула',
    description: 'Плавающий индикатор, как в iOS',
  },
  {
    value: 'segmented',
    label: 'Сегменты',
    description: 'Отдельные блоки с заливкой активного пункта',
  },
  {
    value: 'tabs',
    label: 'Вкладки',
    description: 'Подчёркивание активного способа получения',
  },
];

export interface RestaurantCardStyleOption {
  value: RestaurantCardStyle;
  label: string;
  description: string;
}

export interface RestaurantHeaderStyleOption {
  value: RestaurantHeaderStyle;
  label: string;
  description: string;
}

export interface RestaurantFooterLayoutOption {
  value: RestaurantFooterLayout;
  label: string;
  description: string;
}

export interface RestaurantFooterAccentOption {
  value: RestaurantFooterAccent;
  label: string;
  description: string;
}

export interface MagazineCardLayoutOption {
  value: MagazineCardLayout;
  label: string;
  description: string;
}

export const RESTAURANT_CARD_STYLE_OPTIONS: RestaurantCardStyleOption[] = [
  {
    value: 'classic',
    label: 'Классическая',
    description: 'Вертикальная карточка с рамкой и тенью на hover',
  },
  {
    value: 'elevated',
    label: 'Парящая',
    description: 'Без рамки, мягкая тень всегда, скруглённое фото',
  },
  {
    value: 'overlay',
    label: 'Поверх фото',
    description: 'Текст поверх изображения с градиентным затемнением',
  },
  {
    value: 'minimal',
    label: 'Минимальная',
    description: 'Без рамки и тени, максимум воздуха, акцент на типографике',
  },
  {
    value: 'glass',
    label: 'Стекло',
    description: 'Полупрозрачный фон с размытием, тонкая рамка',
  },
  {
    value: 'magazine',
    label: 'Журнальная',
    description: 'Горизонтальная компоновка, крупный заголовок',
  },
];

export const MAGAZINE_CARD_LAYOUT_OPTIONS: MagazineCardLayoutOption[] = [
  {
    value: 'content_left',
    label: 'Текст слева, фото справа',
    description: 'Текущий вид: название и цена слева, изображение справа',
  },
  {
    value: 'media_left',
    label: 'Фото слева, текст справа',
    description: 'Изображение слева, название и цена справа',
  },
];

export const RESTAURANT_HEADER_STYLE_OPTIONS: RestaurantHeaderStyleOption[] = [
  {
    value: 'glass',
    label: 'Стекло',
    description: 'Полупрозрачный размытый фон (matte glass)',
  },
  {
    value: 'solid',
    label: 'Плотный',
    description: 'Непрозрачный фон с лёгкой тенью снизу',
  },
  {
    value: 'bordered',
    label: 'С рамкой',
    description: 'Прозрачный фон, только тонкая нижняя разделительная линия',
  },
];

export const RESTAURANT_FOOTER_LAYOUT_OPTIONS: RestaurantFooterLayoutOption[] = [
  {
    value: 'columns',
    label: 'Колонки',
    description: 'Бренд слева, навигация и соцсети колонками справа',
  },
  {
    value: 'centered',
    label: 'По центру',
    description: 'Все блоки выровнены по центру, одна колонка',
  },
  {
    value: 'minimal',
    label: 'Минималистичный',
    description: 'Только бренд и нижняя строка, без колонок навигации',
  },
];

export const RESTAURANT_FOOTER_ACCENT_OPTIONS: RestaurantFooterAccentOption[] = [
  {
    value: 'flat',
    label: 'Плоский',
    description: 'Нейтральный фон, тонкая разделительная линия',
  },
  {
    value: 'tinted',
    label: 'Тонированный',
    description: 'Фон с лёгким оттенком акцентного цвета',
  },
  {
    value: 'top-border',
    label: 'Акцентная полоса',
    description: 'Яркая полоса акцентного цвета сверху футера',
  },
];

export function createDefaultRestaurantStyling(restaurantId: string): RestaurantStyling {
  return {
    restaurantId,
    ...DEFAULT_RESTAURANT_STYLING,
    updatedAt: new Date().toISOString(),
  };
}
