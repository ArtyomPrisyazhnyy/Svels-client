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
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // 1 worker: auth/OTP throttling на backend (nestjs-throttler)
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'e2e/playwright-report' }]],
  globalSetup: './e2e/global-setup.ts',
  outputDir: 'e2e/test-results',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'ru-RU',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.E2E_SKIP_WEBSERVER
    ? undefined
    : {
        command: 'npm run dev',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
