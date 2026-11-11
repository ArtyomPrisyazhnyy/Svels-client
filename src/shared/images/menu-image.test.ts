import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isOptimizableImageUrl, shouldUseNextImageOptimizer } from './image-remote.ts';
import {
  eagerMenuImageCount,
  menuCardSlotCssPx,
  menuImageFetchPriority,
  menuImageLoading,
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

describe('menu card slot', () => {
  it('matches the sizes attribute used by the card srcset', () => {
    assert.equal(menuCardSlotCssPx(390, 'classic'), (390 - 44) / 2);
    assert.equal(menuCardSlotCssPx(1280, 'classic'), 276);
    assert.equal(menuCardSlotCssPx(390, 'magazine'), 80);
    assert.equal(menuCardSlotCssPx(800, 'magazine'), 96);
  });
});
