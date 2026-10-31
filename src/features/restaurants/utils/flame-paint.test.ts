import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
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
});
