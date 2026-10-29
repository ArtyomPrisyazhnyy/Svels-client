import { chromium } from 'playwright';
import fs from 'node:fs';

const seed = JSON.parse(fs.readFileSync('e2e/.auth/seed.json', 'utf8'));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors: string[] = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});

await page.addInitScript((rid) => {
  window.localStorage.setItem(
    'svels-cart',
    JSON.stringify({
      state: { version: 2, restaurantId: rid, items: [{ id: '1', lineKey: '1', menuItemId: '1', name: 'T', quantity: 2, unitPrice: 9.9, imageUrl: '', imageWebpUrl: null, modifiers: [], modifierSelections: {} }], checkoutByRestaurant: {} },
      version: 2,
    }),
  );
}, seed.restaurantId);

await page.goto(`http://127.0.0.1:3001/restaurants/${seed.restaurantId}`, { timeout: 120000 });
await page.getByTestId('cart-button').click();
await page.waitForTimeout(1500);
console.log(JSON.stringify({ portal: await page.locator('nextjs-portal').count(), errors }, null, 2));
await browser.close();
