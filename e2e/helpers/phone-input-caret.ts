import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export async function gotoGuestPhoneStep(page: Page, restaurantId: string) {
  await page.goto(`/restaurants/${restaurantId}/auth`);
  const phoneInput = page.getByTestId('otp-phone');
  await expect(phoneInput).toBeVisible();
  return phoneInput;
}

export async function expectSelectionStart(
  phoneInput: ReturnType<Page['getByTestId']>,
  index: number,
) {
  await expect
    .poll(async () => phoneInput.evaluate((el) => (el as HTMLInputElement).selectionStart))
    .toBe(index);
}

export async function setCaret(phoneInput: ReturnType<Page['getByTestId']>, index: number) {
  await phoneInput.evaluate((el, caret) => {
    const input = el as HTMLInputElement;
    input.setSelectionRange(caret, caret);
  }, index);
}

/** Click inside the input so the caret lands at `charIndex` (measured, not a fixed % width). */
export async function clickInputAtCharIndex(
  phoneInput: ReturnType<Page['getByTestId']>,
  charIndex: number,
) {
  const box = await phoneInput.boundingBox();
  if (!box) {
    throw new Error('otp-phone bounding box missing');
  }
  const clickX = await phoneInput.evaluate((el, idx) => {
    const input = el as HTMLInputElement;
    const style = window.getComputedStyle(input);
    const mirror = document.createElement('span');
    mirror.style.position = 'absolute';
    mirror.style.visibility = 'hidden';
    mirror.style.whiteSpace = 'pre';
    mirror.style.font = style.font;
    mirror.textContent = input.value.slice(0, idx);
    document.body.appendChild(mirror);
    const textWidth = mirror.getBoundingClientRect().width;
    document.body.removeChild(mirror);
    const paddingLeft = Number.parseFloat(style.paddingLeft) || 0;
    return paddingLeft + textWidth + 1;
  }, charIndex);
  await phoneInput.click({ position: { x: clickX, y: box.height / 2 } });
}

/** Operator-code edit: backspace ×2 at caret after code, then type 29. */
export async function expectOperatorCodeBackspaceFlow(
  phoneInput: ReturnType<Page['getByTestId']>,
) {
  await phoneInput.click();
  await phoneInput.pressSequentially('260000001', { delay: 20 });
  await expect(phoneInput).toHaveValue('26 000-00-01');

  await setCaret(phoneInput, 2);

  await phoneInput.press('Backspace');
  await expect(phoneInput).toHaveValue('20 000-00-1');
  await expectSelectionStart(phoneInput, 1);

  await phoneInput.press('Backspace');
  await expect(phoneInput).toHaveValue('00 000-01');

  await phoneInput.pressSequentially('29', { delay: 20 });
  await expect(phoneInput).toHaveValue('29 000-00-01');
  await expectSelectionStart(phoneInput, 2);
}

/** Backspace when caret sits right after the mask space (not on the last digit). */
export async function expectBackspaceAfterMaskSpace(
  phoneInput: ReturnType<Page['getByTestId']>,
) {
  await phoneInput.click();
  await phoneInput.fill('');
  await phoneInput.pressSequentially('291234567', { delay: 15 });
  await expect(phoneInput).toHaveValue('29 123-45-67');

  await setCaret(phoneInput, 3);
  await phoneInput.press('Backspace');
  await expect(phoneInput).toHaveValue('21 234-56-7');
  await expectSelectionStart(phoneInput, 1);
}

/** Delete removes the digit at the caret, not trailing digits. */
export async function expectDeleteAtCaret(phoneInput: ReturnType<Page['getByTestId']>) {
  await phoneInput.click();
  await phoneInput.fill('');
  await phoneInput.pressSequentially('291234567', { delay: 15 });
  await expect(phoneInput).toHaveValue('29 123-45-67');

  await setCaret(phoneInput, 2);
  await phoneInput.press('Delete');
  await expect(phoneInput).toHaveValue('29 234-56-7');
  await expectSelectionStart(phoneInput, 2);
}

/** Selected range + typed digits replaces in place. */
export async function expectSelectionReplace(
  phoneInput: ReturnType<Page['getByTestId']>,
) {
  await phoneInput.click();
  await phoneInput.fill('');
  await phoneInput.pressSequentially('291234567', { delay: 15 });
  await expect(phoneInput).toHaveValue('29 123-45-67');

  await phoneInput.evaluate((el) => {
    const input = el as HTMLInputElement;
    input.setSelectionRange(3, 6);
  });
  await phoneInput.pressSequentially('000', { delay: 15 });
  await expect(phoneInput).toHaveValue('29 000-45-67');
}

/** Arrow keys move caret; backspace edits at caret. */
export async function expectArrowCaretThenBackspace(
  phoneInput: ReturnType<Page['getByTestId']>,
) {
  await phoneInput.click();
  await phoneInput.fill('');
  await phoneInput.pressSequentially('261234567', { delay: 15 });
  await expect(phoneInput).toHaveValue('26 123-45-67');

  await phoneInput.press('Home');
  await phoneInput.press('ArrowRight');
  await phoneInput.press('ArrowRight');
  await expectSelectionStart(phoneInput, 2);

  await phoneInput.press('Backspace');
  await expect(phoneInput).toHaveValue('21 234-56-7');
  await expectSelectionStart(phoneInput, 1);
}

/** Click inside the field to move caret (desktop pointer), then backspace. */
export async function expectMouseCaretThenBackspace(
  phoneInput: ReturnType<Page['getByTestId']>,
) {
  await phoneInput.click();
  await phoneInput.fill('');
  await phoneInput.pressSequentially('261234567', { delay: 15 });
  await expect(phoneInput).toHaveValue('26 123-45-67');

  await clickInputAtCharIndex(phoneInput, 2);

  await expectSelectionStart(phoneInput, 2);

  await phoneInput.press('Backspace');
  await expect(phoneInput).toHaveValue('21 234-56-7');
}
