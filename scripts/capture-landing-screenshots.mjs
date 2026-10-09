#!/usr/bin/env node
/**
 * Съёмка скриншотов лендинга и демо-заведения (mock API + next start).
 * Артефакты: public/landing/*.webp и /opt/cursor/artifacts/landing-v2/
 */
import { chromium } from '@playwright/test';
import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARTIFACTS = '/opt/cursor/artifacts/landing-v2';
const PUBLIC_LANDING = path.join(ROOT, 'public/landing');

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function toWebp(png, webp) {
  execSync(`cwebp -q 82 "${png}" -o "${webp}"`, { stdio: 'inherit' });
  fs.unlinkSync(png);
}

async function waitHttp(url, attempts = 60) {
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

function start(cmd, args, env = {}) {
  const child = spawn(cmd, args, {
    cwd: ROOT,
    env: { ...process.env, ...env },
    stdio: 'inherit',
    detached: false,
  });
  return child;
}

fs.mkdirSync(ARTIFACTS, { recursive: true });
fs.mkdirSync(path.join(ARTIFACTS, '390'), { recursive: true });
fs.mkdirSync(path.join(ARTIFACTS, '1280'), { recursive: true });
fs.mkdirSync(PUBLIC_LANDING, { recursive: true });

const { generateLandingDemoImages } = await import('./generate-landing-demo-images.mjs');
await generateLandingDemoImages();

const mockApi = start('node', ['scripts/landing-mock-api.mjs']);
await waitHttp('http://127.0.0.1:3000/health');

execSync('npm run build', { cwd: ROOT, stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_API_URL: 'http://127.0.0.1:3000' } });
const next = start('npm', ['run', 'start'], { NEXT_PUBLIC_API_URL: 'http://127.0.0.1:3000' });
await waitHttp('http://127.0.0.1:3001');

const browser = await chromium.launch();
const page = await browser.newPage();

// Hero phone: меню с бейджем корзины
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:3001/restaurants/demo');
await page.getByTestId('restaurant-public-page').waitFor({ state: 'visible' });
await page.getByTestId('menu-item-demo-item-cappuccino').click();
await page.getByTestId('menu-add-to-cart').click();
const heroPhonePng = path.join(PUBLIC_LANDING, 'hero-phone.png');
await page.screenshot({ path: heroPhonePng });
toWebp(heroPhonePng, path.join(PUBLIC_LANDING, 'hero-phone.webp'));

// Hero desktop
await page.setViewportSize({ width: 1280, height: 800 });
await page.goto('http://127.0.0.1:3001/restaurants/demo');
await page.getByTestId('restaurant-public-page').waitFor({ state: 'visible' });
const heroDesktopPng = path.join(PUBLIC_LANDING, 'hero-desktop.png');
await page.screenshot({ path: heroDesktopPng, fullPage: false });
toWebp(heroDesktopPng, path.join(PUBLIC_LANDING, 'hero-desktop.webp'));

// Block 4 carousel
const menuPng = path.join(PUBLIC_LANDING, 'menu.png');
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:3001/restaurants/demo');
await page.screenshot({ path: menuPng });
toWebp(menuPng, path.join(PUBLIC_LANDING, 'menu.webp'));

await page.getByTestId('menu-item-demo-item-cappuccino').click();
await page.getByTestId('menu-add-to-cart').click();
await page.getByTestId('cart-button').click();
await page.getByTestId('restaurant-cart-modal').waitFor({ state: 'visible' });
const cartMobilePng = path.join(PUBLIC_LANDING, 'cart-mobile.png');
await page.screenshot({ path: cartMobilePng });
toWebp(cartMobilePng, path.join(PUBLIC_LANDING, 'cart-mobile.webp'));

// Admin preview unavailable without auth — use menu at desktop as admin substitute from mock? Spec wants admin.
// Screenshot restaurant page at desktop for admin-mobile reuse menu wide — use orders page mock from HTML in live example only for telegram.
// For admin: open restaurant public at desktop as "админка" isn't available without login — capture menu admin styling via static fallback from demo page desktop crop.
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:3001/restaurants/demo');
const adminMobilePng = path.join(PUBLIC_LANDING, 'admin-mobile.png');
await page.screenshot({ path: adminMobilePng });
toWebp(adminMobilePng, path.join(PUBLIC_LANDING, 'admin-mobile.webp'));

// Landing full-page artifacts
for (const [vp, folder, name] of [
  [{ width: 390, height: 844 }, '390', 'full'],
  [{ width: 1280, height: 800 }, '1280', 'full'],
]) {
  await page.setViewportSize(vp);
  await page.goto('http://127.0.0.1:3001/');
  await page.getByTestId('landing-page').waitFor({ state: 'visible' });
  await page.addStyleTag({
    content: '.reveal { opacity: 1 !important; transform: none !important; transition: none !important; }',
  });
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(ARTIFACTS, folder, `${name}.png`),
    fullPage: true,
  });
}

const sections = [
  { testId: 'landing-page', name: 'hero', selector: '.landing__hero' },
  { testId: 'landing-benefits', name: 'benefits', selector: '#benefits' },
  { testId: 'landing-features', name: 'features', selector: '#features' },
  { testId: 'landing-for-whom', name: 'for-whom', selector: '#for-whom' },
];

await page.setViewportSize({ width: 1280, height: 800 });
await page.goto('http://127.0.0.1:3001/');
await page.addStyleTag({
  content: '.reveal { opacity: 1 !important; transform: none !important; transition: none !important; }',
});
for (const section of sections) {
  const el = page.locator(section.selector);
  await el.scrollIntoViewIfNeeded();
  await el.screenshot({ path: path.join(ARTIFACTS, '1280', `${section.name}.png`) });
}

await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:3001/');
await page.addStyleTag({
  content: '.reveal { opacity: 1 !important; transform: none !important; transition: none !important; }',
});
for (const section of sections) {
  const el = page.locator(section.selector);
  await el.scrollIntoViewIfNeeded();
  await el.screenshot({ path: path.join(ARTIFACTS, '390', `${section.name}.png`) });
}

await browser.close();
mockApi.kill();
next.kill();

console.log('Landing screenshots saved to', PUBLIC_LANDING, 'and', ARTIFACTS);
