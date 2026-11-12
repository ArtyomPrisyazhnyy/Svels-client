import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isOptimizableImageUrl, shouldUseNextImageOptimizer } from './image-remote.ts';
import { selectImageVariant } from './image-variants.ts';
import type { ImageVariants } from '../types/image-variants.ts';
import {
  CART_DOCK_IMAGE_SIZES,
  CART_LINE_IMAGE_SIZES,
  MENU_CARD_IMAGE_SIZES,
  eagerMenuImageCount,
  menuCardImageSizes,
  menuCardSlotCssPx,
  menuImageFetchPriority,
  menuImageLoading,
  menuModalSlotCssPx,
  stylingPreviewImageSizes,
  stylingPreviewSlotCssPx,
} from './menu-image-loading.ts';

describe('menu image loading', () => {
  it('eager-loads only the first mobile row', () => {
    assert.equal(eagerMenuImageCount('classic'), 2);
    assert.equal(eagerMenuImageCount('magazine'), 1);
    assert.equal(menuImageLoading(0, 2), 'eager');
    assert.equal(menuImageLoading(1, 2), 'eager');
    assert.equal(menuImageLoading(2, 2), 'lazy');
  });

  it('keeps menu photos below the promo banner priority', () => {
    assert.equal(menuImageFetchPriority(0, true), 'low');
    assert.equal(menuImageFetchPriority(1, true), 'low');
    assert.equal(menuImageFetchPriority(0, false), 'high');
    assert.equal(menuImageFetchPriority(3, false), 'low');
  });
});

describe('optimizer image urls', () => {
  it('allows backend uploads and yandex storage', () => {
    assert.equal(isOptimizableImageUrl('http://127.0.0.1:3000/uploads/dish.webp'), true);
    assert.equal(isOptimizableImageUrl('http://127.0.0.1:3000/private/dish.webp'), false);
    assert.equal(
      isOptimizableImageUrl('https://storage.yandexcloud.net/bucket/menu/dish.webp'),
      true,
    );
    assert.equal(isOptimizableImageUrl('https://evil.example/uploads/dish.webp'), false);
  });

  it('does not proxy slow object storage through the Next optimizer', () => {
    const previous = process.env.NEXT_PUBLIC_IMAGE_HOSTS;
    process.env.NEXT_PUBLIC_IMAGE_HOSTS = 'storage-1309.s3hoster.by';
    try {
      const hoster = 'https://storage-1309.s3hoster.by/svels1media/menu/flat-white.webp';
      assert.equal(isOptimizableImageUrl(hoster), true);
      assert.equal(shouldUseNextImageOptimizer(hoster), false);
      assert.equal(
        shouldUseNextImageOptimizer('https://storage.yandexcloud.net/bucket/menu/dish.webp'),
        true,
      );
      assert.equal(shouldUseNextImageOptimizer('http://127.0.0.1:3000/uploads/dish.webp'), true);
    } finally {
      if (previous === undefined) {
        delete process.env.NEXT_PUBLIC_IMAGE_HOSTS;
      } else {
        process.env.NEXT_PUBLIC_IMAGE_HOSTS = previous;
      }
    }
  });
});

const presets: ImageVariants = {
  sm: { width: 400, webp: 'https://cdn/sm.webp', jpg: 'https://cdn/sm.jpg' },
  md: { width: 800, webp: 'https://cdn/md.webp', jpg: 'https://cdn/md.jpg' },
  lg: { width: 1200, webp: 'https://cdn/lg.webp', jpg: 'https://cdn/lg.jpg' },
};

