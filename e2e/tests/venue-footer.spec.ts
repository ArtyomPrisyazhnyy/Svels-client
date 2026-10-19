import { test, expect } from '../fixtures/test';

async function assertVenueFooterSvelsLink(
  page: import('@playwright/test').Page,
): Promise<void> {
  const footer = page.getByTestId('restaurant-footer');
  await expect(footer).toBeVisible();
  const link = footer.getByTestId('restaurant-footer-svels-home');
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', '/');
  await expect(link).toHaveAttribute('aria-label', 'Svels — главная');
}

test.describe('Venue footer on guest subpages', () => {
  test('главная страница заведения показывает подвал', async ({ page, seed }) => {
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await expect(page.getByTestId('restaurant-public-page')).toBeVisible();
    await assertVenueFooterSvelsLink(page);
  });

  test('личный кабинет показывает подвал', async ({ page, seed, asGuest }) => {
    void asGuest;
    await page.goto(`/restaurants/${seed.restaurantId}/account`);
    await expect(page.getByTestId('guest-account-page')).toBeVisible({ timeout: 30_000 });
    await assertVenueFooterSvelsLink(page);
  });

  test('избранное показывает подвал', async ({ page, seed }) => {
    await page.goto(`/restaurants/${seed.restaurantId}/favorites`);
    await expect(page.getByTestId('guest-favorites-page')).toBeVisible({ timeout: 30_000 });
    await assertVenueFooterSvelsLink(page);
  });

  test('кнопка «наверх» не перекрывает текст подвала на 390', async ({ page, seed, asGuest }) => {
    void asGuest;
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/restaurants/${seed.restaurantId}/account`);
    await expect(page.getByTestId('guest-account-page')).toBeVisible({ timeout: 30_000 });
    await page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
    });
    const button = page.getByTestId('scroll-to-top');
    await expect(button).toHaveClass(/scroll-to-top--visible/);

    const overlaps = await page.evaluate(() => {
      const buttonEl = document.querySelector('[data-testid="scroll-to-top"]');
      const bottom = document.querySelector('.restaurant-public__footer-bottom');
      if (!(buttonEl instanceof HTMLElement) || !(bottom instanceof HTMLElement)) {
        return true;
      }
      const buttonBox = buttonEl.getBoundingClientRect();
      const walker = document.createTreeWalker(bottom, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        const value = node.textContent?.trim() ?? '';
        if (value.length > 0 && node.parentElement) {
          const range = document.createRange();
          range.selectNodeContents(node);
          for (const rect of range.getClientRects()) {
            const hits =
              rect.width > 0 &&
              rect.height > 0 &&
              rect.left < buttonBox.right &&
              rect.right > buttonBox.left &&
              rect.top < buttonBox.bottom &&
              rect.bottom > buttonBox.top;
            if (hits) {
              return true;
            }
          }
        }
        node = walker.nextNode();
      }
      return false;
    });
    expect(overlaps).toBe(false);
  });
});
