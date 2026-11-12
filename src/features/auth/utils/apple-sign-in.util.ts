import type { AppleAuthInitConfig } from '../types/apple-sign-in';
import { loadScript } from './load-script.util';

const APPLE_SCRIPT =
  'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';

export async function loadAppleSignInScript(): Promise<void> {
  await loadScript(APPLE_SCRIPT, 'appleid-auth-js');
  if (!window.AppleID?.auth) {
    throw new Error('apple_sign_in_unavailable');
  }
}

export async function initAppleSignIn(config: AppleAuthInitConfig): Promise<void> {
  await loadAppleSignInScript();
  window.AppleID!.auth.init(config);
}

export function isAppleSignInCancelError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  const message = error.message.toLowerCase();
  return (
    message.includes('popup_closed') ||
    message.includes('user_cancelled') ||
    message.includes('canceled') ||
    message.includes('cancelled')
  );
}
