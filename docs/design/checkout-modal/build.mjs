import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));

const icons = {
  back: '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M12.5 5 7.5 10l5 5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  close: '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>',
  right: '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M7.5 5 12.5 10l-5 5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

const menu = `
  <div class="backdrop" aria-hidden="true">
    <div class="menu">
      <div class="menu__bar"><span>Меню</span><span class="menu__count">3</span></div>
      <div class="menu__pills"><span class="menu__pill">Горячее</span><span class="menu__pill">Салаты</span><span class="menu__pill">Напитки</span></div>
      <div class="menu__card"><span class="menu__ph"></span><span><b>Томлёные рёбра</b><small>72.00 Br</small></span></div>
      <div class="menu__card"><span class="menu__ph"></span><span><b>Салат с фетой</b><small>28.00 Br</small></span></div>
      <div class="menu__card"><span class="menu__ph"></span><span><b>Лимонад домашний</b><small>19.50 Br</small></span></div>
      <div class="menu__card"><span class="menu__ph"></span><span><b>Тирамису</b><small>24.00 Br</small></span></div>
    </div>
    <div class="overlay"></div>
  </div>`;

function header(title) {
  return `
    <header class="bar">
      <div class="bar__slot"><span class="icon-btn" role="img" aria-label="Назад">${icons.back}</span></div>
      <h2 class="bar__title">${title}</h2>
      <div class="bar__slot bar__slot--end"><span class="icon-btn" role="img" aria-label="Закрыть">${icons.close}</span></div>
    </header>`;
}

function chev(up = false) {
  return `<span class="chev${up ? ' chev--up' : ''}">${icons.right}</span>`;
}

function contactsGroup() {
  return `
    <div class="group">
      <div class="navrow"><span class="navrow__label">Имя <em class="req">*</em></span><span class="navrow__value">Артём Присяжный</span>${chev()}</div>
      <div class="navrow"><span class="navrow__label">Телефон <em class="req">*</em></span><span class="navrow__value">+375 29 000-00-01</span>${chev()}</div>
    </div>`;
}

function addressGroup() {
  return `
    <div class="group">
      <div class="cell">
        <span class="cell__k">Улица <em class="req">*</em></span>
        <span class="cell__v">Немига</span>
      </div>
      <div class="cell cell--split">
        <div><span class="cell__k">Дом <em class="req">*</em></span><span class="cell__v">12</span></div>
        <div><span class="cell__k">Квартира</span><span class="cell__v">45</span></div>
      </div>
      <div class="check"><span class="check__box" aria-hidden="true"></span><span>Сохранить адрес для следующих заказов</span></div>
      <div class="chips"><span class="chip chip--on">Дом</span><span class="chip">Работа</span></div>
      <div class="navrow"><span class="navrow__label">Уточнить адрес</span><span class="navrow__value">Подъезд 2</span>${chev(true)}</div>
      <div class="cell cell--three">
        <div><span class="cell__k">Подъезд</span><span class="cell__v">2</span></div>
        <div><span class="cell__k">Этаж</span><span class="cell__v">4</span></div>
        <div><span class="cell__k">Домофон</span><span class="cell__v">45К</span></div>
      </div>
    </div>`;
}

function timeInset(caption) {
  return `
    <div class="inset">
      <div class="seg" role="group" aria-label="Время">
        <span class="seg__opt">Как можно скорее</span>
        <span class="seg__opt seg__opt--on">Ко времени</span>
      </div>
      <div class="select">
        <span><small>${caption}</small><b>Сегодня, 20:15</b></span>
        ${chev()}
      </div>
    </div>`;
}

function detailsGroup(caption) {
  return `
    <div class="group">
      <div class="navrow"><span class="navrow__label">Время</span><span class="navrow__value">Ко времени</span>${chev(true)}</div>
      ${timeInset(caption)}
      <div class="navrow"><span class="navrow__label">Оплата</span><span class="navrow__value">Картой на месте</span>${chev()}</div>
      <div class="navrow"><span class="navrow__label">Комментарий</span><span class="navrow__value">Не указан</span>${chev()}</div>
    </div>`;
}

function footerSplit(primary, { secondary = '', meta = 'Итого' } = {}) {
  const actions = secondary
    ? `<div class="foot__actions"><span class="btn btn--secondary">${secondary}</span><span class="btn btn--primary">${primary}</span></div>`
    : `<span class="btn btn--primary">${primary}</span>`;
  return `
    <footer class="foot foot--split">
      <div class="foot__total"><span class="foot__label">${meta}</span><span class="foot__sum">119.50 Br</span></div>
      ${actions}
    </footer>`;
}

function receipt(modeLine) {
  return `
    <aside class="summary">
      <h3>Ваш заказ</h3>
      <p class="summary__mode">${modeLine}</p>
      <ul>
        <li><span>Томлёные рёбра <em>× 1</em></span><b>72.00</b></li>
        <li><span>Салат с фетой <em>× 1</em></span><b>28.00</b></li>
        <li><span>Лимонад домашний <em>× 1</em></span><b>19.50</b></li>
      </ul>
      <div class="foot__total"><span class="foot__label">Итого</span><span class="foot__sum">119.50 Br</span></div>
      <span class="btn btn--primary">Оформить заказ</span>
      <p class="hint">Картой на месте · Сегодня, 20:15</p>
    </aside>`;
}

function field(label, value, required = false) {
  return `
    <label class="field">
      <span class="field__label">${label}${required ? ' <em class="req">*</em>' : ''}</span>
      <span class="control"><b>${value}</b></span>
    </label>`;
}

function openAddress() {
  return `
    <section class="block">
      <h3>Адрес</h3>
      <div class="stack">
        ${field('Улица', 'Немига', true)}
        <div class="grid-2">
          ${field('Дом', '12', true)}
          ${field('Квартира', '45')}
        </div>
        <div class="check check--plain"><span class="check__box" aria-hidden="true"></span><span>Сохранить адрес для следующих заказов</span></div>
        <div class="chips chips--plain"><span class="chip chip--on">Дом</span><span class="chip">Работа</span></div>
      </div>
    </section>
    <section class="block">
      <h3>Уточнить адрес</h3>
      <div class="grid-3">
        ${field('Подъезд', '2')}
        ${field('Этаж', '4')}
        ${field('Домофон', '45К')}
      </div>
    </section>`;
}

function openTime(caption) {
  return `
    <section class="block">
      <h3>Время</h3>
      <div class="seg"><span class="seg__opt">Как можно скорее</span><span class="seg__opt seg__opt--on">Ко времени</span></div>
      <div class="select"><span><small>${caption}</small><b>Сегодня, 20:15</b></span>${chev()}</div>
    </section>`;
}

function openPay() {
  return `
    <section class="block">
      <h3>Оплата</h3>
      <div class="seg"><span class="seg__opt">Наличными</span><span class="seg__opt seg__opt--on">Картой на месте</span></div>
    </section>`;
}

function openComment() {
  return `
    <section class="block">
      <h3>Комментарий</h3>
      <div class="textarea">Пожелания к заказу</div>
      <span class="counter">0/1000</span>
    </section>`;
}

function variantA(kind) {
  const delivery = kind === 'delivery';
  const title = delivery ? 'Доставка' : 'В зале';
  const caption = delivery ? 'Время доставки' : 'Время получения';
  return `
    ${header(title)}
    <div class="body">
      ${contactsGroup()}
      ${delivery ? addressGroup() : '<div class="linkrow">Забронировать стол</div>'}
      ${detailsGroup(caption)}
    </div>
    ${footerSplit('Оформить заказ')}`;
}

function stepsNav(delivery) {
  const second = delivery ? 'Адрес' : 'Время';
  const secondHint = delivery ? 'Немига, 12' : 'Сегодня, 20:15';
  return `
    <nav class="wizard__nav" aria-label="Шаги">
      <div class="step step--done"><span class="badge">✓</span><span><b>Контакты</b><small>Артём Присяжный</small></span></div>
      <div class="step step--on"><span class="badge">2</span><span><b>${second}</b><small>${secondHint}</small></span></div>
      <div class="step"><span class="badge">3</span><span><b>Оплата</b><small>Картой на месте</small></span></div>
      <div class="step"><span class="badge">4</span><span><b>Подтверждение</b><small>Итог и заказ</small></span></div>
    </nav>`;
}

function progress(delivery) {
  const names = delivery
    ? ['Контакты', 'Адрес', 'Оплата', 'Итог']
    : ['Контакты', 'Время', 'Оплата', 'Итог'];
  return `
    <div class="progress">
      <p class="progress__step">Шаг 2 из 4</p>
      <div class="progress__bars"><i class="on"></i><i class="on"></i><i></i><i></i></div>
      <div class="progress__names">
        <span class="is-done">${names[0]}</span>
        <span class="is-on">${names[1]}</span>
        <span>${names[2]}</span>
        <span>${names[3]}</span>
      </div>
    </div>`;
}

function variantB(kind) {
  const delivery = kind === 'delivery';
  const title = delivery ? 'Куда и когда привезти?' : 'Когда будете в зале?';
  const lead = delivery
    ? 'Адрес сохранится для следующего заказа. Время можно поменять до оплаты.'
    : 'Заказ принесут к столу. Оплату выберете на следующем шаге.';
  const caption = delivery ? 'Время доставки' : 'Время получения';
  return `
    ${header('Оформление')}
    <div class="wizard">
      ${stepsNav(delivery)}
      <div class="wizard__main">
        <div class="body">
          ${progress(delivery)}
          <h3 class="h-step">${title}</h3>
          <p class="lead">${lead}</p>
          ${delivery ? openAddress() : ''}
          ${openTime(caption)}
          ${delivery ? '' : '<div class="linkrow">Забронировать стол</div>'}
        </div>
        ${footerSplit('Далее', { secondary: 'Назад', meta: '3 позиции' })}
      </div>
    </div>`;
}

function variantC(kind) {
  const delivery = kind === 'delivery';
  const title = delivery ? 'Доставка' : 'В зале';
  const caption = delivery ? 'Время доставки' : 'Время получения';
  const mode = delivery ? 'Доставка · Немига, 12, кв. 45' : 'В зале · к 20:15';
  return `
    ${header(title)}
    <div class="cols">
      <div class="body">
        ${receipt(mode)}
        <section class="block">
          <h3>Контакты</h3>
          <div class="stack contacts-grid">
            ${field('Имя', 'Артём Присяжный', true)}
            ${field('Телефон', '+375 29 000-00-01', true)}
          </div>
        </section>
        ${delivery ? openAddress() : '<div class="linkrow">Забронировать стол</div>'}
        ${openTime(caption)}
        ${openPay()}
        ${openComment()}
      </div>
      ${receipt(mode)}
    </div>
    ${footerSplit('Оформить заказ')}`;
}

function page({ id, title, lead, frames }) {
  const shots = frames
    .map(
      (frame) => `
      <figure class="shot">
        <figcaption>${frame.caption}</figcaption>
        <section class="stage stage--${frame.viewport} theme-${frame.theme} ${frame.extraClass || ''}" data-shot="${frame.shot}" data-shape="pill" data-theme="${frame.theme}">
          ${menu}
          <div class="${frame.shell}">
            ${frame.body}
          </div>
        </section>
      </figure>`,
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <link rel="stylesheet" href="./mock.css" />
</head>
<body>
  <header>
    <h1 class="doc-title">${title}</h1>
    <p class="doc-lead">${lead}</p>
  </header>
  <main class="gallery" data-variant="${id}">
    ${shots}
  </main>
</body>
</html>
`;
}

function framesFor(builder, shellFor) {
  const scenarios = [
    ['dine', 'В зале'],
    ['delivery', 'Доставка'],
  ];
  const themes = [
    ['light', 'Светлая'],
    ['dark', 'Тёмная'],
  ];
  const viewports = [
    ['mobile', 'Мобильный'],
    ['desktop', 'ПК'],
  ];
  const frames = [];
  for (const [viewport, viewportLabel] of viewports) {
    for (const [theme, themeLabel] of themes) {
      for (const [kind, kindLabel] of scenarios) {
        const desktop = viewport === 'desktop';
        frames.push({
          shot: `${viewport}-${theme}-${kind === 'dine' ? 'dine' : 'delivery'}`,
          caption: `${viewportLabel} · ${themeLabel} · ${kindLabel}`,
          viewport,
          theme,
          shell: shellFor(viewport),
          body: builder(kind, desktop ? 'desktop' : 'mobile'),
        });
      }
    }
  }
  return frames;
}

const a = page({
  id: 'a',
  title: 'Вариант A. Список, как в настройках',
  lead: 'Одна страница. Контакты, адрес и второстепенные поля — строки. Время раскрыто на месте (в продукте это подшторка). Кнопка залита акцентом.',
  frames: framesFor((kind, vp) => variantA(kind, vp), (viewport) => (viewport === 'mobile' ? 'sheet' : 'modal modal--a')),
});

const b = page({
  id: 'b',
  title: 'Вариант B. Пошаговый чекаут',
  lead: 'Четыре шага: контакты, получение, оплата, подтверждение. На макете открыт шаг 2 — адрес и время для доставки, только время для зала.',
  frames: framesFor((kind) => variantB(kind), (viewport) => (viewport === 'mobile' ? 'sheet' : 'modal modal--b')),
});

const c = page({
  id: 'c',
  title: 'Вариант C. Форма и сводка заказа',
  lead: 'На ПК форма слева, состав и итог справа. На телефоне тот же порядок сверху вниз: состав, поля, липкий итог.',
  frames: framesFor((kind) => variantC(kind), (viewport) => (viewport === 'mobile' ? 'sheet' : 'modal modal--c')),
});

function shapeCard(themeClass, shape, title, note) {
  return `
    <article class="shape-card ${themeClass}" data-shape="${shape}">
      <h3>${title}</h3>
      <p class="hint">${note}</p>
      <label class="field">
        <span class="field__label">Улица <em class="req">*</em></span>
        <span class="control"><b>Немига</b></span>
      </label>
      <div class="seg"><span class="seg__opt">Как можно скорее</span><span class="seg__opt seg__opt--on">Ко времени</span></div>
      <div class="chips chips--plain"><span class="chip chip--on">Дом</span><span class="chip">Работа</span></div>
      <span class="btn btn--primary">Оформить заказ</span>
    </article>`;
}

const shapes = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>Форма кнопок</title>
  <link rel="stylesheet" href="./mock.css" />
</head>
<body>
  <section class="stage stage--board" data-shot="shapes">
    <h2 class="board-title">Форма кнопки заведения</h2>
    <p class="board-lead">Поле всегда с радиусом 12px (--radius-md). Капсула, таблетка и квадрат меняют только кнопку, сегмент и чипы через --rs-btn-radius. Светлая тема — berry, тёмная — wine.</p>
    <div class="board-block">
      <p class="board-kicker">Светлая · berry</p>
      <div class="shape-grid">
        ${shapeCard('theme-light', 'pill', 'Капсула', 'pill · 999px, как сейчас в настройке заведения')}
        ${shapeCard('theme-light', 'tablet', 'Таблетка', 'rounded · 10px, текущий токен продукта')}
        ${shapeCard('theme-light', 'square', 'Квадрат', 'кнопка 0px, обод сегмента +4px как в компоненте')}
      </div>
    </div>
    <div class="board-block">
      <p class="board-kicker">Тёмная · wine</p>
      <div class="shape-grid">
        ${shapeCard('theme-dark', 'pill', 'Капсула', 'pill · 999px')}
        ${shapeCard('theme-dark', 'tablet', 'Таблетка', 'rounded · 10px')}
        ${shapeCard('theme-dark', 'square', 'Квадрат', '0px')}
      </div>
    </div>
  </section>
</body>
</html>
`;

writeFileSync(join(dir, 'a.html'), a);
writeFileSync(join(dir, 'b.html'), b);
writeFileSync(join(dir, 'c.html'), c);
writeFileSync(join(dir, 'shapes.html'), shapes);
console.log('wrote html');
