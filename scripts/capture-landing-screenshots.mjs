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
const ARTIFACTS = '/opt/cursor/artifacts/landing-v5';
const RAW = path.join(ROOT, 'scripts/landing/raw');
const BASE = 'http://127.0.0.1:3001';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
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

function syncStandaloneAssets() {
  execSync('cp -r public .next/standalone/public', { cwd: ROOT, stdio: 'inherit' });
  execSync('cp -r .next/static .next/standalone/.next/static', { cwd: ROOT, stdio: 'inherit' });
}

function startNextStandalone(apiUrl) {
  syncStandaloneAssets();
  return start('node', ['.next/standalone/server.js'], {
    PORT: '3001',
    HOSTNAME: '127.0.0.1',
    NEXT_PUBLIC_API_URL: apiUrl,
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
  await page.locator('[data-testid^="menu-item-demo-"]').first().waitFor({ state: 'visible', timeout: 30000 });
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

async function waitForImages(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    const imgs = Array.from(document.images);
    await Promise.all(
      imgs.map((img) => {
        if (img.complete) {
          return img.decode?.() ?? Promise.resolve();
        }
        return new Promise((resolve) => {
          img.addEventListener('load', () => resolve(img.decode?.() ?? undefined), { once: true });
          img.addEventListener('error', () => resolve(undefined), { once: true });
        });
      }),
    );
  });
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
fs.mkdirSync(RAW, { recursive: true });

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

execSync('node scripts/landing/prepare-demo-branding.mjs', { cwd: ROOT, stdio: 'inherit' });

killPorts();
await sleep(2000);
await waitPortFree(3001);
await waitPortFree(3000);

const mockApi = start('node', ['scripts/landing-mock-api.mjs']);
await waitHttp('http://127.0.0.1:3000/health');
await assertMockMenu();

execSync('npm run build', {
  cwd: ROOT,
  stdio: 'inherit',
  env: { ...process.env, NEXT_PUBLIC_API_URL: 'http://127.0.0.1:3000' },
});

await waitPortFree(3001);
const next = startNextStandalone('http://127.0.0.1:3000');
await waitHttp(`${BASE}/`);
await waitHttp(`${BASE}/restaurants/${LANDING_DEMO_RESTAURANT_ID}`);

const browser = await chromium.launch();
const phone = await browser.newPage({
  viewport: { width: 393, height: 852 },
  deviceScaleFactor: 3,
});
const desktop = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

await openRestaurantMenu(phone);
await waitForImages(phone);
await phone.screenshot({ path: path.join(RAW, 'phone-menu.png') });

await addItemsToCart(phone, ['demo-cappuccino', 'demo-almond-croissant', 'demo-latte']);
await phone.getByTestId('cart-button').click();
await phone.getByTestId('restaurant-cart-modal').waitFor({ state: 'visible' });
await phone.getByTestId('cart-modal-panel').waitFor({ state: 'visible' });
await waitForImages(phone);
await phone.getByTestId('cart-modal-panel').screenshot({ path: path.join(RAW, 'phone-cart.png') });

await openRestaurantMenu(desktop);
await waitForImages(desktop);
await desktop.screenshot({
  path: path.join(RAW, 'desktop-menu.png'),
  clip: { x: 0, y: 0, width: 1440, height: 900 },
});

const phoneAdmin = await browser.newPage({
  viewport: { width: 393, height: 852 },
  deviceScaleFactor: 3,
});
await loginDemoAdmin(phoneAdmin);
await phoneAdmin.goto(`${BASE}/restaurant-admin/orders`);
await phoneAdmin.getByTestId('orders-admin-list').waitFor({ state: 'visible', timeout: 20000 });
await phoneAdmin.getByTestId('order-card-demo-order-1842').waitFor({ state: 'visible', timeout: 15000 });
await waitForImages(phoneAdmin);
await phoneAdmin.screenshot({ path: path.join(RAW, 'phone-admin.png') });

await browser.close();
mockApi.kill();
next.kill();

execSync('node scripts/landing/build-scenes.mjs', { cwd: ROOT, stdio: 'inherit' });

killPorts();
await sleep(2000);
await waitPortFree(3000);
await waitPortFree(3001);

const mockApi2 = start('node', ['scripts/landing-mock-api.mjs']);
await waitHttp('http://127.0.0.1:3000/health');
await waitPortFree(3001);
const next2 = startNextStandalone('http://127.0.0.1:3000');
await waitHttp(`${BASE}/`);

const artifactBrowser = await chromium.launch();
const artifactPage = await artifactBrowser.newPage({ viewport: { width: 1280, height: 800 } });
await captureLandingArtifacts(artifactPage);
await artifactBrowser.close();
mockApi2.kill();
next2.kill();

console.log('Raw captures →', RAW, '; artifacts →', ARTIFACTS);
