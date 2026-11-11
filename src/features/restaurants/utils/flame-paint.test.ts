import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  FLAME_BASE_PAINT,
  FLAME_HEADER_ICON_SIZE_PX,
  FLAME_HEADER_STREAK_FONT_SIZE_PX,
  FLAME_HEADER_STREAK_FONT_WEIGHT,
  FLAME_HEADER_STREAK_GAP_PX,
  FLAME_HEADER_STREAK_LINE_HEIGHT_PX,
  FLAME_OFF_PAINT,
} from './flame-geometry.ts';
import { FLAME_THEME_VARS } from './flame-theme-vars.ts';
import { resolveFlamePaint } from './flame-paint.ts';

describe('resolveFlamePaint', () => {
  it('gives levels 1–5 distinct fills and keeps level style on the icon', () => {
    const vars = FLAME_THEME_VARS.classic;
    const paints = ([1, 2, 3, 4, 5] as const).map((tier) =>
      resolveFlamePaint(tier, vars, '#64748b'),
    );
    const fills = paints.map((paint) => paint.fill);
    assert.equal(new Set(fills).size, 5);
    for (const paint of paints) {
      assert.ok(paint.strokeWidth > 0);
      assert.notEqual(paint.stroke, 'none');
      assert.equal(paint.iconOpacity, 1);
    }
    assert.equal(paints[0]?.innerFill, null);
    assert.ok(paints[1]?.innerFill);
    assert.ok((paints[4]?.innerScale ?? 0) > (paints[1]?.innerScale ?? 0));
  });

  it('uses Lucide-style tier 2 inner scale 0.42 and tier 5 inner scale 0.62', () => {
    const vars = FLAME_THEME_VARS.midnight;
    assert.equal(resolveFlamePaint(2, vars, '#94a3b8').innerScale, 0.42);
    assert.equal(resolveFlamePaint(5, vars, '#94a3b8').innerScale, 0.62);
  });

  it('matches mobile base paint: base fill/core/glow, stroke 1.85', () => {
    const paint = resolveFlamePaint('base', FLAME_THEME_VARS.monochrome, '#404040');
    assert.equal(paint.fill, '#c2410c');
    assert.equal(paint.fillOpacity, FLAME_BASE_PAINT.fillOpacity);
    assert.equal(paint.strokeWidth, FLAME_BASE_PAINT.strokeWidth);
    assert.equal(paint.innerScale, FLAME_BASE_PAINT.coreScale);
    assert.equal(paint.innerOpacity, FLAME_BASE_PAINT.coreOpacity);
    assert.equal(paint.innerFill, '#c2410c');
    assert.equal(paint.glowScale, FLAME_BASE_PAINT.glowScale);
    assert.equal(paint.glowOpacity, FLAME_BASE_PAINT.glowOpacity);
    assert.equal(paint.glowFill, '#c2410c');
  });

  it('renders off state at 0.5 opacity', () => {
    const paint = resolveFlamePaint('off', FLAME_THEME_VARS.classic, '#64748b');
    assert.equal(paint.fill, 'none');
    assert.equal(paint.iconOpacity, FLAME_OFF_PAINT.iconOpacity);
  });
});

describe('flame header geometry (mobile parity)', () => {
  it('exposes icon and counter metrics', () => {
    assert.equal(FLAME_HEADER_ICON_SIZE_PX, 22);
    assert.equal(FLAME_HEADER_STREAK_FONT_SIZE_PX, 15);
    assert.equal(FLAME_HEADER_STREAK_FONT_WEIGHT, 700);
    assert.equal(FLAME_HEADER_STREAK_GAP_PX, 3);
    assert.equal(FLAME_HEADER_STREAK_LINE_HEIGHT_PX, 18);
  });
});
