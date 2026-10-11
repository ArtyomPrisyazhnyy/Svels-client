#!/usr/bin/env node
/**
 * Non-blocking CI guard: hex colours and raw spacing in shared UI SCSS.
 * Scope: src/shared/ui SCSS files (widened in later PRs).
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SCAN_DIR = path.join(ROOT, 'src/shared/ui');
const EXTRA_FILES = [
  'src/features/restaurants/styles/restaurant-cart-modal.scss',
  'src/features/restaurants/styles/cart-detail-row.scss',
  'src/features/restaurants/styles/delivery-address-fields.scss',
  'src/features/restaurants/styles/requested-time-picker.scss',
  'src/features/restaurants/styles/order-success-view.scss',
];

const HEX_RE = /#[0-9a-fA-F]{3,8}\b/g;
const SPACING_PROP_RE = /\b(margin|padding|gap)(-block|-inline)?\s*:\s*([^;]+)/gi;
const ALLOWED_SPACING_RE =
  /^(0|1px|var\(--space-\d+\)|auto|inherit|unset|initial)$/;

function isAllowedSpacing(rawPart) {
  const normalized = rawPart.replace(/!important$/, '');
  if (ALLOWED_SPACING_RE.test(normalized)) {
    return true;
  }
  if (!normalized.startsWith('calc(') || !normalized.endsWith(')')) {
    return false;
  }
  const inner = normalized.slice(5, -1).replace(/var\(--space-\d+\)/g, '0').replace(/env\([^)]*\)/g, '0');
  return /^[\d+\-*/().\s]+$/.test(inner);
}

async function collectScssFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectScssFiles(full)));
    } else if (entry.name.endsWith('.scss')) {
      files.push(full);
    }
  }
  return files;
}

function rel(file) {
  return path.relative(ROOT, file);
}

const issues = [];

try {
  const files = [
    ...(await collectScssFiles(SCAN_DIR)),
    ...EXTRA_FILES.map((file) => path.join(ROOT, file)),
  ];
  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const hexMatches = line.match(HEX_RE);
      if (hexMatches) {
        for (const hex of hexMatches) {
          issues.push(`${rel(file)}:${index + 1}: hex colour ${hex}`);
        }
      }

      let match;
      SPACING_PROP_RE.lastIndex = 0;
      while ((match = SPACING_PROP_RE.exec(line)) !== null) {
        const raw = match[3].trim();
        const parts = raw.split(/\s+/);
        for (const part of parts) {
          if (!isAllowedSpacing(part)) {
            issues.push(
              `${rel(file)}:${index + 1}: spacing value "${part}" not on token scale`,
            );
          }
        }
      }
    });
  }
} catch (err) {
  if (err && typeof err === 'object' && 'code' in err && err.code === 'ENOENT') {
    console.log('check-ui-tokens: no src/shared/ui yet — OK');
    process.exit(0);
  }
  throw err;
}

if (issues.length > 0) {
  console.error('check-ui-tokens: found issues:\n' + issues.join('\n'));
  process.exit(1);
}

console.log('check-ui-tokens: OK');
