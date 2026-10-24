import { describe, expect, it } from 'vitest';
import { contrastRatio, pickOnColor } from '@/shared/design-tokens/wcag-contrast';

describe('contrastRatio', () => {
  it('matches known WCAG reference values', () => {
    expect(contrastRatio('#ffffff', '#2563eb')).toBeCloseTo(5.17, 1);
    expect(contrastRatio('#ffffff', '#38bdf8')).toBeCloseTo(2.1, 1);
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });
});

describe('pickOnColor', () => {
  it('keeps white on primary blue when contrast passes', () => {
    expect(pickOnColor('#2563eb', 3, '#ffffff')).toBe('#ffffff');
    expect(pickOnColor('#2563eb', 4.5, '#ffffff')).toBe('#ffffff');
  });

  it('falls back to dark text on light accent fills', () => {
    expect(pickOnColor('#38bdf8', 3, '#ffffff')).toBe('#000000');
  });
});
