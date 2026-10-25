export interface LaunchStep {
  id: string;
  title: string;
  detail: string;
  hint: string;
  cta: string;
  href?: string;
  done: boolean;
  required: boolean;
}

export interface LaunchChecklistInput {
  description: string | null;
  locationCount: number;
  locationSummary: string;
  openDays: number;
  categoryCount: number;
  itemCount: number;
  itemsWithPhoto: number;
  fulfillment: { delivery: boolean; takeaway: boolean; dineIn: boolean };
  payments: { cash: boolean; card: boolean; online: boolean };
  bepaidReady: boolean;
  themeLabel: string | null;
  fontLabel: string | null;
  cardLabel: string | null;
  previewSeen: boolean;
  telegramLinked: boolean;
  appRequested: boolean;
}

export interface LaunchChecklistModel {
  required: LaunchStep[];
  optional: LaunchStep[];
  done: number;
  total: number;
  ready: boolean;
}

const PROFILE_MIN = 20;

function fulfillmentSummary(input: LaunchChecklistInput['fulfillment']): string {
  const parts: string[] = [];
  if (input.delivery) parts.push('доставка');
  if (input.takeaway) parts.push('самовывоз');
  if (input.dineIn) parts.push('в зале');
  return parts.length ? parts.join(', ') : 'ничего не включено';
}

