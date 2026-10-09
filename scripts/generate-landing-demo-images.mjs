import { chromium } from '@playwright/test';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('public/landing/demo');
fs.mkdirSync(OUT, { recursive: true });

const tiles = [
  { name: 'cappuccino', label: 'Капучино', colors: ['#3d2b1f', '#c4a574', '#f5e6d3'] },
  { name: 'raf', label: 'Раф', colors: ['#5c3d2e', '#e8c9a8', '#fff8f0'] },
  { name: 'croissant', label: 'Круассан', colors: ['#8b5a2b', '#f0c987', '#ffe8c2'] },
  { name: 'cheesecake', label: 'Чизкейк', colors: ['#f8f4ef', '#f2d9a6', '#e8b86d'] },
  { name: 'banner', label: 'Завтраки', colors: ['#0f766e', '#14b8a6', '#ecfdf5'], wide: true },
  { name: 'logo', label: 'Чайка', colors: ['#0f766e', '#14b8a6', '#ffffff'], square: true },
];

function tileHtml({ label, colors, wide, square }) {
  const w = wide ? 800 : square ? 400 : 400;
  const h = wide ? 200 : square ? 400 : 400;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
  body{margin:0;width:${w}px;height:${h}px;overflow:hidden;font-family:system-ui,sans-serif}
  .bg{width:100%;height:100%;background:linear-gradient(135deg,${colors[0]},${colors[1]} 55%,${colors[2]})}
  .label{position:absolute;left:16px;bottom:14px;color:#fff;font-weight:700;font-size:${wide ? 28 : 22}px;text-shadow:0 2px 12px rgba(0,0,0,.35)}
  svg{position:absolute;right:12px;top:12px;opacity:.35}
  </style></head><body><div class="bg"></div>
  <svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="48" fill="rgba(255,255,255,.25)"/></svg>
  <div class="label">${label}</div></body></html>`;
}

function toWebp(png, webp) {
  execSync(`cwebp -q 84 "${png}" -o "${webp}"`, { stdio: 'inherit' });
  fs.unlinkSync(png);
}

export async function generateLandingDemoImages() {
const browser = await chromium.launch();
const page = await browser.newPage();
for (const tile of tiles) {
  const html = tileHtml(tile);
  const w = tile.wide ? 800 : 400;
  const h = tile.wide ? 200 : 400;
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(html, { waitUntil: 'networkidle' });
  const png = path.join(OUT, `${tile.name}.png`);
  await page.screenshot({ path: png });
  toWebp(png, path.join(OUT, `${tile.name}.webp`));
}
await browser.close();
console.log('Demo menu images →', OUT);
}

import { fileURLToPath } from 'node:url';
const entry = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (entry && entry === fileURLToPath(import.meta.url)) {
  await generateLandingDemoImages();
}
