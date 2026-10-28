import fs from 'fs';
import path from 'path';
import { test, expect, apiClient } from '../fixtures/test';
import type { E2eSeed } from '../helpers/env';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';
import type { Page } from '@playwright/test';

const fixtureImage = path.join(__dirname, '../fixtures/promo-banner-source.jpg');
const OUT_DIR = '/opt/cursor/artifacts/screenshots';

async function applyTheme(
  restaurantId: string,
  adminToken: string,
  theme: RestaurantColorTheme,
) {
  const switcherStyle = theme === 'midnight' ? 'segmented' : 'pill';
  await apiClient.patchStyling(restaurantId, adminToken, {
    colorTheme: theme,
    cardStyle: 'classic',
    headerStyle: 'glass',
    switcherStyle,
  });
}

async function loginAdmin(page: Page, seed: E2eSeed) {
  await page.goto('/auth/restaurant');
  await page.getByTestId('auth-tab-login').click();
  await page.getByTestId('login-email').fill(seed.restaurantAdmin.email);
  await page.getByTestId('login-password').fill(seed.restaurantAdmin.password);
  await page.getByTestId('login-submit').click();
  await expect(page).toHaveURL(/\/restaurant-admin\/menu$/);
}

test.describe.configure({ mode: 'serial' });

test.describe('Promo banner walkthrough capture', () => {
  test.skip(!process.env.CAPTURE_WALKTHROUGH, 'Set CAPTURE_WALKTHROUGH=1 to generate artifacts');

  test('screenshots for classic/midnight cropper and public 4:1 strip', async ({ page, seed }) => {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    await loginAdmin(page, seed);

    for (const theme of ['classic', 'midnight'] as const) {
      await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
      await page.goto('/restaurant-admin/banners');
      await page.getByTestId('promo-banner-file-input').setInputFiles(fixtureImage);
      await expect(page.getByTestId('promo-banner-cropper')).toBeVisible();

      for (const [label, width, height] of [
        ['390', 390, 844],
        ['1280', 1280, 800],
      ] as const) {
        await page.setViewportSize({ width, height });
        await page.getByTestId('promo-banner-cropper').scrollIntoViewIfNeeded();
        await page.getByTestId('promo-banner-cropper').screenshot({
          path: path.join(OUT_DIR, `promo-cropper-${theme}-${label}.png`),
        });
      }

      await page.getByTestId('promo-banner-cropper-apply').click();
      await expect(page.getByTestId('promo-banner-cropper')).not.toBeVisible({ timeout: 30_000 });
      await page.getByLabel('Заголовок').fill(`Walkthrough 4:1 ${theme}`);
      await page.getByTestId('promo-banner-submit').click();
      await expect(page.getByText(`Walkthrough 4:1 ${theme}`)).toBeVisible({ timeout: 20_000 });

      await page.goto(`/restaurants/${seed.restaurantId}?walkthrough=${theme}`);
      await expect(page.getByTestId('promo-banner-strip-frame-4_1').first()).toBeVisible({
        timeout: 15_000,
      });

      for (const [label, width, height] of [
        ['390', 390, 844],
        ['1280', 1280, 800],
      ] as const) {
        await page.setViewportSize({ width, height });
        await page.getByTestId('promo-banner-strip').scrollIntoViewIfNeeded();
        await page.getByTestId('promo-banner-strip').screenshot({
          path: path.join(OUT_DIR, `promo-public-4-1-${theme}-${label}.png`),
        });
      }
    }
  });
});
