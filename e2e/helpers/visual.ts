import type { Page } from '@playwright/test';

export const VIEWPORTS = {
  m360: { width: 360, height: 780 },
  m390: { width: 390, height: 844 },
  t768: { width: 768, height: 1024 },
  d1280: { width: 1280, height: 800 },
} as const;

export type VisualViewportKey = keyof typeof VIEWPORTS;

const FREEZE_MOTION_CSS = `
*, *::before, *::after {
  transition: none !important;
  animation: none !important;
  caret-color: transparent !important;
}
`;

async function stylesheetsAccessible(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const sheets = Array.from(document.styleSheets);
    if (sheets.length === 0) {
      return false;
    }

    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    for (const link of links) {
      if (!(link as HTMLLinkElement).sheet) {
        return false;
      }
    }

    for (const sheet of sheets) {
      try {
        void sheet.cssRules.length;
      } catch {
        return false;
      }
    }

    return true;
  });
}

/** Fail the shot when segmented CSS has not been applied (native grey buttons). */
export async function assertSegmentedControlStyled(page: Page): Promise<void> {
  const segmented = page.locator('.ui-segmented').first();
  await segmented.waitFor({ state: 'visible' });

  const computed = await segmented.evaluate((el) => {
    const style = getComputedStyle(el);
    const styledRoot = el.closest('.restaurant-styled');
    return {
      display: style.display,
      position: style.position,
      backgroundColor: style.backgroundColor,
      switcher: styledRoot?.getAttribute('data-rs-switcher-style') ?? '',
    };
  });

  const tabs = computed.switcher === 'tabs';
  const transparent =
    computed.backgroundColor === 'rgba(0, 0, 0, 0)' || computed.backgroundColor === 'transparent';

  if (computed.display !== 'grid' || computed.position !== 'relative' || (!tabs && transparent)) {
    throw new Error(`Segmented control is unstyled: ${JSON.stringify(computed)}`);
  }

  if (tabs) {
    await page.waitForFunction(() => {
      const option = document.querySelector('.ui-segmented .ui-seg__option[aria-checked="true"]');
      if (!(option instanceof HTMLElement)) {
        return false;
      }
      const border = getComputedStyle(option).borderBottomColor;
      return border !== 'rgba(0, 0, 0, 0)' && border !== 'transparent';
    });
    return;
  }

  await page.waitForFunction(() => {
    const root = document.querySelector('.ui-segmented');
    const option = root?.querySelector('.ui-seg__option[aria-checked="true"]');
    const thumb = root?.querySelector('.ui-seg__thumb');
    if (!(option instanceof HTMLElement) || !(thumb instanceof HTMLElement)) {
      return false;
    }
    const optionBox = option.getBoundingClientRect();
    const thumbBox = thumb.getBoundingClientRect();
    return (
      optionBox.width > 0 &&
      Math.abs(optionBox.width - thumbBox.width) <= 1 &&
      Math.abs(optionBox.height - thumbBox.height) <= 1 &&
      Math.abs(optionBox.left - thumbBox.left) <= 1 &&
      Math.abs(optionBox.top - thumbBox.top) <= 1
    );
  });
}

export async function prepareForScreenshot(page: Page): Promise<void> {
  await page.mouse.move(8, 8);
  await stylesheetsAccessible(page);
  await page.evaluate(async () => {
    document.documentElement.setAttribute('data-visual-test', 'true');
    await document.fonts.ready;
  });

  await page.addStyleTag({ content: FREEZE_MOTION_CSS });
  await page.evaluate(() => {
    window.dispatchEvent(new Event('resize'));
  });

  if ((await page.locator('.ui-segmented').count()) > 0) {
    await assertSegmentedControlStyled(page);
  }

  const masked = page.locator('[data-visual-mask]');
  const count = await masked.count();
  for (let i = 0; i < count; i += 1) {
    await masked.nth(i).evaluate((el) => {
      el.setAttribute('data-visual-mask-hidden', 'true');
      (el as HTMLElement).style.visibility = 'hidden';
    });
  }
}
