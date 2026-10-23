import { describe, expect, it } from 'vitest';
import {
  ALL_RESTAURANT_COLOR_THEMES,
  GLOBAL_SEMANTIC_TOKENS,
  RESTAURANT_COLOR_THEME_TOKENS,
  resolveThemeOnColors,
} from '@/shared/design-tokens/color-themes';
import { contrastRatio, pickOnColor } from '@/shared/design-tokens/wcag-contrast';

interface ContrastPair {
  label: string;
  foreground: string;
  background: string;
  minRatio: number;
}

function assertPairs(themeName: string, pairs: ContrastPair[]): void {
  const failures: string[] = [];

  for (const pair of pairs) {
    const ratio = contrastRatio(pair.foreground, pair.background);
    if (ratio < pair.minRatio) {
      failures.push(
        `${themeName}: ${pair.label} — ${ratio.toFixed(2)}:1 (need ≥${pair.minRatio})`,
      );
    }
  }

  expect(failures, failures.join('\n')).toEqual([]);
}

describe('restaurant theme token contrast', () => {
  it('covers every theme in RESTAURANT_COLOR_THEME_TOKENS', () => {
    const tokenKeys = Object.keys(RESTAURANT_COLOR_THEME_TOKENS).sort();
    expect([...ALL_RESTAURANT_COLOR_THEMES].sort()).toEqual(tokenKeys);
  });

  for (const themeName of ALL_RESTAURANT_COLOR_THEMES) {
    it(`meets WCAG pairs for ${themeName}`, () => {
      const theme = RESTAURANT_COLOR_THEME_TOKENS[themeName];
      const { onPrimary, onAccent, onDanger } = resolveThemeOnColors(theme);
      const disabledText = theme.disabledText ?? theme.textMuted;

      const pairs: ContrastPair[] = [
        { label: 'text on bg', foreground: theme.text, background: theme.bg, minRatio: 4.5 },
        { label: 'text on surface', foreground: theme.text, background: theme.surface, minRatio: 4.5 },
        {
          label: 'muted text on bg',
          foreground: theme.textMuted,
          background: theme.bg,
          minRatio: 4.5,
        },
        {
          label: 'muted text on surface',
          foreground: theme.textMuted,
          background: theme.surface,
          minRatio: 4.5,
        },
        {
          label: 'soft text on bg',
          foreground: theme.textSoft,
          background: theme.bg,
          minRatio: 4.5,
        },
        {
          label: 'soft text on surface (placeholder)',
          foreground: theme.textSoft,
          background: theme.surface,
          minRatio: 4.5,
        },
        { label: 'on-primary on primary', foreground: onPrimary, background: theme.primary, minRatio: 3 },
        { label: 'on-accent on accent', foreground: onAccent, background: theme.accent, minRatio: 3 },
        { label: 'link accent on bg', foreground: theme.accent, background: theme.bg, minRatio: 4.5 },
        {
          label: 'link accent on surface',
          foreground: theme.accent,
          background: theme.surface,
          minRatio: 4.5,
        },
        {
          label: 'danger text on surface',
          foreground: theme.danger ?? GLOBAL_SEMANTIC_TOKENS.danger,
          background: theme.surface,
          minRatio: 4.5,
        },
        {
          label: 'on-danger on danger',
          foreground: onDanger,
          background: theme.danger ?? GLOBAL_SEMANTIC_TOKENS.danger,
          minRatio: 3,
        },
        {
          label: 'disabled text on surface',
          foreground: disabledText,
          background: theme.surface,
          minRatio: 3,
        },
        {
          label: 'input border on surface',
          foreground: theme.inputBorder,
          background: theme.surface,
          minRatio: 3,
        },
      ];

      assertPairs(themeName, pairs);
    });
  }
});

