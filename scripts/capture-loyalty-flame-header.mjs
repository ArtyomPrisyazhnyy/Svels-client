import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3001';
const OUT_DIR = '/opt/cursor/artifacts/screenshots';

const captures = [
  {
    name: 'loyalty-flame-header-states-390-classic.png',
    url: `${BASE}/dev/loyalty-flame?theme=classic&view=states`,
    testId: 'loyalty-flame-states-showcase',
    viewport: { width: 390, height: 900 },
    deviceScaleFactor: 3,
    fullPage: false,
  },
  {
    name: 'loyalty-flame-header-states-390-midnight.png',
    url: `${BASE}/dev/loyalty-flame?theme=midnight&view=states`,
    testId: 'loyalty-flame-states-showcase',
    viewport: { width: 390, height: 900 },
    deviceScaleFactor: 3,
    fullPage: false,
  },
  {
    name: 'loyalty-flame-header-states-390-monochrome.png',
    url: `${BASE}/dev/loyalty-flame?theme=monochrome&view=states`,
    testId: 'loyalty-flame-states-showcase',
    viewport: { width: 390, height: 900 },
    deviceScaleFactor: 3,
    fullPage: false,
  },
  {
    name: 'loyalty-flame-header-bar-390-classic.png',
    url: `${BASE}/dev/loyalty-flame?theme=classic&view=header-bar`,
    testId: 'loyalty-flame-capture-page',
    viewport: { width: 390, height: 900 },
    deviceScaleFactor: 3,
    fullPage: false,
  },
  {
    name: 'loyalty-flame-header-bar-390-midnight.png',
    url: `${BASE}/dev/loyalty-flame?theme=midnight&view=header-bar`,
    testId: 'loyalty-flame-capture-page',
    viewport: { width: 390, height: 900 },
    deviceScaleFactor: 3,
    fullPage: false,
  },
  {
    name: 'loyalty-flame-contrast-matrix-part1.png',
    url: `${BASE}/dev/loyalty-flame?view=matrix&part=1`,
    testId: 'loyalty-flame-contrast-matrix',
    viewport: { width: 1280, height: 1400 },
    deviceScaleFactor: 2,
    fullPage: true,
  },
  {
    name: 'loyalty-flame-contrast-matrix-part2.png',
    url: `${BASE}/dev/loyalty-flame?view=matrix&part=2`,
    testId: 'loyalty-flame-contrast-matrix',
    viewport: { width: 1280, height: 1400 },
    deviceScaleFactor: 2,
    fullPage: true,
  },
  {
    name: 'loyalty-flame-contrast-matrix-part3.png',
    url: `${BASE}/dev/loyalty-flame?view=matrix&part=3`,
    testId: 'loyalty-flame-contrast-matrix',
    viewport: { width: 1280, height: 1200 },
    deviceScaleFactor: 2,
    fullPage: true,
  },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();

for (const capture of captures) {
  const context = await browser.newContext({
    deviceScaleFactor: capture.deviceScaleFactor,
  });
  const page = await context.newPage();
  await page.setViewportSize(capture.viewport);
  await page.goto(capture.url, { waitUntil: 'networkidle' });
  await page.getByTestId(capture.testId).waitFor({ state: 'visible' });
  await page.screenshot({
    path: path.join(OUT_DIR, capture.name),
    fullPage: capture.fullPage,
  });
  console.log('saved', capture.name);
  await context.close();
}

const zoomContext = await browser.newContext({ deviceScaleFactor: 4 });
const zoomPage = await zoomContext.newPage();
await zoomPage.setViewportSize({ width: 1280, height: 900 });

async function captureMatrixRowScreenshot(page, theme, outName) {
  const part = ['classic', 'ocean', 'forest', 'warm', 'berry', 'lavender'].includes(theme)
    ? 1
    : ['sand', 'citrus', 'graphite', 'monochrome', 'monochromeDark', 'midnight'].includes(theme)
      ? 2
      : 3;
  await page.goto(`${BASE}/dev/loyalty-flame?view=matrix&part=${part}`, {
    waitUntil: 'networkidle',
  });
  await page.getByTestId('loyalty-flame-contrast-matrix').waitFor({ state: 'visible' });
  const row = page.getByTestId(`loyalty-flame-matrix-row-${theme}-glass`);
  await row.waitFor({ state: 'visible' });
  const flames = row.locator('.dev-loyalty-flame-capture__matrix-states');
  await flames.screenshot({
    path: path.join(OUT_DIR, outName),
  });
  console.log('saved', outName);
}

await captureMatrixRowScreenshot(
  zoomPage,
  'classic',
  'loyalty-flame-matrix-zoom-classic-glass.png',
);
await captureMatrixRowScreenshot(
  zoomPage,
  'midnight',
  'loyalty-flame-matrix-zoom-midnight-glass.png',
);

const stateCaptures = [
  { theme: 'classic', state: 'off', testId: 'loyalty-flame-state-off' },
  { theme: 'classic', state: 'base', testId: 'loyalty-flame-state-base' },
  { theme: 'classic', state: 'tier-1', testId: 'loyalty-flame-state-tier-1' },
  { theme: 'classic', state: 'tier-2', testId: 'loyalty-flame-state-tier-2' },
  { theme: 'classic', state: 'tier-5', testId: 'loyalty-flame-state-tier-5' },
  { theme: 'monochrome', state: 'off', testId: 'loyalty-flame-state-off' },
  { theme: 'monochrome', state: 'base', testId: 'loyalty-flame-state-base' },
  { theme: 'monochrome', state: 'tier-1', testId: 'loyalty-flame-state-tier-1' },
  { theme: 'monochrome', state: 'tier-2', testId: 'loyalty-flame-state-tier-2' },
  { theme: 'monochrome', state: 'tier-5', testId: 'loyalty-flame-state-tier-5' },
];

const tileContext = await browser.newContext({ deviceScaleFactor: 3 });
const tilePage = await tileContext.newPage();
await tilePage.setViewportSize({ width: 390, height: 900 });

for (const item of stateCaptures) {
  await tilePage.goto(`${BASE}/dev/loyalty-flame?theme=${item.theme}&view=states`, {
    waitUntil: 'networkidle',
  });
  const tile = tilePage.getByTestId(item.testId);
  await tile.waitFor({ state: 'visible' });
  const fileName = `loyalty-flame-header-${item.state}-${item.theme}-390.png`;
  await tile.screenshot({ path: path.join(OUT_DIR, fileName) });
  console.log('saved', fileName);
}

for (const theme of ['classic', 'monochrome']) {
  await tilePage.goto(`${BASE}/dev/loyalty-flame?theme=${theme}&view=states`, {
    waitUntil: 'networkidle',
  });
  const sheet = tilePage.getByTestId('loyalty-flame-states-showcase');
  await sheet.waitFor({ state: 'visible' });
  const fileName = `loyalty-flame-header-combined-sheet-${theme}-390.png`;
  await sheet.screenshot({ path: path.join(OUT_DIR, fileName) });
  console.log('saved', fileName);
}

await tileContext.close();
await zoomContext.close();
await browser.close();
