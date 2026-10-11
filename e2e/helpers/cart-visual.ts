import { expect, type Locator, type Page } from '@playwright/test';
import { prepareForScreenshot } from './visual';

export async function assertCartTitleCentered(panel: Locator): Promise<void> {
  const title = panel.getByTestId('cart-header-title');
  await expect(title).toBeVisible();
  const panelBox = await panel.boundingBox();
  const titleBox = await title.boundingBox();
  expect(panelBox).not.toBeNull();
  expect(titleBox).not.toBeNull();
  if (panelBox && titleBox) {
    const panelCenter = panelBox.x + panelBox.width / 2;
    const titleCenter = titleBox.x + titleBox.width / 2;
    expect(Math.abs(panelCenter - titleCenter)).toBeLessThanOrEqual(1);
  }
}

export async function assertExpandedRowContentGap(row: Locator): Promise<void> {
  const trigger = row.locator('.cart-detail-row__trigger');
  const content = row.locator('.cart-detail-row__content');
  await expect(content).toBeVisible();
  const triggerBox = await trigger.boundingBox();
  const contentBox = await content.boundingBox();
  expect(triggerBox).not.toBeNull();
  expect(contentBox).not.toBeNull();
  if (triggerBox && contentBox) {
    const gap = contentBox.y - (triggerBox.y + triggerBox.height);
    expect(gap).toBeGreaterThanOrEqual(0);
  }
  const segmented = content.locator('.ui-segmented').first();
  if (await segmented.count() > 0) {
    const contentTop = contentBox!.y;
    const segBox = await segmented.boundingBox();
    expect(segBox).not.toBeNull();
    if (segBox) {
      expect(segBox.y - contentTop).toBeGreaterThanOrEqual(8);
    }
  }
}

export async function snapCartPanel(
  page: Page,
  panel: Locator,
  name: string,
): Promise<void> {
  await prepareForScreenshot(page);
  await expect(panel).toHaveScreenshot(`${name}.png`, { maxDiffPixelRatio: 0.01 });
}

export async function snapCartCrop(
  page: Page,
  locator: Locator,
  name: string,
): Promise<void> {
  await prepareForScreenshot(page);
  await expect(locator).toHaveScreenshot(`${name}.png`, { maxDiffPixelRatio: 0.01 });
}
