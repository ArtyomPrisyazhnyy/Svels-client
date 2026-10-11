import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, 'e2e/.env') });
dotenv.config({ path: path.resolve(__dirname, '../Svels-backend/.env') });

const baseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3001';
const apiURL = process.env.E2E_API_URL ?? 'http://127.0.0.1:3000';

process.env.E2E_BASE_URL = baseURL;
process.env.E2E_API_URL = apiURL;

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // 1 worker: auth/OTP throttling на backend (nestjs-throttler)
  workers: 1,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    },
  },
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'e2e/playwright-report' }]],
  globalSetup: './e2e/global-setup.ts',
  outputDir: 'e2e/test-results',
  use: {
    baseURL,
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'ru-RU',
  },
  projects: [
    {
      name: 'chromium',
      testDir: './e2e/tests',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'visual',
      testDir: './e2e/visual',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'ru-RU',
        timezoneId: 'Europe/Minsk',
        colorScheme: 'light',
      },
    },
  ],
  webServer: process.env.E2E_SKIP_WEBSERVER
    ? undefined
    : {
        command: process.env.CI ? 'npm run start' : 'npm run dev',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: process.env.CI ? 180_000 : 120_000,
      },
});
