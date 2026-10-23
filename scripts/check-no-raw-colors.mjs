#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

const ALLOWED_FILES = new Set([
  'src/shared/styles/_tokens.scss',
  'src/shared/design-tokens/color-themes.ts',
  'src/shared/design-tokens/wcag-contrast.ts',
]);

const SCSS_DIRS = [
  'src/shared/ui',
  'src/shared/components',
  'src/features/restaurants/styles',
];

const HEX_RE = /#[0-9a-fA-F]{3,8}\b/g;
const RGB_RE = /\b(?:rgb|rgba|hsl|hsla|oklch)\s*\(/i;
const NAMED_COLOR_RE =
  /\b(?:white|black|red|blue|green|yellow|orange|purple|pink|gray|grey|transparent)\b/i;

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
    if (entry.name.endsWith('.scss') || entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      files.push(full);
    }
  }
  return files;
}

function rel(file) {
  return path.relative(ROOT, file).replaceAll('\\', '/');
}

const violations = [];

for (const dir of SCSS_DIRS) {
  const abs = path.join(ROOT, dir);
  let files = [];
  try {
    files = await walk(abs);
  } catch {
    continue;
  }
  for (const file of files) {
    const relative = rel(file);
    if (ALLOWED_FILES.has(relative)) continue;
    if (relative.includes('/e2e/')) continue;
    if (relative.endsWith('restaurant-styling-theme.scss')) continue;
    if (relative.endsWith('.test.ts')) continue;

    const content = await readFile(file, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('// stylelint-disable')) return;
      const hex = line.match(HEX_RE);
      if (hex) {
        for (const value of hex) {
          violations.push(`${relative}:${index + 1}: hex ${value}`);
        }
      }
      if (RGB_RE.test(line)) {
        violations.push(`${relative}:${index + 1}: raw color function`);
      }
      if (
        (relative.endsWith('.tsx') || relative.endsWith('.ts')) &&
        NAMED_COLOR_RE.test(line) &&
        !line.includes('colorTheme') &&
        !line.includes('ColorTheme')
      ) {
        if (/\b(color|background|fill|stroke)\b/i.test(line) || /style=\{/.test(line)) {
          violations.push(`${relative}:${index + 1}: named color literal`);
        }
      }
    });
  }
}

if (violations.length > 0) {
  console.error(`Raw color violations: ${violations.length}`);
  console.error(violations.slice(0, 80).join('\n'));
  if (violations.length > 80) {
    console.error(`...and ${violations.length - 80} more`);
  }
  process.exit(1);
}

console.log('No raw color violations outside token files.');