export function buildLaunchChecklist(input: LaunchChecklistInput): LaunchChecklistModel {
  const description = input.description?.trim() ?? '';
  const profileDone = description.length >= PROFILE_MIN;
  const addressDone = input.locationCount > 0;
  const hoursDone = input.openDays > 0;
  const menuDone = input.categoryCount > 0 && input.itemsWithPhoto > 0;
  const stylingLoaded = Boolean(input.themeLabel && input.fontLabel && input.cardLabel);
  const fulfillmentOn =
    input.fulfillment.delivery || input.fulfillment.takeaway || input.fulfillment.dineIn;
  const offlinePay = input.payments.cash || input.payments.card;
  const onlineBlocked = input.payments.online && !input.bepaidReady;
  const ordersDone = fulfillmentOn && (offlinePay || (input.payments.online && input.bepaidReady));

  const required: LaunchStep[] = [
    {
      id: 'profile',
      title: 'О заведении',
      detail: profileDone
        ? 'Короткое описание есть — гости увидят его на сайте.'
        : 'Описания пока нет или оно короче 20 символов.',
      hint: 'Два предложения: что вы продаёте и чем отличаетесь. Пример: «Кофейня на Немиге. Варим фильтр и отдаём десерты с собой».',
      cta: profileDone ? 'Изменить описание' : 'Написать описание',
      done: profileDone,
      required: true,
    },
    {
      id: 'address',
      title: 'Адрес',
      detail: addressDone
        ? input.locationSummary
        : 'Точек нет — гость не поймёт, куда ехать.',
      hint: 'Нужны город, улица и метка на карте. Для одной кофейни хватит одной точки.',
      cta: addressDone ? 'Проверить адрес' : 'Добавить адрес',
      href: '/restaurant-admin/locations',
      done: addressDone,
      required: true,
    },
    {
      id: 'hours',
      title: 'Часы работы',
      detail: hoursDone
        ? `Открыто ${input.openDays} дн. в неделю.`
        : 'Часы не заданы. Бронь слотов тоже берёт время отсюда.',
      hint: 'Для кофейни обычно хватает 10:00–22:00 без выходных. День можно закрыть.',
      cta: hoursDone ? 'Изменить часы' : 'Поставить часы',
      href: '/restaurant-admin/hours',
      done: hoursDone,
      required: true,
    },
    {
      id: 'menu',
      title: 'Меню с фото',
      detail: menuDone
        ? `${input.categoryCount} категор., ${input.itemsWithPhoto} с фото из ${input.itemCount}.`
        : input.categoryCount === 0
          ? 'Категорий ещё нет.'
          : 'Категория есть, но нет позиции с фото.',
      hint: 'Сначала категория («Кофе» или «Букеты»), потом позиция: фото, название и цена. Калории и добавки можно не заполнять.',
      cta: menuDone ? 'Открыть меню' : 'Добавить блюдо',
      href: '/restaurant-admin/menu',
      done: menuDone,
      required: true,
    },
    {
      id: 'styling',
      title: 'Оформление',
      detail: stylingLoaded
        ? `Тема «${input.themeLabel}», шрифт «${input.fontLabel}», карточки «${input.cardLabel}».`
        : 'Не удалось прочитать оформление.',
      hint: 'Классическая тема, системный шрифт и обычные карточки уже стоят. Меняйте, только если хотите другой вид.',
      cta: 'Шрифт, тема и карточки',
      href: '/restaurant-admin/styling',
      done: stylingLoaded,
      required: true,
    },
    {
      id: 'orders',
      title: 'Как получают и платят',
      detail: ordersDone
        ? `Получение: ${fulfillmentSummary(input.fulfillment)}. Оплата на месте ${offlinePay ? 'включена' : 'выключена'}.`
        : 'Нет ни одного способа получения или оплаты, которым гость реально сможет воспользоваться.',
      hint: 'Для старта оставьте самовывоз и зал, оплату наличными и картой на кассе. Доставку включайте, только если сами возите.',
      cta: 'Условия заказа',
      href: '/restaurant-admin/order-settings',
      done: ordersDone,
      required: true,
    },
    {
      id: 'preview',
      title: 'Посмотреть глазами гостя',
      detail: input.previewSeen
        ? 'Предпросмотр открывали в этой вкладке браузера.'
        : 'Вы ещё не открывали страницу так, как её увидит гость.',
      hint: 'Проверьте название, фото и цены. Ссылка для гостей заработает после проверки заявки и уже ведёт на публичную страницу.',
      cta: 'Открыть предпросмотр',
      href: '/restaurant-admin/preview',
      done: input.previewSeen,
      required: true,
    },
  ];

  if (onlineBlocked) {
    required.push({
      id: 'payments',
      title: 'Онлайн-оплата без bePaid',
      detail:
        'Гости могут выбрать оплату картой в приложении, но магазин bePaid не подключён — оплата оборвётся.',
      hint: 'Проще выключить «Онлайн» в условиях заказа и принимать наличные и карту на кассе. Shop ID и Secret Key нужны только если договор с bePaid уже есть.',
      cta: 'Выключить онлайн или подключить bePaid',
      href: '/restaurant-admin/order-settings',
      done: false,
      required: true,
    });
  }

  const optional: LaunchStep[] = [];

  if (!onlineBlocked) {
    optional.push({
      id: 'payments',
      title: 'Онлайн-оплата bePaid',
      detail: input.bepaidReady
        ? 'Магазин bePaid подключён.'
        : 'Онлайн выключен. Гости платят наличными или картой на кассе — для запуска этого достаточно.',
      hint: 'Shop ID — это номер магазина в кабинете bePaid, не УНП и не номер карты.',
      cta: 'Настройки bePaid',
      href: '/restaurant-admin/payment-settings',
      done: !input.payments.online || input.bepaidReady,
      required: false,
    });
  }

  optional.push(
    {
      id: 'telegram',
      title: 'Заказы в Telegram',
      detail: input.telegramLinked
        ? 'Чат подключён — новые заказы придут туда.'
        : 'Чат не подключён. Заказы всё равно видны в разделе «Заказы».',
      hint: 'Нажмите «Получить код», откройте бота и нажмите Start. Если бот не открывается, это настройка Svels, не ваш Telegram.',
      cta: input.telegramLinked ? 'Проверить чат' : 'Подключить Telegram',
      href: '/restaurant-admin/orders',
      done: input.telegramLinked,
      required: false,
    },
    {
      id: 'app',
      title: 'Мобильное приложение',
      detail: input.appRequested
        ? 'Запрос отправлен. Приложение собирает команда Svels и публикует в сторах.'
        : 'Приложение не обязательно, чтобы открыть сайт.',
      hint: 'Нужны телефон и мессенджер. Ставить Xcode или заводить аккаунт разработчика не нужно.',
      cta: input.appRequested ? 'Запрос отправлен' : 'Запросить приложение',
      done: input.appRequested,
      required: false,
    },
  );

  const done = required.filter((step) => step.done).length;
  const total = required.length;

  return {
    required,
    optional,
    done,
    total,
    ready: done === total,
  };
}

export function previewSeenKey(restaurantId: string): string {
  return `svels.launch.previewSeen.${restaurantId}`;
}

export function appRequestedKey(restaurantId: string): string {
  return `svels.launch.appRequested.${restaurantId}`;
}

export function readPreviewSeen(restaurantId: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.sessionStorage.getItem(previewSeenKey(restaurantId)) === '1';
}

export function markPreviewSeen(restaurantId: string): void {
  window.sessionStorage.setItem(previewSeenKey(restaurantId), '1');
}

export function readAppRequested(restaurantId: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(appRequestedKey(restaurantId)) === '1';
}

export function markAppRequested(restaurantId: string): void {
  window.localStorage.setItem(appRequestedKey(restaurantId), '1');
}
