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
  {
    path: '',
    label: 'home',
    header: 'venue-header',
    skeleton: null,
    content: 'restaurant-public-page',
  },
  {
    path: '/account',
    label: 'account',
    header: 'venue-header',
    skeleton: 'guest-account-skeleton',
    content: 'guest-account-page',
  },
  {
    path: '/booking',
    label: 'booking',
    header: 'venue-header',
    skeleton: 'guest-booking-skeleton',
    content: 'guest-booking-page',
  },
  {
    path: '/pre-order',
    label: 'preorder',
    header: 'venue-header',
    skeleton: 'guest-preorder-skeleton',
    content: 'preorder-page',
    dataTestIds: ['guest-orders-list', 'guest-orders-empty'],
  },
  {
    path: '/favorites',
    label: 'favorites',
    header: 'venue-header',
    skeleton: 'guest-favorites-skeleton',
    content: 'guest-favorites-page',
  },
];

const authState = JSON.parse(readFileSync(authJsonPath, 'utf8'));
const authPayload =
  authState.origins?.[0]?.localStorage?.find((entry) => entry.name === 'svels-auth')?.value ??
  null;

if (!authPayload) {
  console.error('auth-json must include svels-auth in localStorage for the base URL origin');
  process.exit(1);
}

async function waitForData(page, route) {
  if (route.dataTestIds) {
    const locator = route.dataTestIds
      .map((id) => page.getByTestId(id))
      .reduce((acc, next) => acc.or(next));
    try {
      await locator.waitFor({ state: 'visible', timeout: 90_000 });
      return;
    } catch {
      await page.getByTestId(route.content).waitFor({ state: 'visible', timeout: 10_000 });
      return;
    }
  }
  await page.getByTestId(route.content).waitFor({ state: 'visible', timeout: 90_000 });
}

async function measureRoute(page, route) {
  const url = `${baseUrl}/restaurants/${restaurantId}${route.path}`;
  const started = Date.now();

  await page.goto(url, { waitUntil: 'commit' });

  const headerVisibleMs = await page
    .getByTestId(route.header)
    .waitFor({ state: 'visible', timeout: 60_000 })
    .then(() => Date.now() - started);

  let skeletonOrContentMs = null;
  if (route.skeleton) {
    skeletonOrContentMs = await page
      .getByTestId(route.skeleton)
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => Date.now() - started)
      .catch(() => null);
  }

  if (skeletonOrContentMs === null) {
    skeletonOrContentMs = await page
      .locator('[data-testid$="-skeleton"]')
      .first()
      .waitFor({ state: 'visible', timeout: 5_000 })
      .then(() => Date.now() - started)
      .catch(() => null);
  }

  if (skeletonOrContentMs === null) {
    skeletonOrContentMs = await page
      .getByTestId(route.content)
      .waitFor({ state: 'visible', timeout: 60_000 })
      .then(() => Date.now() - started);
  }

  await waitForData(page, route);
  const dataVisibleMs = Date.now() - started;

  return {
    route: route.label,
    headerVisibleMs,
    skeletonOrContentMs,
    dataVisibleMs,
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
await page.goto(`${baseUrl}/restaurants/${restaurantId}`, { waitUntil: 'domcontentloaded' });
await page.reload({ waitUntil: 'domcontentloaded' });
await page.getByTestId('venue-header').waitFor({ state: 'visible', timeout: 60_000 });
await page.waitForFunction(() => {
  const raw = window.localStorage.getItem('svels-auth');
  if (!raw) {
    return false;
  }
  try {
    return Boolean(JSON.parse(raw).state?.accessToken);
  } catch {
    return false;
  }
});
await page.waitForFunction(
  () => {
    const raw = window.localStorage.getItem('svels-auth');
    if (!raw) {
      return false;
    }
    try {
      const parsed = JSON.parse(raw);
      return Boolean(parsed.state?.accessToken && parsed.state?.user);
    } catch {
      return false;
    }
  },
  { timeout: 60_000 },
);
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
