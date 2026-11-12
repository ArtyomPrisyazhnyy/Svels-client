import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  clampCropTransform,
  createInitialCropTransform,
  getMinCoverZoom,
} from './promo-banner-crop.util.ts';

describe('promo-banner-crop.util', () => {
  it('getMinCoverZoom fills viewport', () => {
    const zoom = getMinCoverZoom(4000, 3000, { width: 400, height: 100 });
    assert.ok(zoom >= 400 / 4000);
    assert.ok(zoom >= 100 / 3000);
  });

  it('createInitialCropTransform centers image', () => {
    const viewport = { width: 400, height: 100 };
    const transform = createInitialCropTransform(2000, 1500, viewport);
    const clamped = clampCropTransform(transform, 2000, 1500, viewport);
    assert.equal(clamped.zoom, transform.zoom);
    assert.ok(clamped.offsetX <= 0);
    assert.ok(clamped.offsetY <= 0);
  });
});
