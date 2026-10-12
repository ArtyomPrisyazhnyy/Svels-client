#!/usr/bin/env node
/**
 * Guest venue subpage timings (throttled CPU + Fast 4G).
 * Usage: node scripts/perf/guest-pages.mjs --base-url=http://127.0.0.1:3001 --restaurant-id=<id> --auth-json=<path>
 */
import { readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    return [key, value ?? 'true'];
  }),
);

const baseUrl = args['base-url'] ?? 'http://127.0.0.1:3001';
const restaurantId = args['restaurant-id'];
const authJsonPath = args['auth-json'];

if (!restaurantId || !authJsonPath) {
  console.error(
    'Required: --restaurant-id=... --auth-json=... (e2e guest storage state JSON path)',
  );
  process.exit(1);
}

const routes = [
  { path: '', label: 'home', header: 'venue-header', content: 'restaurant-public-page' },
  { path: '/account', label: 'account', header: 'venue-header', content: 'guest-account-page' },
  { path: '/booking', label: 'booking', header: 'venue-header', content: 'guest-booking-page' },
  { path: '/pre-order', label: 'preorder', header: 'venue-header', content: 'guest-orders-list' },
  { path: '/favorites', label: 'favorites', header: 'venue-header', content: 'guest-favorites-page' },
];

const authState = JSON.parse(readFileSync(authJsonPath, 'utf8'));

async function measureRoute(page, route) {
  const url = `${baseUrl}/restaurants/${restaurantId}${route.path}`;
  const started = Date.now();

  await page.goto(url, { waitUntil: 'commit' });

  const headerVisibleMs = await page
    .getByTestId(route.header)
    .waitFor({ state: 'visible', timeout: 60_000 })
    .then(() => Date.now() - started);

  const skeleton = page.locator('[data-testid$="-skeleton"]').first();
  const skeletonVisibleMs = await skeleton
    .waitFor({ state: 'visible', timeout: 5_000 })
    .then(() => Date.now() - started)
    .catch(() => null);

  const contentVisibleMs = await page
    .getByTestId(route.content)
    .waitFor({ state: 'visible', timeout: 60_000 })
    .then(() => Date.now() - started);

  return {
    route: route.label,
    headerVisibleMs,
    skeletonOrContentMs: skeletonVisibleMs ?? contentVisibleMs,
    dataVisibleMs: contentVisibleMs,
  };
}

const browser = await chromium.launch({
  headless: true,
  args: ['--disable-dev-shm-usage'],
});

const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  storageState: authState,
});

const page = await context.newPage();
const client = await context.newCDPSession(page);
await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await client.send('Network.enable');
await client.send('Network.emulateNetworkConditions', {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  connectionType: 'cellular4g',
});

const results = [];
for (const route of routes) {
  results.push(await measureRoute(page, route));
}

await browser.close();

console.log(JSON.stringify({ baseUrl, restaurantId, results }, null, 2));
