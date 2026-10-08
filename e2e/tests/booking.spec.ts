import { test, expect, apiClient } from '../fixtures/test';

test.describe('Booking', () => {
  test('неавторизованный гость перенаправляется на auth', async ({ page, seed }) => {
    await page.goto(`/restaurants/${seed.restaurantId}/booking`);
    await expect(page).toHaveURL(new RegExp(`/restaurants/${seed.restaurantId}/auth`));
  });

  test('страница бронирования доступна авторизованному гостю', async ({
    page,
    seed,
    asGuest,
  }) => {
    void asGuest;
    const settings = await apiClient.getBookingSettings(seed.restaurantId);

    await page.goto(`/restaurants/${seed.restaurantId}/booking`);

    if (!settings.bookingEnabled) {
      await expect(
        page.getByText('Бронирование столов в этом заведении недоступно.'),
      ).toBeVisible({ timeout: 15_000 });
      return;
    }

    await expect(page.getByTestId('booking-date')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('booking-guests')).toBeVisible();
    await expect(page.getByTestId('booking-submit')).toBeVisible();
  });

  test('выбор слота и попытка бронирования (если есть свободные слоты)', async ({
    page,
    seed,
    asGuest,
  }) => {
    void asGuest;
    const settings = await apiClient.getBookingSettings(seed.restaurantId);
    test.skip(!settings.bookingEnabled, 'Booking disabled for seeded restaurant');

    await page.goto(`/restaurants/${seed.restaurantId}/booking`);
    await expect(page.getByTestId('booking-date')).toBeVisible({ timeout: 15_000 });

    const slot = page.locator('.guest-booking__slot:not([disabled])').first();
    if ((await slot.count()) === 0) {
      test.info().annotations.push({
        type: 'note',
        description: 'No free slots — UI still rendered',
      });
      await expect(page.getByTestId('booking-submit')).toBeDisabled();
      return;
    }

    await slot.click();

    if (settings.mode === 'specific_table') {
      await expect(page.getByText(/планировк|стола/i).first()).toBeVisible();
      return;
    }

    await expect(page.getByTestId('booking-submit')).toBeEnabled();
    await page.getByTestId('booking-submit').click();
    await expect(page.getByText(/забронирован|успеш|подтвержден|бронь/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
