import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3001';
const OUT_DIR = '/opt/cursor/artifacts/screenshots';

const captures = [
  { width: 390, theme: 'classic', name: 'loyalty-flame-modal-390-classic.png' },
  { width: 390, theme: 'midnight', name: 'loyalty-flame-modal-390-midnight.png' },
  { width: 1280, theme: 'classic', name: 'loyalty-flame-modal-1280-classic.png' },
  { width: 1280, theme: 'midnight', name: 'loyalty-flame-modal-1280-midnight.png' },
] ;

fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

for (const capture of captures) {
  await page.setViewportSize({ width: capture.width, height: 900 });
  await page.goto(`${BASE}/dev/loyalty-flame?theme=${capture.theme}`);
  await page.getByTestId('loyalty-flame-info-modal').waitFor({ state: 'visible' });
  await page.screenshot({
    path: path.join(OUT_DIR, capture.name),
  });
  console.log('saved', capture.name);
}

await browser.close();
