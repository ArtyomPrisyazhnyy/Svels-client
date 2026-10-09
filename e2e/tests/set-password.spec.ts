import { test, expect } from '../fixtures/test';
import { getApiUrl, readSeed } from '../helpers/env';

test.describe('Set password', () => {
  test('INVALID_SET_PASSWORD_TOKEN на странице', async ({ page }) => {
    await page.goto('/auth/set-password?token=not-a-valid-set-password-token');
    await page.getByTestId('set-password-input').fill('ValidPass1!');
    await page.getByTestId('set-password-confirm').fill('ValidPass1!');
    await page.getByTestId('set-password-submit').click();

    await expect(page.getByTestId('set-password-error')).toHaveText(/недействительна/i, {
      timeout: 15_000,
    });
    await expect(page).toHaveURL(/\/auth\/set-password/);
  });

  test('SET_PASSWORD_TOKEN_USED после повторной установки', async ({ page }) => {
    const stamp = Date.now().toString(36);
    const seed = readSeed();
    const superToken = seed.superAdmin.auth.accessToken;

    const createResponse = await page.request.post(`${getApiUrl()}/restaurants/admin/create`, {
      headers: {
        Authorization: `Bearer ${superToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        name: `Reuse Token ${stamp}`,
        address: 'ул. Повтор 10',
        owner: {
          email: `e2e.reuse.${stamp}@svels.test`,
          firstName: 'Reuse',
        },
      },
    });

    expect(createResponse.ok()).toBeTruthy();
    const body = (await createResponse.json()) as { setPasswordUrl: string };
    const token = new URL(body.setPasswordUrl).searchParams.get('token');
    expect(token).toBeTruthy();

    const password = `E2eReuse!${stamp}`;
    await page.goto(`/auth/set-password?token=${encodeURIComponent(token!)}`);
    await page.getByTestId('set-password-input').fill(password);
    await page.getByTestId('set-password-confirm').fill(password);
    await page.getByTestId('set-password-submit').click();
    await expect(page).toHaveURL(/\/restaurant-admin/, { timeout: 20_000 });

    await page.goto(`/auth/set-password?token=${encodeURIComponent(token!)}`);
    await page.getByTestId('set-password-input').fill(`${password}x`);
    await page.getByTestId('set-password-confirm').fill(`${password}x`);
    await page.getByTestId('set-password-submit').click();

    await expect(page.getByTestId('set-password-error')).toHaveText(/уже была использована/i, {
      timeout: 15_000,
    });
  });
});
