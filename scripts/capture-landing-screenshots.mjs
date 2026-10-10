#!/usr/bin/env node
/**
 * Съёмка скриншотов лендинга и демо-заведения (mock API + next start).
 */
import { chromium } from '@playwright/test';
import { execSync, spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  LANDING_DEMO_AUTH,
  LANDING_DEMO_RESTAURANT_ID,
} from '../e2e/mock-api/landing-demo-data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARTIFACTS = '/opt/cursor/artifacts/landing-v5';
const FINAL = '/opt/cursor/artifacts/landing-final';
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
  execSync('rm -rf .next/standalone/public/landing', { cwd: ROOT, stdio: 'inherit' });
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

execSync('rm -rf .next', { cwd: ROOT, stdio: 'inherit' });
execSync('npm run build', {
  cwd: ROOT,
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_PUBLIC_API_URL: 'http://127.0.0.1:3000',
    RESTAURANT_PUBLIC_REVALIDATE_SECONDS: '0',
  },
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

const phoneClean = `
  html { scrollbar-width: none !important; }
  ::-webkit-scrollbar { width: 0 !important; height: 0 !important; display: none !important; }
  .scroll-to-top, .promo-banner-modal { display: none !important; }
`;
/** Status bar in the scene studio covers 54px, so the shot is cropped at y=798. Keep prices above that. */
const phoneMenuFit = `
  ${phoneClean}
  .promo-banner-strip__image--16-9 {
    aspect-ratio: 16 / 9 !important;
    max-height: 188px !important;
    object-fit: cover !important;
  }
  .restaurant-public__main { padding-top: 0.85rem !important; }
  .restaurant-public__description { margin-bottom: 0.7rem !important; }
  .restaurant-public__address { margin-bottom: 0.5rem !important; }
`;
const desktopFit = `
  ${phoneClean}
  .promo-banner-strip__image--16-9 {
    aspect-ratio: 3.4 / 1 !important;
    max-height: 168px !important;
    object-fit: cover !important;
  }
  .restaurant-public__main { padding-top: 1.1rem !important; }
  .restaurant-public__description { margin-bottom: 0.85rem !important; }
  .restaurant-public__address { margin-bottom: 0.65rem !important; }
`;
const cartFill = `
  ${phoneClean}
  .restaurant-cart-modal__backdrop { display: none !important; }
  .restaurant-cart-modal,
  .restaurant-cart-modal.restaurant-cart-modal--active {
    background: #ffffff !important;
    padding: 0 !important;
    align-items: flex-start !important;
  }
  .restaurant-cart-modal__panel,
  .restaurant-cart-modal__panel.restaurant-cart-modal--active {
    max-width: none !important;
    max-height: none !important;
    width: 100% !important;
    height: 760px !important;
    margin-top: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    transform: none !important;
  }
`;

async function assertGuestTheme(page) {
  try {
    await page.waitForFunction(() => {
      const chip = document.querySelector('.restaurant-menu__category-nav-btn--active');
      const price = document.querySelector('.menu-product-card__price');
      const h1 = document.querySelector('.restaurant-public__main h1');
      if (!chip || !price || !h1) return false;
      const bodyBg = getComputedStyle(document.body).backgroundColor;
      const font = getComputedStyle(h1).fontFamily;
      const chipBg = getComputedStyle(chip).backgroundColor;
      const priceColor = getComputedStyle(price).color;
      return (
        bodyBg === 'rgb(255, 255, 255)' &&
        /inter/i.test(font) &&
        chipBg === 'rgb(15, 118, 110)' &&
        priceColor === 'rgb(242, 121, 91)'
      );
    }, null, { timeout: 20000 });
  } catch {
    const dump = await page.evaluate(() => {
      const chip = document.querySelector('.restaurant-menu__category-nav-btn--active');
      const price = document.querySelector('.menu-product-card__price');
      const h1 = document.querySelector('.restaurant-public__main h1');
      const styled = document.querySelector('.restaurant-styled');
      return {
        body: getComputedStyle(document.body).backgroundColor,
        font: h1 ? getComputedStyle(h1).fontFamily : null,
        chip: chip ? getComputedStyle(chip).backgroundColor : null,
        price: price ? getComputedStyle(price).color : null,
        vars: styled ? styled.getAttribute('style') : null,
      };
    });
    throw new Error(`Guest theme check failed: ${JSON.stringify(dump)}`);
  }
  console.log('[capture] guest theme OK', {
    body: 'rgb(255, 255, 255)',
    chip: 'rgb(15, 118, 110)',
    price: 'rgb(242, 121, 91)',
  });
}

await openRestaurantMenu(phone);
await phone.addStyleTag({ content: phoneMenuFit });
await assertGuestTheme(phone);
await waitForImages(phone);
const phonePrice = await phone.locator('.menu-product-card__price').first().boundingBox();
if (!phonePrice || phonePrice.y + phonePrice.height > 786) {
  throw new Error(`Phone menu price is clipped by the status-bar crop: ${JSON.stringify(phonePrice)}`);
}
await phone.screenshot({ path: path.join(RAW, 'phone-menu.png'), animations: 'disabled' });

await addItemsToCart(phone, ['demo-cappuccino', 'demo-almond-croissant', 'demo-latte']);
await phone.getByTestId('cart-button').click();
await phone.getByTestId('restaurant-cart-modal').waitFor({ state: 'visible' });
await phone.getByTestId('cart-modal-panel').waitFor({ state: 'visible' });
await phone.addStyleTag({ content: cartFill });
await waitForImages(phone);
await phone.screenshot({ path: path.join(RAW, 'phone-cart.png'), animations: 'disabled' });

await openRestaurantMenu(desktop);
await desktop.addStyleTag({ content: desktopFit });
await assertGuestTheme(desktop);
await waitForImages(desktop);
const cardBox = await desktop.locator('.menu-product-card').first().boundingBox();
if (!cardBox || cardBox.y + cardBox.height > 890) {
  throw new Error(`Desktop product row is outside the 900px viewport: ${JSON.stringify(cardBox)}`);
}
await desktop.screenshot({
  path: path.join(RAW, 'desktop-menu.png'),
  clip: { x: 0, y: 0, width: 1440, height: 900 },
  animations: 'disabled',
});

const phoneAdmin = await browser.newPage({
  viewport: { width: 393, height: 852 },
  deviceScaleFactor: 3,
});
await loginDemoAdmin(phoneAdmin);
await phoneAdmin.goto(`${BASE}/restaurant-admin/orders`);
await phoneAdmin.getByTestId('orders-admin-list').waitFor({ state: 'visible', timeout: 20000 });
await phoneAdmin.getByTestId('order-card-demo-order-1842').waitFor({ state: 'visible', timeout: 15000 });
await phoneAdmin.addStyleTag({
  content: `
    .restaurant-admin__nav, .restaurant-admin__welcome,
    .orders-admin__pause, .orders-admin__telegram, .orders-admin__toolbar,
    .orders-admin__intro, .orders-admin__sound { display: none !important; }
    .restaurant-admin__body { display: block !important; min-height: 0 !important; }
    .restaurant-admin__content { padding: 0.45rem 0.65rem 0.6rem !important; }
    .orders-admin__header { margin-bottom: 0.35rem !important; }
    .orders-admin__header h2 { font-size: 1.02rem !important; margin-bottom: 0 !important; }
    .orders-admin__list { gap: 0.45rem !important; }
    .orders-admin__card { margin-bottom: 0 !important; padding: 0.65rem 0.7rem !important; }
    .orders-admin__card-header { margin-bottom: 0.35rem !important; }
    .orders-admin__meta, .orders-admin__comment, .orders-admin__card-actions { display: none !important; }
    .orders-admin__items { margin-bottom: 0.25rem !important; }
    .restaurant-admin__header { padding-block: 0.45rem !important; }
    html { scrollbar-width: none !important; }
    ::-webkit-scrollbar { display: none !important; }
  `,
});
const visibleOrders = await phoneAdmin.locator('[data-testid^="order-card-"]').count();
if (visibleOrders < 3) {
  throw new Error(`Admin orders list shows ${visibleOrders} cards, expected 3–4`);
}
const thirdCard = await phoneAdmin.locator('[data-testid^="order-card-"]').nth(2).boundingBox();
if (!thirdCard || thirdCard.y + 36 > 840) {
  throw new Error(`Third order card is outside the phone viewport: ${JSON.stringify(thirdCard)}`);
}
await waitForImages(phoneAdmin);
await phoneAdmin.screenshot({ path: path.join(RAW, 'phone-admin.png'), animations: 'disabled' });

await browser.close();
next.kill();
await waitPortFree(3001);

execSync('node scripts/landing/build-scenes.mjs', { cwd: ROOT, stdio: 'inherit' });

// Scene manifest is imported at build time. Rebuild while the mock API is still up
// so srcset widths match the files just written to public/landing/scenes.
execSync('npm run build', {
  cwd: ROOT,
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_PUBLIC_API_URL: 'http://127.0.0.1:3000',
    RESTAURANT_PUBLIC_REVALIDATE_SECONDS: '0',
  },
});

