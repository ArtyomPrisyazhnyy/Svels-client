#!/usr/bin/env node
/**
 * Съёмка скриншотов лендинга и демо-заведения (mock API + next start).
 */
import { chromium } from '@playwright/test';
import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  LANDING_DEMO_AUTH,
  LANDING_DEMO_RESTAURANT_ID,
} from '../e2e/mock-api/landing-demo-data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARTIFACTS = '/opt/cursor/artifacts/landing-v3';
const PUBLIC_LANDING = path.join(ROOT, 'public/landing');
const BASE = 'http://127.0.0.1:3001';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function toWebp(png, webp, quality = 84) {
  execSync(`cwebp -q ${quality} "${png}" -o "${webp}"`, { stdio: 'inherit' });
  fs.unlinkSync(png);
}

async function waitHttp(url, attempts = 90) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await sleep(1000);
  }
  throw new Error(`Timeout waiting for ${url}`);
}

function killPort(port) {
  if (port === 3001) {
    try {
      execSync('pkill -f "next-server" 2>/dev/null || true', { shell: true });
    } catch {
      /* ignore */
    }
  }
  if (port === 3000) {
    try {
      execSync('pkill -f "landing-mock-api" 2>/dev/null || true', { shell: true });
    } catch {
      /* ignore */
    }
  }
  try {
    execSync(`kill $(lsof -t -i:${port}) 2>/dev/null || true`, { shell: true });
  } catch {
    /* ignore */
  }
}

async function waitPortFree(port, attempts = 40) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(400) });
      killPort(port);
      await sleep(800);
    } catch {
      return;
    }
  }
  throw new Error(`Port ${port} still accepts HTTP after ${attempts} attempts`);
}

async function assertMockMenu() {
  const res = await fetch(`http://127.0.0.1:3000/restaurants/${LANDING_DEMO_RESTAURANT_ID}/menu`);
  if (!res.ok) {
    throw new Error(`Mock menu HTTP ${res.status}`);
  }
  const menu = await res.json();
  const firstId = menu.categories?.flatMap((c) => c.items)?.[0]?.id;
  if (!firstId) {
    throw new Error('Mock menu has no items');
  }
}

function start(cmd, args, env = {}) {
  return spawn(cmd, args, {
    cwd: ROOT,
    env: { ...process.env, ...env },
    stdio: 'inherit',
    detached: false,
  });
}

async function dismissPromoModal(page) {
  const close = page.locator('.promo-banner-modal__close');
  if (await close.isVisible().catch(() => false)) {
    await close.click();
    await page.waitForTimeout(300);
  }
}

async function openRestaurantMenu(page) {
  await page.goto(`${BASE}/restaurants/${LANDING_DEMO_RESTAURANT_ID}`);
  await page.getByTestId('restaurant-public-page').waitFor({ state: 'visible', timeout: 30000 });
  await page.getByTestId('restaurant-menu').waitFor({ state: 'visible', timeout: 30000 });
  await dismissPromoModal(page);
}

async function addItemsToCart(page, itemIds) {
  for (const itemId of itemIds) {
    await dismissPromoModal(page);
    const card = page.getByTestId(`menu-item-${itemId}`);
    await card.scrollIntoViewIfNeeded();
    await card.click({ timeout: 15000 });
    await page.getByRole('dialog').waitFor({ state: 'visible', timeout: 20000 });
    const add = page.getByTestId('menu-add-to-cart');
    await add.waitFor({ state: 'visible', timeout: 20000 });
    await add.click();
    await add.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {});
    await page.keyboard.press('Escape');
    await page.waitForTimeout(250);
  }
}

async function loginDemoAdmin(page) {
  await page.goto(`${BASE}/auth/restaurant`);
  await page.getByTestId('auth-tab-login').click();
  await page.getByTestId('login-email').fill(LANDING_DEMO_AUTH.email);
  await page.getByTestId('login-password').fill(LANDING_DEMO_AUTH.password);
  await page.getByTestId('login-submit').click();
  await page.waitForURL(/\/restaurant-admin/, { timeout: 20000 });
}

async function captureLandingArtifacts(page) {
  const reveal =
    '.reveal { opacity: 1 !important; transform: none !important; transition: none !important; } .scroll-to-top { display: none !important; }';
  const sections = [
    { name: 'hero', selector: '.landing__hero' },
    { name: 'benefits', selector: '#benefits' },
    { name: 'features', selector: '#features' },
    { name: 'for-whom', selector: '#for-whom' },
  ];

  for (const [w, h, folder] of [
    [390, 844, '390'],
    [1280, 800, '1280'],
  ]) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(`${BASE}/`);
    await page.getByTestId('landing-page').waitFor({ state: 'visible' });
    await page.addStyleTag({ content: reveal });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(ARTIFACTS, folder, 'full.png'),
      fullPage: true,
    });
    for (const section of sections) {
      const el = page.locator(section.selector);
      await el.scrollIntoViewIfNeeded();
      await el.screenshot({ path: path.join(ARTIFACTS, folder, `${section.name}.png`) });
    }
  }
}

