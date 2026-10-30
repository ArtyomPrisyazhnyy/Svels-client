import { test, expect } from '../fixtures/test';

test.describe('Guest OTP phone input caret', () => {
  test('backspace in the middle of the mask edits at caret, not at the end', async ({
    page,
    seed,
  }) => {
    await page.goto(`/restaurants/${seed.restaurantId}/auth`);
    const phoneInput = page.getByTestId('otp-phone');
    await expect(phoneInput).toBeVisible();

    await phoneInput.click();
    await phoneInput.pressSequentially('260000001', { delay: 20 });
    await expect(phoneInput).toHaveValue('26 000-00-01');

    await phoneInput.evaluate((el) => {
      const input = el as HTMLInputElement;
      input.setSelectionRange(2, 2);
    });

    await phoneInput.press('Backspace');
    await expect(phoneInput).toHaveValue('20 000-00-1');
    await expect
      .poll(async () => phoneInput.evaluate((el) => (el as HTMLInputElement).selectionStart))
      .toBe(1);

    await phoneInput.press('Backspace');
    await expect(phoneInput).toHaveValue('00 000-01');

    await phoneInput.pressSequentially('29', { delay: 20 });
    await expect(phoneInput).toHaveValue('29 000-00-01');
    await expect
      .poll(async () => phoneInput.evaluate((el) => (el as HTMLInputElement).selectionStart))
      .toBe(2);
  });
});
