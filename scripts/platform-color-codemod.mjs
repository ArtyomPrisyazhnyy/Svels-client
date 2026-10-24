#!/usr/bin/env node
/**
 * One-shot: collect hex literals outside token files, emit CSS vars in _platform-palette.scss,
 * replace literals with var(--plat-*) across src/ and app/.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

const ALLOWED_PREFIXES = [
  'src/shared/styles/_tokens.scss',
  'src/shared/styles/_platform-palette.scss',
  'src/shared/design-tokens/',
  'src/features/restaurants/styles/restaurant-styling-theme.scss',
];

const ALLOWED_EXACT = new Set(['src/shared/types/restaurant-styling.ts']);

const SCAN_ROOTS = ['src', 'app'];
const EXT = /\.(scss|tsx?)$/;

const HEX_RE = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;

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

function normalizeHex(match) {
  let h = match.toLowerCase();
  if (h.length === 4) {
    h = `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  }
  if (h.length === 9) {
    h = h.slice(0, 7);
  }
  return h;
}

function varName(hex) {
  return `--plat-${hex.slice(1)}`;
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

const hexSet = new Set();
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
    for (const m of content.matchAll(HEX_RE)) {
      hexSet.add(normalizeHex(m[0]));
    }
  }
}

const sortedHex = [...hexSet].sort();

const paletteLines = [
  '// Auto-generated platform palette — hex literals live only here.',
  ':root {',
  ...sortedHex.map((h) => `  ${varName(h)}: ${h};`),
  '}',
  '',
];

const palettePath = path.join(ROOT, 'src/shared/styles/_platform-palette.scss');
await writeFile(palettePath, paletteLines.join('\n'), 'utf8');

const tokensPath = path.join(ROOT, 'src/shared/styles/_tokens.scss');
let tokens = await readFile(tokensPath, 'utf8');
if (!tokens.includes('_platform-palette')) {
  tokens = `@import './platform-palette';\n\n${tokens}`;
  await writeFile(tokensPath, tokens, 'utf8');
}

let replacedFiles = 0;
let replacedCount = 0;

for (const file of filesToProcess) {
  let content = await readFile(file, 'utf8');
  const before = content;
  content = content.replace(HEX_RE, (raw) => {
    const norm = normalizeHex(raw);
    replacedCount += 1;
    return `var(${varName(norm)})`;
  });
  if (content !== before) {
    await writeFile(file, content, 'utf8');
    replacedFiles += 1;
  }
}

console.log(
  `Palette: ${sortedHex.length} colors; updated ${replacedFiles} files (${replacedCount} replacements).`,
);
