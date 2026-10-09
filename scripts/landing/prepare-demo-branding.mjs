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
  const tmp = `${input}.tmp`;
  await sharp(source)
    .ensureAlpha()
    .greyscale()
    .tint(TEAL)
    .toFile(tmp);
  fs.renameSync(tmp, input);
}

await recolorLogo('logo.png');
await recolorLogo('logo.webp');
await recolorLogo('logo-transparent.webp');
console.log('[prepare-demo-branding] logo recolored to #0F766E');
