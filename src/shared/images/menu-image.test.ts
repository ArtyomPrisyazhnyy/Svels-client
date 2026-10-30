import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isOptimizableImageUrl } from './image-remote.ts';
import {
  eagerMenuImageCount,
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
});