mockApi.kill();

killPorts();
await sleep(2000);
await waitPortFree(3000);
await waitPortFree(3001);

const mockApi2 = start('node', ['scripts/landing-mock-api.mjs']);
await waitHttp('http://127.0.0.1:3000/health');
await waitPortFree(3001);
const next2 = startNextStandalone('http://127.0.0.1:3000');
await waitHttp(`${BASE}/`);

fs.mkdirSync(FINAL, { recursive: true });
const artifactBrowser = await chromium.launch();
const artifactPage = await artifactBrowser.newPage({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
});
await captureLandingArtifacts(artifactPage);

async function saveZoomCrop(page, selector, fileName, fraction) {
  const box = await page.locator(selector).boundingBox();
  if (!box) {
    throw new Error(`Missing box for ${selector}`);
  }
  const dpr = 2;
  const clip = {
    x: box.x + box.width * fraction.x,
    y: box.y + box.height * fraction.y,
    width: box.width * fraction.w,
    height: box.height * fraction.h,
  };
  const shot = await page.screenshot({
    clip,
    animations: 'disabled',
    scale: 'css',
  });
  const sharp = (await import('sharp')).default;
  await sharp(shot)
    .resize(Math.round(clip.width * dpr), Math.round(clip.height * dpr), { kernel: 'nearest' })
    .png()
    .toFile(path.join(FINAL, fileName));
}

