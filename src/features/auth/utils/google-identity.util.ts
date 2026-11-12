/**
 * Google Identity Services (GIS): we load `https://accounts.google.com/gsi/client` lazily,
 * render a hidden official sign-in button, and programmatically activate it on our custom
 * button click (same user gesture). The `callback` receives JWT `credential` — the id_token
 * expected by the backend.
 */
import { loadScript } from './load-script.util';

const GSI_SCRIPT = 'https://accounts.google.com/gsi/client';

export async function loadGoogleIdentityServices(): Promise<void> {
  await loadScript(GSI_SCRIPT, 'google-gsi-client');
  if (!window.google?.accounts?.id) {
    throw new Error('google_identity_unavailable');
  }
}

export async function requestGoogleIdToken(clientId: string): Promise<string | null> {
  await loadGoogleIdentityServices();

  return new Promise((resolve) => {
    let settled = false;
    const finish = (value: string | null) => {
      if (settled) {
        return;
      }
      settled = true;
      window.clearTimeout(timeoutId);
      container.remove();
      resolve(value);
    };

    const container = document.createElement('div');
    container.setAttribute('aria-hidden', 'true');
    container.style.cssText =
      'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none';

    document.body.appendChild(container);

    const timeoutId = window.setTimeout(() => finish(null), 120_000);

    window.google!.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        finish(response.credential ?? null);
      },
      cancel_on_tap_outside: true,
    });

    window.google!.accounts.id.renderButton(container, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      width: 280,
      text: 'continue_with',
    });

    window.requestAnimationFrame(() => {
      const inner = container.querySelector<HTMLElement>('[role="button"]');
      if (!inner) {
        finish(null);
        return;
      }
      inner.click();
    });
  });
}
