import { test, expect, apiClient } from '../fixtures/test';

test.describe('Restaurant public page', () => {
  test('публичная страница показывает название и меню-блок', async ({ page, seed }) => {
    await page.goto(`/restaurants/${seed.restaurantId}`);

    await expect(page.getByTestId('restaurant-public-page')).toBeVisible();
    await expect(page.getByRole('heading', { name: seed.restaurantName })).toBeVisible();
    await expect(page.getByTestId('restaurant-menu')).toBeVisible();
    await expect(page.getByTestId('cart-button')).toBeVisible();
    await expect(page.getByTestId('favorites-header-button')).toBeVisible();
    await expect(page.getByTestId('guest-profile-button')).toBeVisible();
  });

  test('в подвале ссылка Svels ведёт на главную', async ({ page, seed }) => {
    await page.goto(`/restaurants/${seed.restaurantId}`);

    const link = page.getByTestId('restaurant-footer-svels-home');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/');
    await expect(link).toHaveAttribute('aria-label', 'Svels — главная');
  });

  test('добавление в избранное по клику на сердечко', async ({ page, seed }) => {
    const menu = await apiClient.getMenu(seed.restaurantId);
    const firstItem = menu.categories.flatMap((c) => c.items)[0];
    test.skip(!firstItem, 'Need a menu item to toggle favorite');

    await page.goto(`/restaurants/${seed.restaurantId}`);
    const heart = page
      .getByTestId(`menu-item-${firstItem!.id}`)
      .locator('.favorite-heart-button');
    await heart.click();
    await expect(heart).toHaveClass(/favorite-heart-button--active/);
    await expect(page.getByTestId('favorites-header-button')).toBeVisible();

    await page.getByTestId('favorites-header-button').click();
    await expect(page.getByTestId('guest-favorites-page')).toBeVisible();
    await expect(page.getByText(firstItem!.name)).toBeVisible();
  });

  test('кнопка избранного в шапке открывает страницу избранного', async ({ page, seed }) => {
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await page.getByTestId('favorites-header-button').click();
    await expect(page).toHaveURL(new RegExp(`/restaurants/${seed.restaurantId}/favorites`));
    await expect(page.getByTestId('guest-favorites-page')).toBeVisible();
  });

  test('кнопка профиля открывает модалку/форму входа для гостя', async ({ page, seed }) => {
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await page.getByTestId('guest-profile-button').click();
    await expect(page.getByTestId('guest-otp-phone-form')).toBeVisible({ timeout: 10_000 });
  });

  test('добавление блюда в корзину (если меню не пустое)', async ({ page, seed, asGuest }) => {
    void asGuest;
    const menu = await apiClient.getMenu(seed.restaurantId);
    const firstItem = menu.categories.flatMap((c) => c.items)[0];

    await page.goto(`/restaurants/${seed.restaurantId}`);

    if (!firstItem) {
      await expect(page.getByTestId('menu-empty')).toBeVisible();
      return;
    }

    await page.getByTestId(`menu-item-${firstItem.id}`).click();
    await expect(page.getByTestId('menu-add-to-cart')).toBeVisible();
    await page.getByTestId('menu-add-to-cart').click();
    await page.getByTestId('cart-button').click();
    await expect(page.getByTestId('restaurant-cart-modal')).toBeVisible();
    await expect(page.getByTestId('restaurant-cart-modal').getByText(firstItem.name)).toBeVisible({
      timeout: 10_000,
    });
    const fulfillment = page.getByTestId('cart-fulfillment-segmented');
    if (await fulfillment.isVisible()) {
      await fulfillment.getByRole('radio', { name: 'Самовывоз' }).click();
      await expect(fulfillment.getByRole('radio', { name: 'Самовывоз' })).toBeChecked();
    }
    await page.getByTestId('cart-go-to-checkout').click();
    await expect(page.getByTestId('cart-checkout-step')).toBeVisible();
    const locationRow = page.getByTestId('cart-location-row');
    await expect(locationRow).toBeVisible({ timeout: 20_000 });
    await locationRow.getByRole('button').click();
    await expect(page.getByTestId('cart-location-picker')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('cart-location-address')).toBeVisible();
    await expect(page.getByTestId('location-map')).toBeVisible();
  });

  test('после скролла шапка остаётся на месте при открытии модалки блюда', async ({
    page,
    seed,
  }) => {
    const menu = await apiClient.getMenu(seed.restaurantId);
    const firstItem = menu.categories.flatMap((c) => c.items)[0];
    test.skip(!firstItem, 'Need a menu item to open the product modal');

    await page.goto(`/restaurants/${seed.restaurantId}`);
    await expect(page.getByTestId('restaurant-public-page')).toBeVisible();

    await page.evaluate(() => {
      document.documentElement.style.minHeight = '3000px';
      document.body.style.minHeight = '3000px';
      window.scrollTo(0, 480);
    });

    await page.getByTestId(`menu-item-${firstItem!.id}`).click();
    await expect(page.getByTestId('menu-add-to-cart')).toBeVisible();
    const venueHeader = page.getByTestId('venue-header');
    await expect(venueHeader).toBeAttached();
    await expect(venueHeader).toBeInViewport();
    await expect
      .poll(async () => venueHeader.evaluate((el) => el.getBoundingClientRect().top))
      .toBeGreaterThanOrEqual(-1);
  });

  test('выход очищает корзину и избранное на устройстве', async ({
    page,
    seed,
    asGuest,
  }) => {
    void asGuest;
    const menu = await apiClient.getMenu(seed.restaurantId);
    const items = menu.categories.flatMap((c) => c.items);
    const firstItem = items[0];
    const secondItem = items.find((item) => item.id !== firstItem?.id);
    test.skip(!firstItem || !secondItem, 'Need two menu items');

    await apiClient.addGuestFavorite(
      seed.restaurantId,
      seed.guest.accessToken,
      firstItem!.id,
    );

    await page.goto(`/restaurants/${seed.restaurantId}`);
    const heart = page
      .getByTestId(`menu-item-${firstItem!.id}`)
      .locator('.favorite-heart-button');
    const heart2 = page
      .getByTestId(`menu-item-${secondItem!.id}`)
      .locator('.favorite-heart-button');
    await expect(heart).toHaveAttribute('aria-pressed', 'true');
    await heart2.click();
    await expect(heart2).toHaveAttribute('aria-pressed', 'true');

    await page.getByTestId(`menu-item-${firstItem!.id}`).click();
    await expect(page.getByTestId('menu-add-to-cart')).toBeVisible();
    await page.getByTestId('menu-add-to-cart').click();
    await expect(page.getByTestId('cart-button')).toHaveAttribute(
      'aria-label',
      /Корзина, \d+/,
    );

    await page.goto(`/restaurants/${seed.restaurantId}/account`);
    await expect(page.getByTestId('guest-account-page')).toBeVisible();
    await page.getByTestId('guest-logout-button').click();
    await expect(page).toHaveURL(new RegExp(`/restaurants/${seed.restaurantId}/?$`));

    await page.goto(`/restaurants/${seed.restaurantId}`);
    await expect(page.getByTestId('cart-button')).toHaveAttribute('aria-label', 'Корзина');
    await expect(heart).not.toHaveAttribute('aria-pressed', 'true');
    await expect(heart2).not.toHaveAttribute('aria-pressed', 'true');

    await page.goto(`/restaurants/${seed.restaurantId}/favorites`);
    await expect(page.getByTestId('guest-favorites-empty')).toBeVisible();

    await apiClient.removeGuestFavorite(
      seed.restaurantId,
      seed.guest.accessToken,
      secondItem!.id,
    );
  });

  test('авторизованный гость видит страницу аккаунта', async ({ page, seed, asGuest }) => {
    void asGuest;
    await page.goto(`/restaurants/${seed.restaurantId}/account`);
    await expect(page.getByTestId('guest-account-page')).toBeVisible();
    await expect(page.getByText(/Seed/i)).toBeVisible();
  });

  test('кнопка «наверх» скрыта в самом верху страницы', async ({ page, seed }) => {
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await expect(page.getByTestId('restaurant-public-page')).toBeVisible();
    await expect(page.getByTestId('scroll-to-top')).toBeAttached();
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.getByTestId('scroll-to-top')).not.toHaveClass(/scroll-to-top--visible/);
  });

  test('кнопка «наверх» появляется при скролле и плавно возвращает наверх', async ({
    page,
    seed,
  }) => {
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await expect(page.getByTestId('restaurant-public-page')).toBeVisible();
    await expect(page.getByTestId('scroll-to-top')).toBeAttached();

    await page.evaluate(() => {
      document.documentElement.style.minHeight = '3000px';
      document.body.style.minHeight = '3000px';
    });
    await page.mouse.wheel(0, 240);

    await expect(page.getByTestId('scroll-to-top')).toHaveClass(/scroll-to-top--visible/);

    await page.getByTestId('scroll-to-top').click({ force: true });
    await expect
      .poll(async () => page.evaluate(() => window.scrollY), { timeout: 2000 })
      .toBe(0);
    await expect(page.getByTestId('scroll-to-top')).not.toHaveClass(/scroll-to-top--visible/);
  });
});
