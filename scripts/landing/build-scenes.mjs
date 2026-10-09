#!/usr/bin/env node
/**
 * Offline landing device scenes → responsive AVIF/WebP/PNG + manifest.
 * iPhone frame styling inspired by devices.css (MIT, picturepan2) — see scene-studio.html.
 */
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const RAW = path.join(ROOT, 'scripts/landing/raw');
const OUT = path.join(ROOT, 'public/landing/scenes');
const MANIFEST = path.join(ROOT, 'src/views/landing-scenes.manifest.json');
const STUDIO = path.join(ROOT, 'scripts/landing/scene-studio.html');
const DOMAIN = 'chayka-coffee.by';

const HERO_WIDTHS = [480, 768, 1080, 1600];
const FEATURE_WIDTHS = [360, 540, 720];

function fileUrl(p) {
  return `file://${p}`;
}

async function trimTransparentPng(filePath, padding = 10) {
  const trimmed = await sharp(filePath).trim({ threshold: 12 }).toBuffer();
  await sharp(trimmed)
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(filePath);
}

async function exportScene(page, sceneKey, query, masterPath) {
  const params = new URLSearchParams({ scene: sceneKey, ...query });
  await page.goto(`file://${STUDIO}?${params.toString()}`);
  await page.waitForSelector('[data-scene-ready="true"]', { timeout: 60000 });
  const box = page.locator('#export-root');
  await box.screenshot({ path: masterPath, omitBackground: true });
  await trimTransparentPng(masterPath, sceneKey === 'hero' ? 8 : 6);
}

async function encodeVariants(sceneId, masterPath, widths, sizes, alt) {
  const master = sharp(masterPath);
  const meta = await master.metadata();
  const aspect = (meta.height ?? 1) / (meta.width ?? 1);
  const results = [];

  for (const w of widths) {
    const h = Math.round(w * aspect);
    const resized = master.clone().resize(w, h, { fit: 'inside', withoutEnlargement: false });

    const avifPath = path.join(OUT, `${sceneId}-${w}.avif`);
    const webpPath = path.join(OUT, `${sceneId}-${w}.webp`);
    await resized.clone().avif({ quality: 44, effort: 6, chromaSubsampling: '4:2:0' }).toFile(avifPath);
    await resized.clone().webp({ quality: 72 }).toFile(webpPath);
    results.push(w);
  }

  const displayW = widths[widths.length - 1];
  const displayH = Math.round(displayW * aspect);
  const pngW = widths[0];
  const pngH = Math.round(pngW * aspect);
  const pngPath = path.join(OUT, `${sceneId}-${pngW}.png`);
  await master
    .clone()
    .resize(pngW, pngH, { fit: 'inside' })
    .png({ compressionLevel: 9 })
    .toFile(pngPath);

  return {
    id: sceneId,
    width: displayW,
    height: displayH,
    widths,
    sizes,
    alt,
    fallbackWidth: pngW,
  };
}

function requireRaw(name) {
  const p = path.join(RAW, name);
  if (!fs.existsSync(p)) {
    throw new Error(`Missing raw capture: ${p} — run npm run landing:capture first`);
  }
  return p;
}

fs.mkdirSync(OUT, { recursive: true });
if (fs.existsSync(OUT)) {
  for (const file of fs.readdirSync(OUT)) {
    fs.unlinkSync(path.join(OUT, file));
  }
}
fs.mkdirSync(RAW, { recursive: true });

const raw = {
  phoneMenu: requireRaw('phone-menu.png'),
  phoneCart: requireRaw('phone-cart.png'),
  desktopMenu: requireRaw('desktop-menu.png'),
  phoneAdmin: requireRaw('phone-admin.png'),
};

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1800, height: 1200 },
  deviceScaleFactor: 2,
});

const mastersDir = path.join(ROOT, 'scripts/landing/masters');
fs.mkdirSync(mastersDir, { recursive: true });

const logo = fileUrl(path.join(ROOT, 'public/demo-venue/images/logo.webp'));
const common = {
  domain: DOMAIN,
  phoneMenu: fileUrl(raw.phoneMenu),
  phoneCart: fileUrl(raw.phoneCart),
  desktopMenu: fileUrl(raw.desktopMenu),
  phoneAdmin: fileUrl(raw.phoneAdmin),
  logo,
};

const sceneDefs = [
  {
    id: 'hero',
    sceneKey: 'hero',
    query: common,
    widths: HERO_WIDTHS,
    sizes: '(max-width: 979px) 85vw, min(640px, 54vw)',
    alt: '',
  },
  {
    id: 'hero-mobile',
    sceneKey: 'hero-mobile',
    query: common,
    widths: [480, 768, 1080],
    sizes: '85vw',
    alt: '',
  },
  {
    id: 'feature-menu',
    sceneKey: 'phone',
    query: { ...common, shot: 'menu' },
    widths: FEATURE_WIDTHS,
    sizes: '(max-width: 768px) 72vw, 240px',
    alt: '',
  },
  {
    id: 'feature-cart',
    sceneKey: 'phone',
    query: { ...common, shot: 'cart' },
    widths: FEATURE_WIDTHS,
    sizes: '(max-width: 768px) 72vw, 240px',
    alt: '',
  },
  {
    id: 'feature-telegram',
    sceneKey: 'phone',
    query: { ...common, shot: 'telegram' },
    widths: FEATURE_WIDTHS,
    sizes: '(max-width: 768px) 72vw, 240px',
    alt: '',
  },
  {
    id: 'feature-admin',
    sceneKey: 'phone',
    query: { ...common, shot: 'admin' },
    widths: FEATURE_WIDTHS,
    sizes: '(max-width: 768px) 72vw, 240px',
    alt: '',
  },
];

const scenes = {};

for (const def of sceneDefs) {
  const masterPath = path.join(mastersDir, `${def.id}.png`);
  await exportScene(page, def.sceneKey, def.query, masterPath);
  scenes[def.id] = await encodeVariants(
    def.id,
    masterPath,
    def.widths,
    def.sizes,
    def.alt,
  );
  console.log('Encoded', def.id);
}

await browser.close();

fs.writeFileSync(MANIFEST, `${JSON.stringify({ scenes }, null, 2)}\n`);

const totalBytes = fs
  .readdirSync(OUT)
  .filter((f) => f.endsWith('.avif') || f.endsWith('.webp') || f.endsWith('.png'))
  .reduce((sum, f) => sum + fs.statSync(path.join(OUT, f)).size, 0);

console.log(`Scenes → ${OUT} (${(totalBytes / 1024 / 1024).toFixed(2)} MB)`);
