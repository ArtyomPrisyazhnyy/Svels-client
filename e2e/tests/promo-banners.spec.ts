import path from 'path';
import { test, expect } from '../fixtures/test';

test.describe.configure({ mode: 'serial' });

const fixtureImage = path.join(__dirname, '../fixtures/promo-banner-source.jpg');

test.describe('Promo banners (venue admin)', () => {
  test.beforeEach(async ({ page, seed }) => {
    await page.goto('/auth/restaurant');
    await page.getByTestId('auth-tab-login').click();
    await page.getByTestId('login-email').fill(seed.restaurantAdmin.email);
    await page.getByTestId('login-password').fill(seed.restaurantAdmin.password);
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/\/restaurant-admin\/menu$/);
  });

  test('strip 4:1 — crop, preview and public strip respect format', async ({ page, seed }) => {
    await page.goto('/restaurant-admin/banners');
    await expect(page.getByTestId('promo-banners-admin')).toBeVisible();

    await page.getByTestId('promo-banner-file-input').setInputFiles(fixtureImage);
    await expect(page.getByTestId('promo-banner-cropper')).toBeVisible();
    await page.getByTestId('promo-banner-cropper-apply').click();

    await expect(page.getByTestId('promo-banner-cropper')).not.toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('promo-banner-admin-preview-frame')).toBeVisible();

    const previewFrame = page.getByTestId('promo-banner-admin-preview-frame');
    await expect(previewFrame).toHaveCSS('aspect-ratio', '4 / 1');

    await page.getByTestId('promo-banner-submit').click();
    await expect(page.getByText('Пока нет баннеров.')).not.toBeVisible({ timeout: 15_000 });

    await page.goto(`/restaurants/${seed.restaurantId}`);
    await expect(page.getByTestId('promo-banner-strip')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('promo-banner-strip-frame-4_1')).toBeVisible();
    await expect(page.getByTestId('promo-banner-strip-frame-4_1')).toHaveCSS(
      'aspect-ratio',
      '4 / 1',
    );
  });

  test('switching strip format re-locks cropper aspect', async ({ page }) => {
    await page.goto('/restaurant-admin/banners');
    await page.getByTestId('promo-banner-file-input').setInputFiles(fixtureImage);
    await expect(page.getByTestId('promo-banner-cropper-viewport')).toBeVisible();

    const viewport = page.getByTestId('promo-banner-cropper-viewport');
    await expect
      .poll(async () => (await viewport.boundingBox())?.height ?? 0)
      .toBeGreaterThan(40);
    const box4 = await viewport.boundingBox();

    await page.getByLabel('16∶9 — как на ТВ').check();
    await expect(page.getByTestId('promo-banner-cropper')).toBeVisible();
    await expect
      .poll(async () => (await viewport.boundingBox())?.height ?? 0)
      .toBeGreaterThan(40);
    const box16 = await viewport.boundingBox();

    expect(box4).not.toBeNull();
    expect(box16).not.toBeNull();
    if (box4 && box16) {
      expect(box16.height).toBeGreaterThan(box4.height);
    }
  });

  test('edit shows re-crop hint for stored original after save', async ({ page, seed }) => {
    await page.goto('/restaurant-admin/banners');
    const bannerTitle = `E2E recrop ${seed.restaurantId.slice(0, 8)}`;
    await page.getByLabel('Заголовок').fill(bannerTitle);
    await page.getByTestId('promo-banner-file-input').setInputFiles(fixtureImage);
    await page.getByTestId('promo-banner-cropper-apply').click();
    await expect(page.getByTestId('promo-banner-cropper')).not.toBeVisible({ timeout: 30_000 });
    await page.getByTestId('promo-banner-submit').click();
    await expect(page.getByText(bannerTitle)).toBeVisible({ timeout: 20_000 });

    await page.getByRole('listitem').filter({ hasText: bannerTitle }).getByRole('button', { name: 'Изменить' }).click();
    await expect(page.getByTestId('promo-banner-recrop-hint')).toContainText(
      'Исходник сохранён',
    );
    await expect(page.getByTestId('promo-banner-recrop-button')).toBeVisible();
  });
});
