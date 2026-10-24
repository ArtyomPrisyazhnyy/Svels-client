#!/usr/bin/env node
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SCAN_ROOTS = ['src', 'app'];
const EXT = /\.(scss|tsx?)$/;

const ALLOWED_PREFIXES = [
  'src/shared/styles/_tokens.scss',
  'src/shared/styles/_platform-palette.scss',
  'src/shared/design-tokens/',
  'src/features/restaurants/styles/restaurant-styling-theme.scss',
];

const ALLOWED_EXACT = new Set(['src/shared/types/restaurant-styling.ts']);

const RGBA_RE =
  /(?:rgba|hsla)\(\s*[^)]+\)/gi;

function rel(file) {
  return path.relative(ROOT, file).replaceAll('\\', '/');
}

function isAllowed(relative) {
  if (ALLOWED_EXACT.has(relative)) return true;
  if (relative.endsWith('.test.ts')) return true;
  if (relative.includes('/e2e/')) return true;
  for (const prefix of ALLOWED_PREFIXES) {
    if (relative === prefix || relative.startsWith(prefix)) return true;
  }
  return false;
}

function slug(value) {
  return value.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 48);
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      files.push(...(await walk(full)));
      continue;
    }
    if (EXT.test(entry.name)) files.push(full);
  }
  return files;
}

const rgbaMap = new Map();
const filesToProcess = [];

for (const root of SCAN_ROOTS) {
  const abs = path.join(ROOT, root);
  let files = [];
  try {
    files = await walk(abs);
  } catch {
    continue;
  }
  for (const file of files) {
    const relative = rel(file);
    if (isAllowed(relative)) continue;
    filesToProcess.push(file);
    const content = await readFile(file, 'utf8');
    for (const m of content.matchAll(RGBA_RE)) {
      const key = m[0].replace(/\s+/g, ' ').trim();
      if (!rgbaMap.has(key)) {
        rgbaMap.set(key, `--plat-mix-${slug(key)}`);
      }
    }
  }
}

const palettePath = path.join(ROOT, 'src/shared/styles/_platform-palette.scss');
let palette = await readFile(palettePath, 'utf8');
if (!palette.includes('/* rgba */')) {
  palette = palette.replace(/\n}\s*$/, '');
} else {
  palette = palette.replace(/\n\/\* rgba \*\/[\s\S]*$/, '');
}

const rgbaLines = [
  '',
  '/* rgba */',
  ...[...rgbaMap.entries()].sort((a, b) => a[1].localeCompare(b[1])).map(([value, name]) => `  ${name}: ${value};`),
  '}',
  '',
];
palette = palette.trimEnd() + rgbaLines.join('\n');
await writeFile(palettePath, palette, 'utf8');

let updated = 0;
for (const file of filesToProcess) {
  let content = await readFile(file, 'utf8');
  const before = content;
  for (const [value, name] of rgbaMap) {
    const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    content = content.replace(new RegExp(escaped, 'gi'), `var(${name})`);
  }
  if (content !== before) {
    await writeFile(file, content, 'utf8');
    updated += 1;
  }
}

console.log(`RGBA palette: ${rgbaMap.size} entries; updated ${updated} files.`);
