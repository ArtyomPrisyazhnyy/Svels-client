import { test, expect } from '../fixtures/test';

const ADMIN_SECTIONS: Array<{
  path: string;
  navTestId: string;
  assert: 'heading' | 'floor-plan';
  heading?: RegExp;
}> = [
  {
    path: '/restaurant-admin/preview',
    navTestId: 'nav-preview',
    assert: 'heading',
    heading: /Страница заведения/i,
  },
  {
    path: '/restaurant-admin/branding',
    navTestId: 'nav-branding',
    assert: 'heading',
    heading: /Логотип|Брендинг/i,
  },
  {
    path: '/restaurant-admin/styling',
    navTestId: 'nav-styling',
    assert: 'heading',
    heading: /Стилизация/i,
  },
  { path: '/restaurant-admin/menu', navTestId: 'nav-menu', assert: 'heading', heading: /меню/i },
  {
    path: '/restaurant-admin/locations',
    navTestId: 'nav-locations',
    assert: 'heading',
    heading: /Точки и адреса/i,
  },
  {
    path: '/restaurant-admin/order-settings',
    navTestId: 'nav-order-settings',
    assert: 'heading',
    heading: /Условия заказа/i,
  },
  {
    path: '/restaurant-admin/booking-settings',
    navTestId: 'nav-booking-settings',
    assert: 'heading',
    heading: /Бронирование/i,
  },
  { path: '/restaurant-admin/floor-plan', navTestId: 'nav-floor-plan', assert: 'floor-plan' },
  {
    path: '/restaurant-admin/bookings',
    navTestId: 'nav-bookings',
    assert: 'heading',
    heading: /Брони/i,
  },
  {
    path: '/restaurant-admin/orders',
    navTestId: 'nav-orders',
    assert: 'heading',
    heading: /Заказы/i,
  },
  {
    path: '/restaurant-admin/social-links',
    navTestId: 'nav-social-links',
    assert: 'heading',
    heading: /соцсет/i,
  },
  {
    path: '/restaurant-admin/account',
    navTestId: 'nav-account',
    assert: 'heading',
    heading: /Аккаунт/i,
  },
];

test.describe('Restaurant admin', () => {
  test('layout и навигация видны', async ({ page, asRestaurantAdmin }) => {
    void asRestaurantAdmin;
    await page.goto('/restaurant-admin/menu');

    await expect(page.getByTestId('restaurant-admin-layout')).toBeVisible();
    await expect(page.getByTestId('restaurant-admin-nav')).toBeVisible();
    await expect(page.getByText(/Владелец/i)).toBeVisible();
    await expect(page.getByTestId('restaurant-admin-logout')).toBeVisible();
  });

  for (const section of ADMIN_SECTIONS) {
    test(`секция ${section.path} открывается`, async ({ page, asRestaurantAdmin }) => {
      void asRestaurantAdmin;
      await page.goto(section.path);

      await expect(page).toHaveURL(new RegExp(`${section.path.replace(/\//g, '\\/')}$`));
      await expect(page.getByTestId(section.navTestId)).toBeVisible();

      if (section.assert === 'floor-plan') {
        await expect(page.getByTestId('floor-plan-admin')).toBeVisible({ timeout: 15_000 });
        return;
      }

      await expect(page.getByRole('heading', { name: section.heading! }).first()).toBeVisible({
        timeout: 15_000,
      });
    });
  }

  test('на странице точек есть карта', async ({ page, asRestaurantAdmin }) => {
    void asRestaurantAdmin;
    await page.goto('/restaurant-admin/locations');
    await expect(page.getByTestId('locations-admin')).toBeVisible();
    await expect(page.getByTestId('location-map')).toBeVisible();
  });

  test('навигация по клику работает', async ({ page, asRestaurantAdmin }) => {
    void asRestaurantAdmin;
    await page.goto('/restaurant-admin/menu');
    await page.getByTestId('nav-branding').click();
    await expect(page).toHaveURL(/\/restaurant-admin\/branding$/);
    await page.getByTestId('nav-social-links').click();
    await expect(page).toHaveURL(/\/restaurant-admin\/social-links$/);
  });

  test('создание категории/позиции меню (форма)', async ({ page, asRestaurantAdmin }) => {
    void asRestaurantAdmin;
    await page.goto('/restaurant-admin/menu');

    await expect(page.getByRole('heading', { name: /меню/i }).first()).toBeVisible();

    const addCategory = page.getByRole('button', { name: /категор/i }).first();
    const addItem = page.getByRole('button', { name: /добавить|новую позиц|блюдо/i }).first();

    if ((await addCategory.count()) > 0) {
      await expect(addCategory).toBeVisible();
    }
    if ((await addItem.count()) > 0) {
      await expect(addItem).toBeVisible();
    }

    // Форма присутствует на странице (создание или редактирование)
    await expect(page.locator('.menu-item-form, form').first()).toBeVisible({ timeout: 10_000 });
  });

  test('logout уводит с админки', async ({ page, asRestaurantAdmin }) => {
    void asRestaurantAdmin;
    await page.goto('/restaurant-admin/menu');
    await page.getByTestId('restaurant-admin-logout').click();
    await page.goto('/restaurant-admin/menu');
    await expect(page).toHaveURL(/\/auth\/restaurant/);
  });

  test('кнопка «наверх» не показывается в админке', async ({ page, asRestaurantAdmin }) => {
    void asRestaurantAdmin;
    await page.goto('/restaurant-admin/menu');
    await page.evaluate(() => {
      document.documentElement.style.minHeight = '3000px';
      document.body.style.minHeight = '3000px';
      window.scrollTo(0, 400);
    });
    await expect(page.getByTestId('scroll-to-top')).toHaveCount(0);
  });
});
