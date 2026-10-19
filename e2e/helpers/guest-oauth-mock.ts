import type { Page } from '@playwright/test';
import type { AuthResponse } from './api';

export const E2E_MOCK_GOOGLE_ID_TOKEN = 'e2e-mock-google-id-token';
export const E2E_MOCK_APPLE_ID_TOKEN = 'e2e-mock-apple-id-token';

export const ENABLED_OAUTH_PROVIDERS = {
  google: { enabled: true, clientId: 'e2e-google-client-id.apps.googleusercontent.com' },
  apple: {
    enabled: true,
    serviceId: 'e2e.apple.service',
    redirectUri: 'https://e2e.example/auth/apple/callback',
  },
};

export const DISABLED_OAUTH_PROVIDERS = {
  google: { enabled: false, clientId: '' },
  apple: { enabled: false, serviceId: '', redirectUri: '' },
};

export async function mockGuestOAuthProviders(
  page: Page,
  restaurantId: string,
  providers: typeof ENABLED_OAUTH_PROVIDERS | typeof DISABLED_OAUTH_PROVIDERS,
): Promise<void> {
  await page.route(`**/restaurants/${restaurantId}/auth/oauth/providers`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(providers),
    });
  });
}

export async function blockExternalOAuthScripts(page: Page): Promise<void> {
  await page.route('**/accounts.google.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: '/* e2e: keep window.google mock from addInitScript */',
    });
  });
  await page.route('**/appleid.cdn-apple.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: '/* e2e: keep window.AppleID mock from addInitScript */',
    });
  });
}

export async function installGuestOAuthSdkMocks(page: Page): Promise<void> {
  await page.addInitScript(() => {
    type GsiCallback = (response: { credential?: string }) => void;

    window.google = {
      accounts: {
        id: {
          initialize(config: { callback: GsiCallback }) {
            (window as unknown as { __e2eGsiCallback?: GsiCallback }).__e2eGsiCallback =
              config.callback;
          },
          renderButton(container: HTMLElement) {
            const btn = document.createElement('div');
            btn.setAttribute('role', 'button');
            btn.addEventListener('click', () => {
              const callback = (window as unknown as { __e2eGsiCallback?: GsiCallback })
                .__e2eGsiCallback;
              callback?.({ credential: 'e2e-mock-google-id-token' });
            });
            container.appendChild(btn);
          },
          prompt: () => undefined,
          disableAutoSelect: () => undefined,
        },
      },
    };

    window.AppleID = {
      auth: {
        init: () => undefined,
        signIn: async () => ({
          authorization: { id_token: 'e2e-mock-apple-id-token' },
          user: { name: { firstName: 'OAuth', lastName: 'Guest' } },
        }),
      },
    };
  });
}

export async function mockGuestGoogleOAuthLogin(
  page: Page,
  restaurantId: string,
  auth: AuthResponse,
  options: { isNew?: boolean; needsPhone?: boolean } = {},
): Promise<void> {
  await page.route(`**/restaurants/${restaurantId}/auth/oauth/google`, async (route) => {
    const body = route.request().postDataJSON() as { idToken?: string };
    if (body.idToken !== E2E_MOCK_GOOGLE_ID_TOKEN) {
      await route.fulfill({ status: 400, body: JSON.stringify({ message: 'bad token' }) });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ...auth,
        isNew: options.isNew ?? false,
        needsPhone: options.needsPhone ?? false,
      }),
    });
  });
}
