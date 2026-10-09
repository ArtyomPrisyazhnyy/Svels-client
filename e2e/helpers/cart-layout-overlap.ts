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

function parseAlpha(color: string): number {
  if (color === 'transparent') {
    return 0;
  }
  const match = color.match(/rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+(?:\s*,\s*([\d.]+))?\s*\)/);
  if (!match) {
    return 1;
  }
  return match[1] === undefined ? 1 : Number.parseFloat(match[1]);
}

export async function assertCartPanelBackgroundIsOpaque(page: Page): Promise<void> {
  const panel = page.getByTestId('cart-modal-panel');
  await expect(panel).toBeVisible();
  const colors = await panel.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      backgroundColor: style.backgroundColor,
      opacity: style.opacity,
    };
  });
  expect(Number.parseFloat(colors.opacity)).toBeGreaterThanOrEqual(0.99);
  expect(parseAlpha(colors.backgroundColor)).toBeGreaterThanOrEqual(0.99);
}

const MIN_SECTION_GAP_PX = 12;

export async function assertMinVerticalGap(
  above: Locator,
  below: Locator,
  minGap: number,
  label: string,
): Promise<void> {
  const boxAbove = await boxFor(above);
  const boxBelow = await boxFor(below);
  expect(boxAbove, `${label}: above element missing`).not.toBeNull();
  expect(boxBelow, `${label}: below element missing`).not.toBeNull();
  const gap = boxBelow!.y - (boxAbove!.y + boxAbove!.height);
  expect(gap, `${label} vertical gap (px)`).toBeGreaterThanOrEqual(minGap);
}

export async function assertCartStep1SectionSpacing(page: Page): Promise<void> {
  const modal = page.getByTestId('restaurant-cart-modal');
  const switcher = modal.getByTestId('cart-fulfillment-switcher');
  if (await switcher.count() === 0) {
    return;
  }
  await assertMinVerticalGap(
    modal.getByTestId('cart-header-bar'),
    switcher,
    MIN_SECTION_GAP_PX,
    'header vs fulfillment switcher',
  );
  const firstItem = modal.locator('.restaurant-cart-modal__item').first();
  if (await firstItem.count() > 0) {
    await assertMinVerticalGap(
      switcher,
      firstItem,
      MIN_SECTION_GAP_PX,
      'fulfillment switcher vs first item',
    );
  }
}

export async function assertCartStep2SectionSpacing(page: Page): Promise<void> {
  const checkout = page.getByTestId('cart-checkout-step');
  await expect(checkout).toBeVisible();
  const contacts = checkout.locator('.restaurant-cart-modal__contacts-card');
  const timeRow = checkout.getByTestId('cart-time-row');
  await assertMinVerticalGap(
    contacts,
    timeRow,
    MIN_SECTION_GAP_PX,
    'contacts card vs time row',
  );
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
