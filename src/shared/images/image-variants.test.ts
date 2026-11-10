import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  hasImageVariants,
  imageVariantFallbackSrc,
  imageVariantSrcSet,
  preferredVariantUrl,
  selectImageVariant,
  type NormalizedImageVariant,
} from './image-variants.ts';
import { menuCardSlotCssPx } from './menu-image-loading.ts';
import type { ImageVariants } from '../types/image-variants.ts';

const HOST = 'https://storage-1309.s3hoster.by/menu';

function file(slot: 'sm' | 'md' | 'lg', width: number): { width: number; webp: string; jpg: string } {
  return {
    width,
    webp: `${HOST}/${slot}.webp`,
    jpg: `${HOST}/${slot}.jpg`,
  };
}

const PRESETS: ImageVariants = {
  sm: file('sm', 400),
  md: file('md', 800),
  lg: file('lg', 1200),
};

function picked(slotCssPx: number, dpr: number): NormalizedImageVariant | null {
  return selectImageVariant(PRESETS, slotCssPx, dpr);
}

describe('image variant selection', () => {
  it('treats null, empty and unusable slots as no variants', () => {
    assert.equal(hasImageVariants(null), false);
    assert.equal(hasImageVariants(undefined), false);
    assert.equal(hasImageVariants({}), false);
    assert.equal(
      hasImageVariants({
        sm: { width: 0, webp: `${HOST}/sm.webp`, jpg: `${HOST}/sm.jpg` },
        md: { width: Number.NaN, webp: `${HOST}/md.webp`, jpg: `${HOST}/md.jpg` },
        lg: { width: 1200, webp: '  ', jpg: '' },
      }),
      false,
    );
    assert.equal(selectImageVariant(null, 200, 2), null);
    assert.equal(imageVariantSrcSet({}, 'webp'), '');
  });

  it('uses widths from the payload, not fixed 400/800/1200', () => {
    const variants: ImageVariants = {
      lg: file('lg', 1100),
      sm: file('sm', 360),
    };
    const selected = selectImageVariant(variants, 200, 2);
    assert.equal(selected?.slot, 'lg');
    assert.equal(selected?.width, 1100);
    assert.equal(
      imageVariantSrcSet(variants, 'webp'),
      `${HOST}/sm.webp 360w, ${HOST}/lg.webp 1100w`,
    );
  });

  it('picks the smallest variant that covers slot × dpr, else the largest', () => {
    assert.equal(picked(158, 2)?.slot, 'sm');
    assert.equal(picked(158, 3)?.slot, 'md');
    assert.equal(picked(276, 2)?.slot, 'md');
    assert.equal(picked(276, 3)?.slot, 'lg');
    assert.equal(picked(900, 2)?.slot, 'lg');
    assert.equal(picked(48, 3)?.slot, 'sm');
    assert.equal(picked(520, 2)?.slot, 'lg');
  });

  it('keeps a partial set and falls back to the original url when jpeg is missing', () => {
    const webpOnly: ImageVariants = {
      sm: { width: 400, webp: `${HOST}/sm.webp`, jpg: '' },
    };
    assert.equal(hasImageVariants(webpOnly), true);
    assert.equal(selectImageVariant(webpOnly, 800, 2)?.slot, 'sm');
    assert.equal(imageVariantSrcSet(webpOnly, 'jpg'), '');
    assert.equal(imageVariantSrcSet(webpOnly, 'webp'), `${HOST}/sm.webp 400w`);
    assert.equal(
      imageVariantFallbackSrc(webpOnly, 'https://cdn.example/original.jpg'),
      'https://cdn.example/original.jpg',
    );
    assert.equal(imageVariantFallbackSrc(PRESETS, 'https://cdn.example/original.jpg'), `${HOST}/lg.jpg`);
  });

  it('agrees with the srcset the browser parses', () => {
    const srcset = imageVariantSrcSet(PRESETS, 'jpg');
    const candidates = srcset.split(', ').map((part) => {
      const [url, descriptor] = part.split(' ');
      return { url, width: Number(descriptor.replace('w', '')) };
    });

    for (const [slot, dpr] of [
      [158, 2],
      [240, 2],
      [276, 3],
    ] as const) {
      const target = slot * dpr;
      const match = candidates.find((candidate) => candidate.width >= target) ?? candidates[candidates.length - 1];
      assert.equal(preferredVariantUrl(PRESETS, slot, dpr), match.url.replace('.jpg', '.webp'));
    }
  });

  it('selects a wider file when a foldable opens', () => {
    const closedSlot = menuCardSlotCssPx(360, 'classic');
    const openSlot = menuCardSlotCssPx(800, 'classic');
    assert.ok(openSlot > closedSlot);
    assert.equal(picked(closedSlot, 2)?.slot, 'sm');
    assert.equal(picked(openSlot, 2)?.slot, 'md');

    const desktopSlot = menuCardSlotCssPx(1280, 'classic');
    assert.equal(picked(desktopSlot, 3)?.slot, 'lg');
  });
});

describe('menu card slot width', () => {
  it('follows the grid columns and the fixed magazine thumb', () => {
    assert.equal(menuCardSlotCssPx(360, 'classic'), (360 - 44) / 2);
    assert.equal(menuCardSlotCssPx(390, 'overlay'), (390 - 44) / 2);
    assert.equal(menuCardSlotCssPx(640, 'glass'), (640 - 44) / 2);
    assert.equal(menuCardSlotCssPx(641, 'minimal'), (641 - 60) / 2);
    assert.equal(menuCardSlotCssPx(768, 'classic'), (768 - 80) / 3);
    assert.equal(menuCardSlotCssPx(1024, 'classic'), (1024 - 96) / 4);
    assert.equal(menuCardSlotCssPx(1280, 'classic'), (1200 - 96) / 4);
    assert.equal(menuCardSlotCssPx(360, 'elevated'), (360 - 44) / 2 - 16);
    assert.equal(menuCardSlotCssPx(639, 'magazine'), 80);
    assert.equal(menuCardSlotCssPx(640, 'magazine'), 96);
    assert.equal(menuCardSlotCssPx(1280, 'magazine'), 96);
  });
});
