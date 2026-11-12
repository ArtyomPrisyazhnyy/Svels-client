import { test, expect } from '../fixtures/test';

const WIDTHS = [390, 1280] as const;

for (const width of WIDTHS) {
  test.describe(`Venue header identity @ ${width}px`, () => {
    test.use({ viewport: { width, height: width === 390 ? 844 : 800 } });

    test('header node persists and keeps height across client navigations', async ({
      page,
      seed,
      asGuest,
    }) => {
      void asGuest;
      const restaurantId = seed.restaurantId;
      const paths = [
        `/restaurants/${restaurantId}`,
        `/restaurants/${restaurantId}/account`,
        `/restaurants/${restaurantId}/pre-order`,
        `/restaurants/${restaurantId}/booking`,
        `/restaurants/${restaurantId}/favorites`,
      ];

      await page.goto(paths[0]);
      await expect(page.getByTestId('venue-header')).toBeVisible();

      await page.evaluate(() => {
        const header = document.querySelector('[data-testid="venue-header"]');
        (window as unknown as { __hdr?: Element }).__hdr = header ?? undefined;
      });

      const homeHeight = await page.getByTestId('venue-header').evaluate((el) => el.getBoundingClientRect().height);

      await page.getByTestId('venue-header-profile').getByTestId('guest-profile-button').click();
      await expect(page).toHaveURL(new RegExp(`/restaurants/${restaurantId}/account`));
      await expect(page.getByTestId('guest-account-page')).toBeVisible();

      const sameOnAccount = await page.evaluate(() => {
        const stored = (window as unknown as { __hdr?: Element }).__hdr;
        const current = document.querySelector('[data-testid="venue-header"]');
        return {
          isConnected: stored?.isConnected === true && stored === current,
          height: current?.getBoundingClientRect().height ?? 0,
        };
      });
      expect(sameOnAccount.isConnected).toBe(true);
      expect(sameOnAccount.height).toBe(homeHeight);

      await page.getByRole('link', { name: 'Мои заказы' }).click();
      await expect(page).toHaveURL(new RegExp(`/restaurants/${restaurantId}/pre-order`));

      const sameOnPreorder = await page.evaluate(() => {
        const stored = (window as unknown as { __hdr?: Element }).__hdr;
        const current = document.querySelector('[data-testid="venue-header"]');
        return stored === current && stored?.isConnected === true;
      });
      expect(sameOnPreorder).toBe(true);

      for (const path of paths.slice(3)) {
        await page.goto(path);
        await expect(page.getByTestId('venue-header')).toBeVisible();
        const height = await page.getByTestId('venue-header').evaluate((el) => el.getBoundingClientRect().height);
        expect(height).toBe(homeHeight);
      }
    });
  });
}
