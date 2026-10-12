import { test, expect } from '../fixtures/test';

const GUEST_SUBPAGES = [
  { path: 'account', skeletonTestId: 'guest-account-skeleton' },
  { path: 'pre-order', skeletonTestId: 'guest-preorder-skeleton' },
  { path: 'booking', skeletonTestId: 'guest-booking-skeleton' },
] as const;

test.describe('Guest subpages loading shell', () => {
  for (const { path, skeletonTestId } of GUEST_SUBPAGES) {
    test(`${path}: SSR contains header + skeleton, no auth waterfall text`, async ({
      browser,
      seed,
    }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(`/restaurants/${seed.restaurantId}/${path}`);

      const html = await page.content();
      expect(html).toContain('data-testid="venue-header"');
      expect(html).toContain(`data-testid="${skeletonTestId}"`);
      expect(html).not.toContain('Проверка доступа');
      expect(html).not.toContain('Загрузка');

      await context.close();
    });
  }

  test('pre-order: logged-in guest sees orders and cache on revisit', async ({ page, seed, asGuest }) => {
    void asGuest;
    const url = `/restaurants/${seed.restaurantId}/pre-order`;

    await page.goto(url);
    await expect(page.getByTestId('guest-orders-list')).toBeVisible({ timeout: 30_000 });

    await page.reload();

    await expect(page.getByTestId('guest-orders-list')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId('guest-orders-list-skeleton')).toHaveCount(0);
    await expect(page.getByTestId('guest-preorder-skeleton')).toHaveCount(0);
  });
});
