import { expect, type Page } from '@playwright/test';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';
import { RESTAURANT_COLOR_THEME_TOKENS } from '../../src/shared/design-tokens/color-themes';

function normalizeCssColor(value: string): string {
  return value.trim().toLowerCase();
}

export async function expectRestaurantThemeApplied(
  page: Page,
  theme: RestaurantColorTheme,
  context = 'page',
): Promise<void> {
  const expected = RESTAURANT_COLOR_THEME_TOKENS[theme];

  await expect(page.locator('html')).toHaveAttribute('data-rs-theme', theme, { timeout: 15_000 });

  const primary = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--rs-primary'),
  );
  const bg = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--rs-bg'),
  );

  expect(normalizeCssColor(primary), `${context}: --rs-primary`).toBe(
    normalizeCssColor(expected.primary),
  );
  expect(normalizeCssColor(bg), `${context}: --rs-bg`).toBe(normalizeCssColor(expected.bg));

  const rootTheme = await page
    .getByTestId('dev-error-playground-root')
    .getAttribute('data-rs-theme');
  if (rootTheme) {
    expect(rootTheme, `${context}: playground root`).toBe(theme);
  }
}

export async function expectRestaurantThemeOnVenue(
  page: Page,
  theme: RestaurantColorTheme,
  context = 'venue',
): Promise<void> {
  const expected = RESTAURANT_COLOR_THEME_TOKENS[theme];
  const root = page.locator('.restaurant-styled').first();
  await expect(root).toHaveAttribute('data-rs-theme', theme, { timeout: 15_000 });

  const primary = await root.evaluate((el) =>
    getComputedStyle(el).getPropertyValue('--rs-primary'),
  );
  const bg = await root.evaluate((el) => getComputedStyle(el).getPropertyValue('--rs-bg'));

  expect(normalizeCssColor(primary), `${context}: --rs-primary`).toBe(
    normalizeCssColor(expected.primary),
  );
  expect(normalizeCssColor(bg), `${context}: --rs-bg`).toBe(normalizeCssColor(expected.bg));
}
