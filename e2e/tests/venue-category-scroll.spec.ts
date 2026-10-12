import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures/test';

const VIEWPORTS = [
  // Shorter than a phone so the third category can scroll up to the spy line.
  { width: 390, height: 560 },
  { width: 1280, height: 800 },
] as const;

function chip(page: Page, categoryId: string) {
  return page.locator(
    `.restaurant-menu__category-nav-btn[data-category-id="${categoryId}"]`,
  );
}

async function expectActiveChip(page: Page, categoryId: string) {
  await expect(chip(page, categoryId)).toHaveClass(/restaurant-menu__category-nav-btn--active/);
}

async function readChipLanding(page: Page, categoryId: string) {
  return page.evaluate((id) => {
    const nav = document.querySelector('[data-testid="venue-home-category-nav"]');
    const heading = document.querySelector(
      `#menu-category-${CSS.escape(id)} .restaurant-menu__category-title`,
    );
    if (!(nav instanceof HTMLElement) || !(heading instanceof HTMLElement)) {
      return { delta: 999, fullyVisible: false, settled: false };
    }

    const navBox = nav.getBoundingClientRect();
    const box = heading.getBoundingClientRect();
    const delta = Math.abs(box.top - (navBox.bottom + 16));
    const fullyVisible =
      box.height > 8 &&
      box.top >= navBox.bottom - 1 &&
      box.bottom <= window.innerHeight + 0.5 &&
      box.left >= -0.5 &&
      box.right <= window.innerWidth + 0.5;

    return { delta, fullyVisible, settled: false };
  }, categoryId);
}

for (const viewport of VIEWPORTS) {
  test.describe(`category chip scroll @ ${viewport.width}px`, () => {
    test.use({ viewport });

    test('second chip places the heading 16px below the sticky nav', async ({ page, seed }) => {
      await page.goto(`/restaurants/${seed.restaurantId}`);
      await expect(page.getByTestId('restaurant-public-page')).toBeVisible({ timeout: 30_000 });
      const nav = page.getByTestId('venue-home-category-nav');
      await expect(nav).toBeVisible();

      await expect
        .poll(async () =>
          page.evaluate(async () => {
            await document.fonts.ready;
            const bar = document.querySelector('[data-testid="venue-home-category-nav"]');
            const declared = Number.parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue('--venue-nav-h'),
            );
            if (!(bar instanceof HTMLElement) || !Number.isFinite(declared)) {
              return 999;
            }
            return Math.abs(bar.getBoundingClientRect().height - declared);
          }),
        )
        .toBeLessThanOrEqual(0.5);

      const secondChip = page.locator('.restaurant-menu__category-nav-btn').nth(1);
      await expect(secondChip).toBeVisible();
      const categoryId = await secondChip.getAttribute('data-category-id');
      expect(categoryId).toBeTruthy();
      if (!categoryId) {
        return;
      }

      await secondChip.click();

      await expect
        .poll(async () => {
          const first = await readChipLanding(page, categoryId);
          const second = await readChipLanding(page, categoryId);
          if (Math.abs(first.delta - second.delta) > 0.5) {
            return 999;
          }
          return first.fullyVisible ? first.delta : 999;
        })
        .toBeLessThanOrEqual(2);
      await expectActiveChip(page, categoryId);

      const chips = page.locator('.restaurant-menu__category-nav-btn');
      expect(await chips.count()).toBeGreaterThanOrEqual(3);
      const thirdChip = chips.nth(2);
      const thirdId = await thirdChip.getAttribute('data-category-id');
      expect(thirdId).toBeTruthy();
      if (!thirdId) {
        return;
      }

      await page.evaluate((id) => {
        document.getElementById(`menu-category-${id}`)?.scrollIntoView({
          block: 'start',
          behavior: 'auto',
        });
      }, thirdId);
      await expectActiveChip(page, thirdId);
    });
  });
}
