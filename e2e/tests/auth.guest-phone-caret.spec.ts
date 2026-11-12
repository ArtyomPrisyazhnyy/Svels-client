import { devices } from '@playwright/test';
import { test } from '../fixtures/test';
import {
  expectArrowCaretThenBackspace,
  expectBackspaceAfterMaskSpace,
  expectDeleteAtCaret,
  expectMouseCaretThenBackspace,
  expectOperatorCodeBackspaceFlow,
  expectSelectionReplace,
  gotoGuestPhoneStep,
} from '../helpers/phone-input-caret';

const CARET_DEVICE_PROFILES = [
  { label: 'desktop Chrome', use: devices['Desktop Chrome'] },
  { label: 'iPhone 13', use: devices['iPhone 13'] },
  { label: 'Pixel 7', use: devices['Pixel 7'] },
] as const;

for (const profile of CARET_DEVICE_PROFILES) {
  test.describe(`Guest OTP phone input caret (${profile.label})`, () => {
    test.use({
      viewport: profile.use.viewport,
      userAgent: profile.use.userAgent,
      deviceScaleFactor: profile.use.deviceScaleFactor,
      isMobile: profile.use.isMobile,
      hasTouch: profile.use.hasTouch,
    });

    test('backspace in the middle edits at caret, not at the end', async ({ page, seed }) => {
      const phoneInput = await gotoGuestPhoneStep(page, seed.restaurantId);
      await expectOperatorCodeBackspaceFlow(phoneInput);
    });

    test('backspace after mask space deletes previous digit', async ({ page, seed }) => {
      const phoneInput = await gotoGuestPhoneStep(page, seed.restaurantId);
      await expectBackspaceAfterMaskSpace(phoneInput);
    });

    test('Delete at caret removes next digit', async ({ page, seed }) => {
      const phoneInput = await gotoGuestPhoneStep(page, seed.restaurantId);
      await expectDeleteAtCaret(phoneInput);
    });

    test('selection replace keeps mask structure', async ({ page, seed }) => {
      const phoneInput = await gotoGuestPhoneStep(page, seed.restaurantId);
      await expectSelectionReplace(phoneInput);
    });

    test('arrow keys + backspace edit at caret', async ({ page, seed }) => {
      const phoneInput = await gotoGuestPhoneStep(page, seed.restaurantId);
      await expectArrowCaretThenBackspace(phoneInput);
    });

    test('mouse caret placement then backspace', async ({ page, seed }) => {
      test.skip(profile.use.isMobile === true, 'fine-grained click-to-caret varies on touch UI');
      const phoneInput = await gotoGuestPhoneStep(page, seed.restaurantId);
      await expectMouseCaretThenBackspace(phoneInput);
    });
  });
}
