import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3001';

/** Capture-only config: no global-setup / backend. Uses `next dev` + browser route mocks. */
export default defineConfig({
  testDir: './e2e/capture',
  fullyParallel: false,
  workers: 1,
  timeout: 120_000,
  reporter: [['list']],
  outputDir: 'e2e/test-results',
  use: {
    baseURL,
    locale: 'ru-RU',
    timezoneId: 'Europe/Minsk',
    colorScheme: 'light',
    ...devices['Desktop Chrome'],
  },
  webServer: process.env.E2E_SKIP_WEBSERVER
    ? undefined
    : {
        command: 'npm run dev',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
