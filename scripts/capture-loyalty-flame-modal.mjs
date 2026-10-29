import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3001';
const OUT_DIR = '/opt/cursor/artifacts/screenshots';

const captures = [
  { width: 390, theme: 'classic', state: 'active' },
  { width: 390, theme: 'classic', state: 'idle' },
  { width: 390, theme: 'midnight', state: 'active' },
  { width: 390, theme: 'midnight', state: 'idle' },
  { width: 1280, theme: 'classic', state: 'active' },
  { width: 1280, theme: 'classic', state: 'idle' },
  { width: 1280, theme: 'midnight', state: 'active' },
  { width: 1280, theme: 'midnight', state: 'idle' },
];

function fileName({ width, theme, state }) {
  return `loyalty-flame-modal-${state}-${width}-${theme}.png`;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

for (const capture of captures) {
  const name = fileName(capture);
  await page.setViewportSize({ width: capture.width, height: 900 });
  await page.goto(
    `${BASE}/dev/loyalty-flame?theme=${capture.theme}&state=${capture.state}`,
    { waitUntil: 'networkidle' },
  );
  await page.getByTestId('loyalty-flame-button').click();
  const panel = page.getByTestId('loyalty-flame-info-panel');
  await expect(panel).toHaveClass(/ui-overlay-panel--active/);
  await expect(page.locator('.ui-modal__backdrop--active')).toBeVisible();
  await expect(page.getByTestId('loyalty-flame-info-title')).toHaveText('Огонёк лояльности');
  await page.waitForTimeout(250);
  await page.screenshot({
    path: path.join(OUT_DIR, name),
    fullPage: false,
  });
  console.log('saved', name);
}

await browser.close();
