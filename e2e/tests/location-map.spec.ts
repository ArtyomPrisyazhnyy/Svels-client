import { test, expect } from '../fixtures/test';

test.describe('Карта точек', () => {
  test('рендерит Leaflet, метку, попап и ссылку OpenStreetMap', async ({ page, asRestaurantAdmin }) => {
    void asRestaurantAdmin;
    const yandexRequests: string[] = [];
    page.on('request', (request) => {
      if (/yandex\.(ru|com|net)|api-maps\.yandex|static-maps\.yandex/i.test(request.url())) {
        yandexRequests.push(request.url());
      }
    });

    await page.goto('/restaurant-admin/locations');
    const map = page.getByTestId('location-map');
    await expect(map).toBeVisible();
    await expect(map.locator('.leaflet-container')).toBeVisible({ timeout: 15_000 });
    await expect(map.locator('.leaflet-control-attribution')).toContainText(/OpenStreetMap/);
    await expect(map.locator('.leaflet-control-attribution a')).toHaveAttribute(
      'href',
      /openstreetmap\.org\/copyright/,
    );
    await expect(page.getByTestId('location-map-open')).toHaveAttribute(
      'href',
      /^https:\/\/www\.openstreetmap\.org\//,
    );
    await page.getByTestId('location-map-marker').click();
    await expect(page.getByTestId('location-map-popup')).toBeVisible();
    await expect(page.getByTestId('location-map-popup').getByRole('link', { name: 'Открыть в картах' })).toHaveAttribute(
      'href',
      /openstreetmap\.org/,
    );
    expect(yandexRequests).toEqual([]);
  });
});