fs.mkdirSync(ARTIFACTS, { recursive: true });
fs.mkdirSync(path.join(ARTIFACTS, '390'), { recursive: true });
fs.mkdirSync(path.join(ARTIFACTS, '1280'), { recursive: true });
fs.mkdirSync(PUBLIC_LANDING, { recursive: true });

const skipDemoImages = process.env.LANDING_SKIP_DEMO_IMAGES === '1';
const skipHeroCapture = process.env.LANDING_SKIP_HERO_CAPTURE === '1';

function killPorts() {
  try {
    execSync('pkill -f "next-server" 2>/dev/null || true', { shell: true });
  } catch {
    /* ignore */
  }
  try {
    execSync('pkill -f "landing-mock-api" 2>/dev/null || true', { shell: true });
  } catch {
    /* ignore */
  }
  try {
    execSync('kill $(lsof -t -i:3000 -i:3001) 2>/dev/null || true', { shell: true });
  } catch {
    /* ignore */
  }
}

killPorts();
await sleep(2000);
await waitPortFree(3001);
await waitPortFree(3000);

if (!skipDemoImages) {
  const { generateLandingDemoImages } = await import('./generate-landing-demo-images.mjs');
  await generateLandingDemoImages();
}

const mockApi = start('node', ['scripts/landing-mock-api.mjs']);
await waitHttp('http://127.0.0.1:3000/health');
await assertMockMenu();

execSync('npm run build', {
  cwd: ROOT,
  stdio: 'inherit',
  env: { ...process.env, NEXT_PUBLIC_API_URL: 'http://127.0.0.1:3000' },
});

await waitPortFree(3001);
const next = start('npm', ['run', 'start'], { NEXT_PUBLIC_API_URL: 'http://127.0.0.1:3000' });
await waitHttp(`${BASE}/`);
await waitHttp(`${BASE}/restaurants/${LANDING_DEMO_RESTAURANT_ID}`);

const browser = await chromium.launch();
const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
const desktop = await browser.newPage({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
});

if (!skipHeroCapture) {
  await openRestaurantMenu(phone);
  await phone.waitForTimeout(400);
  const heroPhonePng = path.join(PUBLIC_LANDING, 'hero-phone.png');
  await phone.screenshot({ path: heroPhonePng });
  toWebp(heroPhonePng, path.join(PUBLIC_LANDING, 'hero-phone.webp'));

  const menuPng = path.join(PUBLIC_LANDING, 'menu.png');
  await phone.screenshot({ path: menuPng });
  toWebp(menuPng, path.join(PUBLIC_LANDING, 'menu.webp'));
}

// —— Cart modal with 3 items ——
await openRestaurantMenu(phone);
await addItemsToCart(phone, [
  'demo-item-cappuccino',
  'demo-item-raf',
  'demo-item-croissant',
]);
await phone.getByTestId('cart-button').click();
await phone.getByTestId('restaurant-cart-modal').waitFor({ state: 'visible' });
const cartModal = phone.locator('[data-testid="restaurant-cart-modal"]');
const cartPng = path.join(PUBLIC_LANDING, 'cart-mobile.png');
await cartModal.screenshot({ path: cartPng });
toWebp(cartPng, path.join(PUBLIC_LANDING, 'cart-mobile.webp'));

if (!skipHeroCapture) {
  await openRestaurantMenu(desktop);
  await desktop.waitForTimeout(400);
  const heroDesktopPng = path.join(PUBLIC_LANDING, 'hero-desktop.png');
  await desktop.screenshot({ path: heroDesktopPng, fullPage: false });
  toWebp(heroDesktopPng, path.join(PUBLIC_LANDING, 'hero-desktop.webp'), 88);
}

// —— Admin orders ——
await loginDemoAdmin(desktop);
await desktop.goto(`${BASE}/restaurant-admin/orders`);
await desktop.getByTestId('orders-admin-list').waitFor({ state: 'visible', timeout: 20000 });
await desktop.getByTestId('order-card-demo-order-1842').waitFor({ state: 'visible', timeout: 15000 });
await desktop.waitForTimeout(600);
const adminMain = desktop.locator('.orders-admin');
const adminPng = path.join(PUBLIC_LANDING, 'admin-orders.png');
await adminMain.screenshot({ path: adminPng });
toWebp(adminPng, path.join(PUBLIC_LANDING, 'admin-orders.webp'), 86);

await captureLandingArtifacts(desktop);

await browser.close();
mockApi.kill();
next.kill();

console.log('Landing screenshots saved to', PUBLIC_LANDING, 'and', ARTIFACTS);
