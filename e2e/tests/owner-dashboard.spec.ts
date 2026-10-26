import { test, expect } from '../fixtures/test';
import {
  addCalendarDays,
  computeOwnerStats,
  formatSignedPercent,
  minskCalendarDate,
  type StatsOrder,
} from '../../src/features/restaurant-admin/stats/owner-stats';

function shownAmount(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

test.describe('Статистика владельца', () => {
  test('дашборд рисует KPI, график и топ из заказов', async ({ page, asRestaurantAdmin }) => {
    void asRestaurantAdmin;
    const today = minskCalendarDate();
    const yesterday = addCalendarDays(today, -1);
    const earlier = addCalendarDays(today, -3);

    const orders: StatsOrder[] = [
      {
        createdAt: `${today}T09:00:00.000Z`,
        status: 'completed',
        fulfillmentType: 'delivery',
        totalAmount: 120,
        items: [
          { name: 'Борщ', quantity: 1, lineTotal: 70 },
          { name: 'Чай', quantity: 1, lineTotal: 50 },
        ],
      },
      {
        createdAt: `${today}T10:00:00.000Z`,
        status: 'new',
        fulfillmentType: 'takeaway',
        totalAmount: 30,
        items: [{ name: 'Чай', quantity: 1, lineTotal: 30 }],
      },
      {
        createdAt: `${yesterday}T09:00:00.000Z`,
        status: 'completed',
        fulfillmentType: 'dine_in',
        totalAmount: 40,
        items: [{ name: 'Драники', quantity: 1, lineTotal: 40 }],
      },
      {
        createdAt: `${earlier}T09:00:00.000Z`,
        status: 'completed',
        fulfillmentType: 'delivery',
        totalAmount: 10,
        items: [{ name: 'Чай', quantity: 1, lineTotal: 10 }],
      },
    ];
    const bookings = [
      { bookingDate: today, status: 'confirmed' },
      { bookingDate: yesterday, status: 'cancelled' },
    ];

    await page.route(/\/restaurants\/[^/]+\/pre-orders(?:\?.*)?$/, async (route) => {
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }
      const pageNo = Number(new URL(route.request().url()).searchParams.get('page') ?? '1');
      const items = pageNo > 1 ? [] : orders;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items,
          total: orders.length,
          page: pageNo,
          limit: 100,
          serverTime: new Date().toISOString(),
        }),
      });
    });
    await page.route(/\/restaurants\/[^/]+\/bookings(?:\?.*)?$/, async (route) => {
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(bookings),
      });
    });

    const todayStats = computeOwnerStats({ orders, bookings, today, period: 'today' });
    const weekStats = computeOwnerStats({ orders, bookings, today, period: '7d' });

    await page.goto('/restaurant-admin/dashboard');
    await expect(page.getByRole('heading', { name: 'Статистика' })).toBeVisible();
    await expect(page.getByTestId('owner-stats-loading')).toBeHidden({ timeout: 15_000 });
    await expect(page.getByTestId('owner-stats-revenue')).toContainText(shownAmount(todayStats.kpis.revenue.current));
    await expect(page.getByTestId('owner-stats-revenue').locator('.byn-sign')).toBeVisible();
    await expect(page.getByTestId('owner-stats-orders')).toHaveText(String(todayStats.kpis.orders.current));
    await expect(page.getByTestId('owner-stats-average')).toContainText(shownAmount(todayStats.kpis.averageCheck.current));
    await expect(page.getByTestId('owner-stats-bookings')).toHaveText(String(todayStats.kpis.bookings.current));
    await expect(page.getByTestId('owner-stats-kpis')).toContainText(
      formatSignedPercent(todayStats.kpis.revenue.deltaPercent),
    );
    await expect(page.getByTestId('owner-stats-chart')).toBeVisible();
    await expect(page.getByTestId('owner-stats-top')).toContainText(todayStats.topProducts[0]?.name ?? 'Чай');
    await expect(page.getByTestId('owner-stats-fulfillment')).toContainText('Доставка');
    await expect(page.getByTestId('owner-stats-fulfillment')).toContainText('Самовывоз');
    await expect(page.getByTestId('owner-stats-fulfillment')).toContainText('В зале');

    await page.getByTestId('owner-stats-period-7d').click();
    await expect(page.getByTestId('owner-stats-revenue')).toContainText(shownAmount(weekStats.kpis.revenue.current));
    await expect(page.getByTestId('owner-stats-orders')).toHaveText(String(weekStats.kpis.orders.current));
  });

  test('ошибка загрузки показывает повтор', async ({ page, asRestaurantAdmin }) => {
    void asRestaurantAdmin;
    await page.route(/\/restaurants\/[^/]+\/pre-orders(?:\?.*)?$/, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Сервис недоступен' }),
      });
    });

    await page.goto('/restaurant-admin/dashboard');
    await expect(page.getByRole('heading', { name: 'Статистика' })).toBeVisible();
    await expect(page.getByTestId('owner-stats-error')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('owner-stats-error')).toContainText('Сервис недоступен');
    await expect(page.getByTestId('owner-stats-retry')).toBeVisible();
    await expect(page.getByTestId('owner-stats-retry')).toBeEnabled();
  });

  test('без входа страница статистики недоступна', async ({ page }) => {
    await page.goto('/restaurant-admin/dashboard');
    await expect(page).toHaveURL(/\/auth\/restaurant/);
  });
});
