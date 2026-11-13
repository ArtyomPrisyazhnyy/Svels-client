import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

async function loadChromium() {
  try {
    return (await import('playwright')).chromium;
  } catch (error) {
    const fallback = process.env.PLAYWRIGHT_PATH;
    if (!fallback) throw error;
    const url = fallback.endsWith('.mjs') ? fallback : fallback.replace(/index\.js$/, 'index.mjs');
    return (await import(pathToFileURL(url).href)).chromium;
  }
}

const { chromium } = { chromium: await loadChromium() };

const dir = dirname(fileURLToPath(import.meta.url));
const pngDir = join(dir, 'png');
mkdirSync(pngDir, { recursive: true });

const shots = [];

async function shoot(page, file, name) {
  const url = `file://${join(dir, file)}`;
  await page.goto(url);
  const nodes = page.locator('.stage');
  const count = await nodes.count();
  for (let i = 0; i < count; i += 1) {
    const node = nodes.nth(i);
    const id = await node.getAttribute('data-shot');
    const fileName = `${name}-${id}.png`;
    await node.screenshot({ path: join(pngDir, fileName) });
    shots.push({ variant: name, id, fileName });
    console.log(fileName);
  }
}

function collageHtml(variant, title) {
  const frames = shots.filter((shot) => shot.variant === variant && shot.id !== 'shapes');
  const order = [
    'mobile-light-dine',
    'mobile-light-delivery',
    'mobile-dark-dine',
    'mobile-dark-delivery',
    'desktop-light-dine',
    'desktop-light-delivery',
    'desktop-dark-dine',
    'desktop-dark-delivery',
  ];
  const captions = {
    'mobile-light-dine': 'Мобильный · светлая · В зале',
    'mobile-light-delivery': 'Мобильный · светлая · Доставка',
    'mobile-dark-dine': 'Мобильный · тёмная · В зале',
    'mobile-dark-delivery': 'Мобильный · тёмная · Доставка',
    'desktop-light-dine': 'ПК · светлая · В зале',
    'desktop-light-delivery': 'ПК · светлая · Доставка',
    'desktop-dark-dine': 'ПК · тёмная · В зале',
    'desktop-dark-delivery': 'ПК · тёмная · Доставка',
  };
  const card = (id, wide = false) => {
    const shot = frames.find((item) => item.id === id);
    return `<figure class="${wide ? 'wide' : 'phone'}">
      <figcaption>${captions[id]}</figcaption>
      <img src="./png/${shot.fileName}" alt="${captions[id]}" />
    </figure>`;
  };
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; }
    body { width: 1280px; margin: 0; padding: 32px; background: #f8fafc; color: #0f172a; font-family: Inter, system-ui, sans-serif; }
    h1 { margin: 0 0 8px; font-size: 24px; line-height: 1.25; }
    p { margin: 0 0 24px; color: #64748b; font-size: 16px; line-height: 1.45; }
    .row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-bottom: 24px; align-items: start; }
    .desk { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    figure { margin: 0; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
    figcaption { font-size: 14px; font-weight: 600; line-height: 1.25; }
    img { width: 100%; height: auto; display: block; border-radius: 12px; background: #e2e8f0; }
    .shapes { margin-top: 8px; }
    .shapes img { border-radius: 12px; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p>Светлая тема berry, тёмная wine. На кадрах кнопка-капсула. Внизу то же окно при таблетке и квадрате.</p>
  <div class="row">
    ${card('mobile-light-dine')}
    ${card('mobile-light-delivery')}
    ${card('mobile-dark-dine')}
    ${card('mobile-dark-delivery')}
  </div>
  <div class="desk">
    ${card('desktop-light-dine', true)}
    ${card('desktop-light-delivery', true)}
    ${card('desktop-dark-dine', true)}
    ${card('desktop-dark-delivery', true)}
  </div>
  <figure class="shapes">
    <figcaption>Форма кнопки: капсула, таблетка, квадрат</figcaption>
    <img src="./png/shapes-shapes.png" alt="Формы кнопок в светлой и тёмной теме" />
  </figure>
</body>
</html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1600, height: 1200 } });
await shoot(page, 'a.html', 'a');
await shoot(page, 'b.html', 'b');
await shoot(page, 'c.html', 'c');
await shoot(page, 'shapes.html', 'shapes');
await page.close();

const collages = [
  ['a', 'Вариант A. Список, как в настройках'],
  ['b', 'Вариант B. Пошаговый чекаут'],
  ['c', 'Вариант C. Форма и сводка заказа'],
];

const board = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 1400, height: 900 } });
for (const [id, title] of collages) {
  const htmlPath = join(dir, `collage-${id}.html`);
  writeFileSync(htmlPath, collageHtml(id, title));
  await board.goto(`file://${htmlPath}`);
  await board.locator('body').screenshot({ path: join(pngDir, `collage-${id}.png`) });
  console.log(`collage-${id}.png`);
}
await browser.close();
