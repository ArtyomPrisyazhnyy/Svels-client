import { test, expect } from '../fixtures/test';
import {
  DISABLED_OAUTH_PROVIDERS,
  ENABLED_OAUTH_PROVIDERS,
  E2E_MOCK_GOOGLE_ID_TOKEN,
  blockExternalOAuthScripts,
  installGuestOAuthSdkMocks,
  mockGuestGoogleOAuthLogin,
  mockGuestOAuthProviders,
} from '../helpers/guest-oauth-mock';

test.describe('Guest OAuth in venue auth modal', () => {
  test('без провайдеров модалка без OAuth-блока', async ({ page, seed }) => {
    await mockGuestOAuthProviders(page, seed.restaurantId, DISABLED_OAUTH_PROVIDERS);
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await page.getByTestId('guest-profile-button').click();
    await expect(page.getByTestId('restaurant-auth-modal-panel')).toBeVisible();
    await expect(page.getByTestId('guest-oauth-section')).toHaveCount(0);
    await expect(page.getByTestId('guest-otp-phone-form')).toBeVisible();
  });

  test('с провайдерами: divider, кнопки и вход через Google', async ({ page, seed }) => {
    await installGuestOAuthSdkMocks(page);
    await blockExternalOAuthScripts(page);
    await mockGuestOAuthProviders(page, seed.restaurantId, ENABLED_OAUTH_PROVIDERS);

    const oauthUser = {
      ...seed.guest.user,
      id: 'oauth-guest-user-id',
      phone: undefined,
      firstName: 'Google',
      lastName: 'Guest',
      authProvider: 'google' as const,
      restaurantId: seed.restaurantId,
    };

    await mockGuestGoogleOAuthLogin(
      page,
      seed.restaurantId,
      { accessToken: 'e2e-oauth-access-token', user: oauthUser },
      { needsPhone: true },
    );

    await page.goto(`/restaurants/${seed.restaurantId}`);
    await page.getByTestId('guest-profile-button').click();
    await expect(page.getByTestId('guest-oauth-section')).toBeVisible();
    await expect(page.getByTestId('guest-oauth-divider')).toContainText('или');
    await expect(page.getByTestId('guest-oauth-apple')).toBeVisible();
    await expect(page.getByTestId('guest-oauth-google')).toBeVisible();

    const googleRequest = page.waitForRequest(
      (req) =>
        req.method() === 'POST' &&
        req.url().includes(`/restaurants/${seed.restaurantId}/auth/oauth/google`),
    );

    await page.getByTestId('guest-oauth-google').click();
    const request = await googleRequest;
    expect(request.postDataJSON()).toEqual({ idToken: E2E_MOCK_GOOGLE_ID_TOKEN });

    await expect(page.getByTestId('restaurant-auth-modal')).toBeHidden({ timeout: 10_000 });
  });
});
