import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3001';
const OUT_DIR = '/opt/cursor/artifacts/screenshots';

const headerCaptures = [
  { name: 'loyalty-flame-header-states-390-classic.png', theme: 'classic' },
  { name: 'loyalty-flame-header-states-390-midnight.png', theme: 'midnight' },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

for (const capture of headerCaptures) {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${BASE}/dev/loyalty-flame?theme=${capture.theme}&view=states`, {
    waitUntil: 'networkidle',
  });
  await page.getByTestId('loyalty-flame-states-showcase').waitFor({ state: 'visible' });
  await page.screenshot({
    path: path.join(OUT_DIR, capture.name),
    fullPage: false,
  });
  console.log('saved', capture.name);
}

await browser.close();