describe('menu card slot', () => {
  it('matches the rendered photo box, including the border and elevated inset', () => {
    assert.equal(menuCardSlotCssPx(360, 'overlay'), (360 - 44) / 2);
    assert.equal(menuCardSlotCssPx(360, 'classic'), (360 - 44) / 2 - 2);
    assert.equal(menuCardSlotCssPx(360, 'glass'), (360 - 44) / 2 - 2);
    assert.equal(menuCardSlotCssPx(360, 'elevated'), (360 - 44) / 2 - 18);
    assert.equal(menuCardSlotCssPx(390, 'minimal'), (390 - 44) / 2);
    assert.equal(menuCardSlotCssPx(673, 'overlay'), (673 - 60) / 2);
    assert.equal(menuCardSlotCssPx(768, 'overlay'), (768 - 80) / 3);
    assert.equal(menuCardSlotCssPx(1024, 'overlay'), (1024 - 96) / 4);
    assert.equal(menuCardSlotCssPx(1024, 'classic'), (1024 - 96) / 4 - 2);
    assert.equal(menuCardSlotCssPx(1024, 'elevated'), (1024 - 96) / 4 - 18);
    assert.equal(menuCardSlotCssPx(1280, 'overlay'), (1200 - 96) / 4);
    assert.equal(menuCardSlotCssPx(1280, 'classic'), (1200 - 96) / 4 - 2);
    assert.equal(menuCardSlotCssPx(1920, 'classic'), (1200 - 96) / 4 - 2);
    assert.equal(menuCardSlotCssPx(390, 'magazine'), 80);
    assert.equal(menuCardSlotCssPx(673, 'magazine'), 96);
    assert.equal(MENU_CARD_IMAGE_SIZES.includes('276px'), false);
    assert.equal(menuCardImageSizes('elevated').includes('- 18px'), true);
    assert.equal(menuCardImageSizes('magazine'), '(min-width: 640px) 96px, 80px');
  });

  it('picks sm on a folded elevated card and md once the column needs it', () => {
    const foldedElevated = menuCardSlotCssPx(360, 'elevated');
    const foldedClassic = menuCardSlotCssPx(360, 'classic');
    assert.equal(selectImageVariant(presets, foldedElevated, 2.6)?.slot, 'sm');
    assert.equal(selectImageVariant(presets, foldedClassic, 2.6)?.slot, 'md');
    assert.equal(selectImageVariant(presets, menuCardSlotCssPx(360, 'classic'), 3)?.slot, 'md');
    assert.equal(selectImageVariant(presets, menuCardSlotCssPx(390, 'overlay'), 3)?.slot, 'md');
    assert.equal(selectImageVariant(presets, menuCardSlotCssPx(768, 'classic'), 2)?.slot, 'md');
    assert.equal(selectImageVariant(presets, menuCardSlotCssPx(1024, 'classic'), 3)?.slot, 'md');
    assert.equal(selectImageVariant(presets, menuCardSlotCssPx(1024, 'elevated'), 3)?.slot, 'md');
    assert.equal(selectImageVariant(presets, menuCardSlotCssPx(1280, 'classic'), 1)?.slot, 'sm');
    assert.equal(selectImageVariant(presets, menuCardSlotCssPx(1920, 'overlay'), 1)?.slot, 'sm');
    assert.equal(selectImageVariant(presets, menuCardSlotCssPx(673, 'overlay'), 2.6)?.slot, 'md');
    assert.equal(selectImageVariant(presets, menuCardSlotCssPx(673, 'magazine'), 2.6)?.slot, 'sm');
  });

  it('keeps the modal, cart and admin preview on their own slots', () => {
    assert.equal(menuModalSlotCssPx(360), 360);
    assert.equal(menuModalSlotCssPx(673), 673);
    assert.equal(menuModalSlotCssPx(768), 520);
    assert.equal(menuModalSlotCssPx(1920), 520);
    assert.equal(selectImageVariant(presets, menuModalSlotCssPx(390), 3)?.slot, 'lg');
    assert.equal(selectImageVariant(presets, menuModalSlotCssPx(1280), 1)?.slot, 'md');
    assert.equal(selectImageVariant(presets, Number.parseFloat(CART_LINE_IMAGE_SIZES), 3)?.slot, 'sm');
    assert.equal(selectImageVariant(presets, Number.parseFloat(CART_DOCK_IMAGE_SIZES), 3)?.slot, 'sm');
    assert.equal(stylingPreviewSlotCssPx(360, 'classic'), 234);
    assert.equal(stylingPreviewSlotCssPx(768, 'classic'), 642);
    assert.equal(stylingPreviewSlotCssPx(1280, 'classic'), (1280 - 268) * 0.4 - 78);
    assert.equal(stylingPreviewSlotCssPx(1920, 'elevated'), (1920 - 268) * 0.4 - 94);
    assert.equal(stylingPreviewSlotCssPx(360, 'magazine'), 80);
    assert.equal(selectImageVariant(presets, stylingPreviewSlotCssPx(1920, 'classic'), 1)?.slot, 'md');
    assert.equal(selectImageVariant(presets, stylingPreviewSlotCssPx(1280, 'classic'), 1)?.slot, 'sm');
    assert.match(stylingPreviewImageSizes('classic'), /0\.4/);
    assert.equal(stylingPreviewImageSizes('magazine').includes('96px'), true);
  });
});
