import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { RestaurantColorTheme } from '../../../shared/types/restaurant-styling.ts';
import { FLAME_THEME_VARS } from './flame-theme-vars.ts';

const COLOR_THEMES_BG: Record<RestaurantColorTheme, string> = {
  classic: '#f8fafc',
  ocean: '#f0f9ff',
  forest: '#f0fdf4',
  warm: '#fff7ed',
  berry: '#fff1f2',
  lavender: '#faf5ff',
  midnight: '#0f172a',
  ember: '#1c1917',
  obsidian: '#09090b',
  moss: '#052e16',
  wine: '#1a0a0f',
  sand: '#faf8f5',
  citrus: '#fefce8',
  graphite: '#f4f4f5',
  monochrome: '#ffffff',
  monochromeDark: '#000000',
  neon: '#06040a',
};

const COLOR_THEMES_MUTED: Record<RestaurantColorTheme, string> = {
  classic: '#64748b',
  ocean: '#0369a1',
  forest: '#166534',
  warm: '#9a3412',
  berry: '#be123c',
  lavender: '#7e22ce',
  midnight: '#94a3b8',
  ember: '#a8a29e',
  obsidian: '#a1a1aa',
  moss: '#86efac',
  wine: '#f9a8d4',
  sand: '#78716c',
  citrus: '#a16207',
  graphite: '#52525b',
  monochrome: '#404040',
  monochromeDark: '#d4d4d4',
  neon: '#f9a8d4',
};

function parseHex(hex: string): [number, number, number] | null {
  const normalized = hex.trim();
  if (!normalized.startsWith('#')) {
    return null;
  }
  const raw = normalized.slice(1);
  if (raw.length === 3) {
    return [
      Number.parseInt(raw[0] + raw[0], 16),
      Number.parseInt(raw[1] + raw[1], 16),
      Number.parseInt(raw[2] + raw[2], 16),
    ];
  }
  if (raw.length === 6) {
    return [
      Number.parseInt(raw.slice(0, 2), 16),
      Number.parseInt(raw.slice(2, 4), 16),
      Number.parseInt(raw.slice(4, 6), 16),
    ];
  }
  return null;
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const channel = (value: number) => {
    const s = value / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(foreground: string, background: string): number {
  const fg = parseHex(foreground);
  const bg = parseHex(background);
  assert.ok(fg, `foreground ${foreground}`);
  assert.ok(bg, `background ${background}`);
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const ALL_THEMES = Object.keys(FLAME_THEME_VARS) as RestaurantColorTheme[];

describe('FLAME_THEME_VARS contrast on header background', () => {
  for (const theme of ALL_THEMES) {
    it(`keeps readable tiers on ${theme} (--rs-bg)`, () => {
      const bg = COLOR_THEMES_BG[theme];
      const vars = FLAME_THEME_VARS[theme];
      const muted = COLOR_THEMES_MUTED[theme];

      assert.ok(contrastRatio(muted, bg) >= 3, `off/muted on ${theme}`);
      assert.ok(contrastRatio(vars.base, bg) >= 3, `base on ${theme}`);
      assert.ok(contrastRatio(vars.tier1, bg) >= 3, `tier1 on ${theme}`);
      assert.ok(contrastRatio(vars.tier2, bg) >= 3, `tier2 on ${theme}`);
      assert.ok(contrastRatio(vars.tier3, bg) >= 3, `tier3 on ${theme}`);
      assert.ok(contrastRatio(vars.tier4, bg) >= 3, `tier4 on ${theme}`);
      assert.ok(contrastRatio(vars.tier5, bg) >= 3, `tier5 on ${theme}`);
    });
  }
});
