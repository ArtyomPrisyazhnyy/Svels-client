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

export async function prepareForScreenshot(page: Page): Promise<void> {
  await page.evaluate(async () => {
    document.documentElement.setAttribute('data-visual-test', 'true');
    await document.fonts.ready;
  });

  await page.addStyleTag({ content: FREEZE_MOTION_CSS });

  const masked = page.locator('[data-visual-mask]');
  const count = await masked.count();
  for (let i = 0; i < count; i += 1) {
    await masked.nth(i).evaluate((el) => {
      el.setAttribute('data-visual-mask-hidden', 'true');
      (el as HTMLElement).style.visibility = 'hidden';
    });
  }
}
