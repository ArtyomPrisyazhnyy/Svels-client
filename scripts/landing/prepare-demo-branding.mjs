#!/usr/bin/env node
/** Teal recolor for demo venue logo (landing screenshots). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const IMAGES = path.join(ROOT, 'public/demo-venue/images');
const SOURCE = path.join(ROOT, 'e2e/fixtures/demo-venue/images');
const TEAL = { r: 15, g: 118, b: 110 };

async function recolorLogo(fileName) {
  const source = path.join(SOURCE, fileName);
  const input = path.join(IMAGES, fileName);
  if (!fs.existsSync(source)) {
    return;
  }
  fs.mkdirSync(IMAGES, { recursive: true });
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    const dist = Math.hypot(255 - r, 255 - g, 255 - b);
    const coverage = Math.min(255, Math.round((dist / 160) * (a / 255) * 255));
    data[i] = TEAL.r;
    data[i + 1] = TEAL.g;
    data[i + 2] = TEAL.b;
    data[i + 3] = coverage;
  }
  const tmp = `${input}.tmp`;
  let pipeline = sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });
  if (fileName.endsWith('.webp')) {
    pipeline = pipeline.webp({ quality: 92, alphaQuality: 100 });
  } else {
    pipeline = pipeline.png();
  }
  await pipeline.toFile(tmp);
  fs.renameSync(tmp, input);
}

await recolorLogo('logo.png');
await recolorLogo('logo.webp');
await recolorLogo('logo-transparent.webp');
console.log('[prepare-demo-branding] logo recolored to #0F766E');
