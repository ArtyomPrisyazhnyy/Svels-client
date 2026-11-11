import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  hasImageVariants,
  imageVariantFallbackSrc,
  imageVariantSrcSet,
  preferredVariantUrl,
  selectImageVariant,
} from './image-variants.ts';
import type { ImageVariants } from '../types/image-variants.ts';

const cover = 'https://storage-1309.s3hoster.by/svels1media/menu/flat-white.jpg';

function variants(widths: Partial<Record<'sm' | 'md' | 'lg', number>>): ImageVariants {
  const result: ImageVariants = {};
  for (const slot of ['sm', 'md', 'lg'] as const) {
    const width = widths[slot];
    if (!width) {
      continue;
    }
    result[slot] = {
      width,
      webp: `https://storage-1309.s3hoster.by/svels1media/menu/flat-white-${slot}.webp`,
      jpg: `https://storage-1309.s3hoster.by/svels1media/menu/flat-white-${slot}.jpg`,
    };
  }
  return result;
}

describe('image variants', () => {
  it('ignores empty and invalid presets', () => {
    assert.equal(hasImageVariants(null), false);
    assert.equal(hasImageVariants({}), false);
    assert.equal(hasImageVariants({ sm: { width: 0, webp: 'https://cdn/a.webp', jpg: 'https://cdn/a.jpg' } }), false);
    assert.equal(selectImageVariant(null, 180, 2), null);
  });

  it('reads width from the payload and picks the smallest file that covers the slot', () => {
    const presets = variants({ sm: 400, md: 800, lg: 1200 });
    assert.equal(selectImageVariant(presets, 173, 2)?.slot, 'sm');
    assert.equal(selectImageVariant(presets, 276, 2)?.slot, 'md');
    assert.equal(selectImageVariant(presets, 520, 2)?.slot, 'lg');
    assert.equal(selectImageVariant(presets, 390, 3)?.width, 1200);
    assert.equal(selectImageVariant(variants({ sm: 400 }), 800, 2)?.slot, 'sm');
  });

  it('builds a w-descriptor srcset and does not fall back to the original cover', () => {
    const presets = variants({ sm: 400, md: 800, lg: 1200 });
    const srcSet = imageVariantSrcSet(presets, 'webp');
    assert.match(srcSet, /flat-white-sm\.webp 400w/);
    assert.match(srcSet, /flat-white-md\.webp 800w/);
    assert.match(srcSet, /flat-white-lg\.webp 1200w/);
    assert.equal(srcSet.includes(cover), false);
    assert.equal(imageVariantFallbackSrc(presets, cover).endsWith('flat-white-lg.jpg'), true);
    assert.equal(preferredVariantUrl(presets, 173, 2)?.endsWith('flat-white-sm.webp'), true);
  });

  it('grows the candidate when the slot grows from a phone to a desktop modal', () => {
    const presets = variants({ sm: 400, md: 800, lg: 1200 });
    assert.equal(selectImageVariant(presets, 390, 2)?.slot, 'md');
    assert.equal(selectImageVariant(presets, 520, 2)?.slot, 'lg');
  });
});
