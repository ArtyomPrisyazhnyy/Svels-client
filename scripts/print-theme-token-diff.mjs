#!/usr/bin/env node
import { RESTAURANT_COLOR_THEME_TOKENS, THEME_TOKEN_CHANGE_BASELINE } from '../src/shared/design-tokens/color-themes.ts';

const KEYS = [
  'textSoft',
  'accent',
  'inputBorder',
  'danger',
  'disabledText',
  'onPrimary',
  'onAccent',
];

const themes = Object.keys(RESTAURANT_COLOR_THEME_TOKENS).sort();

let md = '### Per-theme token changes (before → after)\n\n';

for (const theme of themes) {
  const before = THEME_TOKEN_CHANGE_BASELINE[theme];
  const after = RESTAURANT_COLOR_THEME_TOKENS[theme];
  const rows = [];
  for (const key of KEYS) {
    const b = before[key];
    const a = after[key];
    if (b !== a || (a !== undefined && b === undefined)) {
      rows.push(`| \`${key}\` | ${b ?? '—'} | ${a ?? '—'} |`);
    }
  }
  if (rows.length === 0) {
    md += `#### ${theme}\n\n_No automated token deltas (decorative \`border\` unchanged from main)._\n\n`;
    continue;
  }
  md += `#### ${theme}\n\n| Token | Before | After |\n| --- | --- | --- |\n${rows.join('\n')}\n\n`;
}

console.log(md);
