import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '../fixtures/test';
import { E2E_RESTAURANT_COLOR_THEMES } from '../helpers/restaurant-themes';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import { apiClient } from '../fixtures/test';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';

const VIEWPORT = { width: 390, height: 844 };

async function applyTheme(
  restaurantId: string,
  adminToken: string,
  theme: RestaurantColorTheme,
) {
  const switcherStyle =
    theme === 'midnight' || theme === 'obsidian' || theme === 'ember' ? 'segmented' : 'pill';
  await apiClient.patchStyling(restaurantId, adminToken, {
    colorTheme: theme,
    cardStyle: 'classic',
    headerStyle: 'glass',
    switcherStyle,
  });
  await revalidateRestaurantPublicPage(restaurantId);
}

async function expectNoColorContrastViolations(
  page: import('@playwright/test').Page,
  context: string,
) {
  const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
  expect(
    results.violations,
    `${context}: ${JSON.stringify(results.violations, null, 2)}`,
  ).toEqual([]);
}

test.describe('Color contrast (axe)', () => {
  test('landing @ 390', async ({ page }) => {
    await page.setViewportSize(VIEWPORT);
    await page.goto('/', { waitUntil: 'networkidle' });
    await expectNoColorContrastViolations(page, 'landing');
  });

  for (const theme of E2E_RESTAURANT_COLOR_THEMES) {
    test.describe(`theme: ${theme}`, () => {
      test.beforeEach(async ({ page, seed }) => {
        await page.setViewportSize(VIEWPORT);
        await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
      });

      test('venue menu', async ({ page, seed }) => {
        await page.goto(`/restaurants/${seed.restaurantId}`, { waitUntil: 'networkidle' });
        await expect(page.getByTestId('restaurant-public-page')).toBeVisible();
        await expectNoColorContrastViolations(page, `menu/${theme}`);
      });

      test('pre-order / orders', async ({ page, seed, asGuest }) => {
        void asGuest;
        await page.goto(`/restaurants/${seed.restaurantId}/pre-order`, {
          waitUntil: 'networkidle',
        });
        await expectNoColorContrastViolations(page, `pre-order/${theme}`);
      });

      test('error state playground', async ({ page }) => {
        await page.goto(`/dev/ui/errors?theme=${theme}&variant=network`, {
          waitUntil: 'networkidle',
        });
        await expect(page.getByTestId('dev-error-network')).toBeVisible();
        await expectNoColorContrastViolations(page, `error-network/${theme}`);
      });
    });
  }
});
