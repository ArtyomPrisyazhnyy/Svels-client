import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const themes = [
  'classic',
  'ocean',
  'forest',
  'warm',
  'berry',
  'lavender',
  'midnight',
  'ember',
  'obsidian',
  'moss',
  'wine',
  'sand',
  'citrus',
  'graphite',
  'monochrome',
  'monochromeDark',
  'neon',
];
const variants = ['network', 'server'];
const viewports = [
  { name: 'm390', width: 390, height: 844 },
  { name: 'd1280', width: 1280, height: 800 },
];

const baseUrl = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3001';
const artifactsDir = path.resolve('/opt/cursor/artifacts/screenshots/error-ui');
const repoDir = path.resolve('e2e/visual/__screenshots__/errors.visual.spec.ts');

async function main() {
  fs.mkdirSync(artifactsDir, { recursive: true });
  fs.mkdirSync(repoDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ locale: 'ru-RU' });

  for (const theme of themes) {
    for (const variant of variants) {
      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(`${baseUrl}/dev/ui/errors?theme=${theme}&variant=${variant}`, {
          waitUntil: 'networkidle',
        });
        const panel = page.getByTestId(`dev-error-${variant}`);
        await panel.waitFor({ state: 'visible' });
        const fileName = `error-${variant}-${theme}-${viewport.name}.png`;
        await panel.screenshot({ path: path.join(artifactsDir, fileName) });
        await panel.screenshot({ path: path.join(repoDir, fileName) });
      }
    }
  }

  await browser.close();
  console.log(`Saved ${themes.length * variants.length * viewports.length} screenshots`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
