import { expect, type Locator, type Page } from '@playwright/test';

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function boxesOverlap(a: Box, b: Box, margin = 1): boolean {
  const aRight = a.x + a.width;
  const aBottom = a.y + a.height;
  const bRight = b.x + b.width;
  const bBottom = b.y + b.height;
  return !(
    aRight <= b.x + margin ||
    a.x >= bRight - margin ||
    aBottom <= b.y + margin ||
    a.y >= bBottom - margin
  );
}

async function boxFor(locator: Locator): Promise<Box | null> {
  const count = await locator.count();
  if (count === 0) {
    return null;
  }
  const box = await locator.first().boundingBox();
  if (!box || box.width <= 0 || box.height <= 0) {
    return null;
  }
  return box;
}

export async function expectLocatorsDoNotOverlap(
  pairs: Array<{ a: Locator; b: Locator; label: string }>,
): Promise<void> {
  for (const { a, b, label } of pairs) {
    const boxA = await boxFor(a);
    const boxB = await boxFor(b);
    if (!boxA || !boxB) {
      continue;
    }
    expect(boxesOverlap(boxA, boxB), `${label} should not overlap`).toBe(false);
  }
}

export async function assertCartMobileLayoutNoOverlap(page: Page): Promise<void> {
  const modal = page.getByTestId('restaurant-cart-modal');
  await expect(modal).toBeVisible();

  const pairs: Array<{ a: Locator; b: Locator; label: string }> = [
    {
      a: modal.getByTestId('cart-header-title'),
      b: modal.getByTestId('cart-close'),
      label: 'title vs close',
    },
    {
      a: modal.getByTestId('cart-header-title'),
      b: modal.getByTestId('cart-clear'),
      label: 'title vs clear',
    },
    {
      a: modal.getByTestId('cart-header-title'),
      b: modal.getByTestId('cart-back-to-step-1'),
      label: 'title vs back',
    },
    {
      a: modal.locator('.restaurant-cart-modal__item-main').first(),
      b: modal.getByTestId('cart-item-counter').first(),
      label: 'item main vs counter',
    },
    {
      a: modal.getByTestId('cart-modal-footer').locator('.restaurant-cart-modal__total'),
      b: modal.getByTestId('cart-submit').or(modal.getByTestId('cart-go-to-checkout')),
      label: 'footer total vs CTA',
    },
  ];

  await expectLocatorsDoNotOverlap(pairs);
}
