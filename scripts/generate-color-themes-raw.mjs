#!/usr/bin/env node
/** One-off: extract COLOR_THEMES object from main branch util into JSON */
import { execSync } from 'node:child_process';
import ts from 'typescript';

const source = execSync(
  'git show main:src/features/restaurants/utils/restaurant-styling.util.ts',
  { encoding: 'utf8' },
);

const match = source.match(/const COLOR_THEMES[^=]*=\s*(\{[\s\S]*?\n\});/);
if (!match) {
  console.error('COLOR_THEMES not found');
  process.exit(1);
}

const objectLiteral = match[1]
  .replace(/as const/g, '')
  .replace(/(\w+):/g, '"$1":');

const parsed = JSON.parse(objectLiteral);
console.log(JSON.stringify(parsed, null, 2));
