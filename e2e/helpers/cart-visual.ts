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

/**
 * Centred modals sit on a half pixel. Drop the enter transform and nudge with
 * relative positioning so the border box is on whole CSS pixels. Margin would
 * change flex centring and miss the integer.
 */
async function alignPanelToDevicePixels(panel: Locator): Promise<void> {
  await panel.evaluate((el) => {
    const initial = el.getBoundingClientRect();
    const fullBleed = initial.left <= 1 && window.innerWidth - initial.right <= 1;
    if (fullBleed) {
      return;
    }
    el.style.transition = 'none';
    el.style.transform = 'none';
    const rect = el.getBoundingClientRect();
    const dx = Math.round(rect.left) - rect.left;
    const dy = Math.round(rect.top) - rect.top;
    el.style.position = 'relative';
    if (Math.abs(dx) >= 0.01) {
      el.style.left = `${dx}px`;
    }
    if (Math.abs(dy) >= 0.01) {
      el.style.top = `${dy}px`;
    }
  });
}

async function snapPanelBoundingBox(
  page: Page,
  panel: Locator,
  name: string,
): Promise<void> {
  await alignPanelToDevicePixels(panel);
  const box = await panel.boundingBox();
  if (!box) {
    throw new Error(`Panel for ${name} has no bounding box`);
  }
  const viewport = page.viewportSize();
  const fullBleed = box.x <= 1 && !!viewport && viewport.width - (box.x + box.width) <= 1;
  const maxWidth = viewport ? viewport.width - Math.round(box.x) : Math.round(box.width);
  const clipWidth = Math.min(Math.floor(box.width), maxWidth);
  const clipHeight = Math.round(box.height);
  // Element screenshots antialias the rounded clip into a 1px page fringe.
  // A viewport clip of the border box matches the opaque pixels on screen.
  if (fullBleed) {
    await expect(panel).toHaveScreenshot(`${name}.png`, { maxDiffPixelRatio: 0.01 });
    return;
  }
  await expect(page).toHaveScreenshot(`${name}.png`, {
    clip: {
      x: Math.round(box.x),
      y: Math.round(box.y),
      width: clipWidth,
      height: clipHeight,
    },
    maxDiffPixelRatio: 0.01,
  });
}

export async function snapCartPanel(
  page: Page,
  panel: Locator,
  name: string,
): Promise<void> {
  await prepareForScreenshot(page);
  await snapPanelBoundingBox(page, panel, name);
}

export async function snapOverlayPanel(
  page: Page,
  panel: Locator,
  name: string,
): Promise<void> {
  await prepareForScreenshot(page);
  await snapPanelBoundingBox(page, panel, name);
}

export async function snapCartCrop(
  page: Page,
  locator: Locator,
  name: string,
): Promise<void> {
  await prepareForScreenshot(page);
  await expect(locator).toHaveScreenshot(`${name}.png`, { maxDiffPixelRatio: 0.01 });
}
