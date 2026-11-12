#!/usr/bin/env node
/**
 * Offline landing device scenes → responsive AVIF/WebP/PNG + manifest.
 * iPhone frame styling inspired by devices.css (MIT, picturepan2) — see scene-studio.html.
 */
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const RAW = path.join(ROOT, 'scripts/landing/raw');
const OUT = path.join(ROOT, 'public/landing/scenes');
const MANIFEST = path.join(ROOT, 'src/views/landing-scenes.manifest.json');
const STUDIO = path.join(ROOT, 'scripts/landing/scene-studio.html');
const DOMAIN = 'chayka-coffee.by';

const HERO_WIDTHS = [720, 1080, 1440, 1600, 2000];
const HERO_MOBILE_WIDTHS = [400, 640, 900, 1200];
const FEATURE_WIDTHS = [280, 480, 720, 960];

function fileUrl(p) {
  return `file://${p}`;
}

async function exportScene(page, sceneKey, query, masterPath) {
  const params = new URLSearchParams({ scene: sceneKey, ...query });
  await page.goto(`file://${STUDIO}?${params.toString()}`);
  await page.waitForSelector('[data-scene-ready="true"]', { timeout: 60000 });
  const box = page.locator('#export-root');
  await box.screenshot({ path: masterPath, omitBackground: true, animations: 'disabled' });
}

async function assertTransparentCorner(filePath) {
  const meta = await sharp(filePath).metadata();
  if (!meta.hasAlpha) {
    throw new Error(`${path.basename(filePath)} has no alpha channel`);
  }
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const alpha = data[info.channels - 1];
  if (alpha !== 0) {
    throw new Error(`${path.basename(filePath)} corner alpha is ${alpha}, expected 0`);
  }
}

const TRANSPARENT_EDGE = 8;

/**
 * Studio drop-shadows are clipped by the capture padding, which leaves a flat
 * gray rectangle under the devices. Drop those pixels so the bitmap is transparent
 * and the page can paint a soft shadow that actually fades out.
 */
function stripBakedShadow(data, channels) {
  for (let i = 0; i < data.length; i += channels) {
    const alpha = data[i + 3];
    if (alpha === 0 || alpha >= 250) continue;
    if (Math.max(data[i], data[i + 1], data[i + 2]) > 90) continue;
    data[i + 3] = 0;
  }
}

async function frameScene(masterPath, width, stripShadow = false) {
  const meta = await sharp(masterPath).metadata();
  const aspect = (meta.height ?? 1) / (meta.width ?? 1);
  const innerW = width - TRANSPARENT_EDGE * 2;
  const innerH = Math.max(2, Math.round((innerW * aspect) / 2) * 2);
  const { data, info } = await sharp(masterPath)
    .resize(innerW, innerH, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (stripShadow) stripBakedShadow(data, info.channels);
  return {
    image: sharp(data, {
      raw: { width: info.width, height: info.height, channels: info.channels },
    }).extend({
      top: TRANSPARENT_EDGE,
      bottom: TRANSPARENT_EDGE,
      left: TRANSPARENT_EDGE,
      right: TRANSPARENT_EDGE,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    }),
    height: innerH + TRANSPARENT_EDGE * 2,
  };
}

async function encodeVariants(sceneId, masterPath, widths, sizes, alt, stripShadow = false) {
  const results = [];
  let displayH = 0;

  for (const w of widths) {
    const framed = await frameScene(masterPath, w, stripShadow);
    if (w === widths[widths.length - 1]) displayH = framed.height;

    const avifPath = path.join(OUT, `${sceneId}-${w}.avif`);
    const webpPath = path.join(OUT, `${sceneId}-${w}.webp`);
    await framed.image
      .clone()
      .avif({ quality: 72, effort: 5, chromaSubsampling: '4:4:4' })
      .toFile(avifPath);
    await framed.image
      .clone()
      .webp({ quality: 82, alphaQuality: 100, smartSubsample: false })
      .toFile(webpPath);
    await assertTransparentCorner(avifPath);
    await assertTransparentCorner(webpPath);
    results.push(w);
  }

  const displayW = widths[widths.length - 1];
  const pngW = widths[0];
  const pngPath = path.join(OUT, `${sceneId}-${pngW}.png`);
  const pngFramed = await frameScene(masterPath, pngW, stripShadow);
  await pngFramed.image.png({ compressionLevel: 9 }).toFile(pngPath);
  await assertTransparentCorner(pngPath);

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

const encodeOnly = process.argv.includes('--encode-only');

fs.mkdirSync(OUT, { recursive: true });
if (!encodeOnly && fs.existsSync(OUT)) {
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

const browser = encodeOnly ? null : await chromium.launch();
const page = encodeOnly
  ? null
  : await browser.newPage({
      viewport: { width: 2200, height: 1600 },
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
    stripShadow: true,
    widths: HERO_WIDTHS,
    sizes: '(max-width: 979px) 85vw, (max-width: 1360px) calc((100vw - 4rem - 1.5rem) * 7 / 12), 742px',
    alt: '',
  },
  {
    id: 'hero-mobile',
    sceneKey: 'hero-mobile',
    query: common,
    stripShadow: true,
    widths: HERO_MOBILE_WIDTHS,
    sizes: '85vw',
    alt: '',
  },
  {
    id: 'feature-menu',
    sceneKey: 'phone',
    query: { ...common, shot: 'menu' },
    widths: FEATURE_WIDTHS,
    sizes: '(max-width: 979px) 72vw, 280px',
    alt: '',
  },
  {
    id: 'feature-cart',
    sceneKey: 'phone',
    query: { ...common, shot: 'cart' },
    widths: FEATURE_WIDTHS,
    sizes: '(max-width: 979px) 72vw, 280px',
    alt: '',
  },
  {
    id: 'feature-telegram',
    sceneKey: 'phone',
    query: { ...common, shot: 'telegram' },
    widths: FEATURE_WIDTHS,
    sizes: '(max-width: 979px) 72vw, 280px',
    alt: '',
  },
  {
    id: 'feature-admin',
    sceneKey: 'phone',
    query: { ...common, shot: 'admin' },
    widths: FEATURE_WIDTHS,
    sizes: '(max-width: 979px) 72vw, 280px',
    alt: '',
  },
];

const scenes = encodeOnly ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).scenes : {};

for (const def of sceneDefs) {
  if (encodeOnly && def.stripShadow !== true) continue;
  const masterPath = path.join(mastersDir, `${def.id}.png`);
  if (!encodeOnly) await exportScene(page, def.sceneKey, def.query, masterPath);
  scenes[def.id] = await encodeVariants(
    def.id,
    masterPath,
    def.widths,
    def.sizes,
    def.alt,
    def.stripShadow === true,
  );
  console.log('Encoded', def.id);
}

if (browser) await browser.close();

fs.writeFileSync(MANIFEST, `${JSON.stringify({ scenes }, null, 2)}\n`);

const totalBytes = fs
  .readdirSync(OUT)
  .filter((f) => f.endsWith('.avif') || f.endsWith('.webp') || f.endsWith('.png'))
  .reduce((sum, f) => sum + fs.statSync(path.join(OUT, f)).size, 0);

console.log(`Scenes → ${OUT} (${(totalBytes / 1024 / 1024).toFixed(2)} MB)`);
for (const name of ['phone-menu.png', 'phone-cart.png', 'phone-admin.png', 'desktop-menu.png']) {
  const file = path.join(RAW, name);
  const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 12);
  const meta = await sharp(file).metadata();
  console.log(`raw ${name} ${meta.width}x${meta.height} ${hash}`);
}
