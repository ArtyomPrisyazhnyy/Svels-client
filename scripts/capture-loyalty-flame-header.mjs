import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3001';
const OUT_DIR = '/opt/cursor/artifacts/screenshots';

const headerCaptures = [
  { name: 'loyalty-flame-header-states-390-classic.png', theme: 'classic', view: 'states' },
  { name: 'loyalty-flame-header-states-390-midnight.png', theme: 'midnight', view: 'states' },
  {
    name: 'loyalty-flame-header-bar-390-classic.png',
    theme: 'classic',
    view: 'header-bar',
  },
  {
    name: 'loyalty-flame-header-bar-390-midnight.png',
    theme: 'midnight',
    view: 'header-bar',
  },
  {
    name: 'loyalty-flame-contrast-matrix-full.png',
    theme: null,
    view: 'matrix',
    viewport: { width: 1200, height: 900 },
    fullPage: true,
  },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

for (const capture of headerCaptures) {
  const viewport = capture.viewport ?? { width: 390, height: 900 };
  await page.setViewportSize(viewport);
  const themeQuery = capture.theme ? `theme=${capture.theme}&` : '';
  await page.goto(`${BASE}/dev/loyalty-flame?${themeQuery}view=${capture.view}`, {
    waitUntil: 'networkidle',
  });

  const readyTestId =
    capture.view === 'matrix' ? 'loyalty-flame-contrast-matrix' : 'loyalty-flame-capture-page';
  await page.getByTestId(readyTestId).waitFor({ state: 'visible' });

  if (capture.view === 'header-bar') {
    await page.getByTestId('venue-header').waitFor({ state: 'visible' });
  }

  await page.screenshot({
    path: path.join(OUT_DIR, capture.name),
    fullPage: Boolean(capture.fullPage),
  });
  console.log('saved', capture.name);
}

await browser.close();