await artifactPage.setViewportSize({ width: 1280, height: 800 });
await artifactPage.goto(`${BASE}/`);
await artifactPage.getByTestId('landing-page').waitFor({ state: 'visible' });
await artifactPage.addStyleTag({
  content:
    '.reveal { opacity: 1 !important; transform: none !important; transition: none !important; } .scroll-to-top { display: none !important; }',
});
await artifactPage.locator('.landing__hero').scrollIntoViewIfNeeded();
await saveZoomCrop(artifactPage, '.landing-hero-visual__desktop img', 'crop-hero-phone-2x.png', {
  x: 0.62,
  y: 0.08,
  w: 0.38,
  h: 0.9,
});
await saveZoomCrop(artifactPage, '.landing-hero-visual__desktop img', 'crop-hero-browser-2x.png', {
  x: 0.04,
  y: 0.08,
  w: 0.5,
  h: 0.55,
});
await artifactPage.locator('#features').scrollIntoViewIfNeeded();
await saveZoomCrop(artifactPage, '[data-testid="landing-live-menu"] .landing-picture__img', 'crop-feature-phone-2x.png', {
  x: 0.08,
  y: 0.04,
  w: 0.84,
  h: 0.72,
});

await artifactPage.setViewportSize({ width: 390, height: 844 });
await artifactPage.goto(`${BASE}/`);
await artifactPage.getByTestId('landing-page').waitFor({ state: 'visible' });
await artifactPage.addStyleTag({
  content:
    '.reveal { opacity: 1 !important; transform: none !important; transition: none !important; }',
});
await artifactPage.screenshot({
  path: path.join(FINAL, '390.png'),
  fullPage: true,
  animations: 'disabled',
});
await artifactPage.setViewportSize({ width: 1280, height: 800 });
await artifactPage.goto(`${BASE}/`);
await artifactPage.getByTestId('landing-page').waitFor({ state: 'visible' });
await artifactPage.addStyleTag({
  content:
    '.reveal { opacity: 1 !important; transform: none !important; transition: none !important; }',
});
await artifactPage.screenshot({
  path: path.join(FINAL, '1280.png'),
  fullPage: true,
  animations: 'disabled',
});

await artifactBrowser.close();
mockApi2.kill();
next2.kill();

for (const name of ['phone-menu.png', 'desktop-menu.png', 'phone-admin.png']) {
  const file = path.join(RAW, name);
  const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 12);
  console.log('hash', hash, name);
}
console.log('Raw captures →', RAW, '; artifacts →', ARTIFACTS, FINAL);
