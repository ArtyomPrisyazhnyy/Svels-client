#!/usr/bin/env node
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

const ALLOWED_FILES = new Set([
  'src/shared/styles/_tokens.scss',
  'src/shared/styles/_platform-palette.scss',
  'src/shared/types/restaurant-styling.ts',
]);

const SCAN_ROOTS = ['src', 'app'];

const HEX_RE = /#[0-9a-fA-F]{3,8}\b/g;
const RGB_RE = /\b(?:rgb|rgba|hsl|hsla|oklch)\s*\(/i;

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

function isAllowed(relative) {
  if (ALLOWED_FILES.has(relative)) return true;
  if (relative.startsWith('src/shared/design-tokens/')) return true;
  if (relative.endsWith('.test.ts')) return true;
  if (relative.includes('/e2e/')) return true;
  if (relative.endsWith('restaurant-styling-theme.scss')) return true;
  return false;
}

const violations = [];

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

    const content = await readFile(file, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('stylelint-disable')) return;
      if (line.trim().startsWith('//')) return;

      const hex = line.match(HEX_RE);
      if (hex) {
        for (const value of hex) {
          violations.push(`${relative}:${index + 1}: hex ${value}`);
        }
      }
      if (RGB_RE.test(line)) {
        violations.push(`${relative}:${index + 1}: raw color function`);
      }
    });
  }
}

if (violations.length > 0) {
  console.error(`Raw color violations: ${violations.length}`);
  console.error(violations.slice(0, 100).join('\n'));
  if (violations.length > 100) {
    console.error(`...and ${violations.length - 100} more`);
  }
  process.exit(1);
}

console.log('No raw color violations outside token files.');
