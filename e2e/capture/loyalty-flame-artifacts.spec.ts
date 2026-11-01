import fs from 'node:fs';
import path from 'node:path';
import { test } from '@playwright/test';
import { prepareForScreenshot, VIEWPORTS } from '../helpers/visual';
import {
  ARTIFACT_SCREENSHOTS_DIR,
  CAPTURE_THEMES,
  FLAME_HEADER_STATES,
  MOCK_GUEST_AUTH,
  guestAuthInitScript,
  mockGuestCaptureApi,
} from './loyalty-flame-capture.fixtures';

const VISUAL_SNAPSHOT_DIR = path.join(
  process.cwd(),
  'e2e/visual/__screenshots__/loyalty-flame.visual.spec.ts',
);

const VIEWPORTS_CAPTURE = [
  { key: '390', size: VIEWPORTS.m390 },
  { key: '1280', size: VIEWPORTS.d1280 },
] as const;

function ensureDirs(): void {
  fs.mkdirSync(ARTIFACT_SCREENSHOTS_DIR, { recursive: true });
  fs.mkdirSync(VISUAL_SNAPSHOT_DIR, { recursive: true });
}

async function saveScreenshot(
  page: import('@playwright/test').Page,
  locator: import('@playwright/test').Locator,
  artifactName: string,
  visualSnapshotName?: string,
): Promise<void> {
  await prepareForScreenshot(page);
  const artifactPath = path.join(ARTIFACT_SCREENSHOTS_DIR, artifactName);
  await locator.screenshot({ path: artifactPath, animations: 'disabled' });

  if (visualSnapshotName) {
    const snapshotPath = path.join(VISUAL_SNAPSHOT_DIR, visualSnapshotName);
    await locator.screenshot({ path: snapshotPath, animations: 'disabled' });
  }
}

test.describe('Loyalty flame capture artifacts', () => {
  test.beforeAll(() => {
    ensureDirs();
  });

  for (const theme of CAPTURE_THEMES) {
    for (const { key: viewportKey, size } of VIEWPORTS_CAPTURE) {
      for (const state of FLAME_HEADER_STATES) {
        test(`header ${state.key} — ${theme} @ ${viewportKey}`, async ({ page }) => {
          await page.setViewportSize(size);
          await page.goto(`/dev/loyalty-flame?theme=${theme}&view=states`);
          const tile = page.getByTestId(state.testId);
          await tile.waitFor({ state: 'visible' });
          const fileName = `loyalty-flame-header-${state.key}-${theme}-${viewportKey}.png`;
          const snapshotName = `loyalty-flame-header-${state.key}-${theme}-${viewportKey}.png`;
          await saveScreenshot(page, tile, fileName, snapshotName);
        });
      }
    }
  }

  test('header button crop — base classic @ 390', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.m390);
    await page.goto('/dev/loyalty-flame?theme=classic&view=states');
    const button = page.getByTestId('loyalty-flame-state-base').getByTestId('loyalty-flame-button');
    await button.waitFor({ state: 'visible' });
    await saveScreenshot(page, button, 'loyalty-flame-button-crop-base-classic-390.png');
  });

  test('header button crop — tier5 midnight @ 390', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.m390);
    await page.goto('/dev/loyalty-flame?theme=midnight&view=states');
    const button = page.getByTestId('loyalty-flame-state-tier-5').getByTestId('loyalty-flame-button');
    await button.waitFor({ state: 'visible' });
    await saveScreenshot(page, button, 'loyalty-flame-button-crop-tier5-midnight-390.png');
  });

  for (const theme of ['classic', 'midnight'] as const) {
    test(`modal — ${theme} @ 390`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.m390);
      await page.goto(`/dev/loyalty-flame?theme=${theme}&openModal=1&state=active`);
      const panel = page.getByTestId('loyalty-flame-info-panel');
      await panel.waitFor({ state: 'visible' });
      const fileName = `loyalty-flame-modal-${theme}-390.png`;
      await saveScreenshot(page, panel, fileName, fileName);
    });
  }

  test('Мои заказы — classic @ 390 (mock API)', async ({ page }) => {
    await page.addInitScript(guestAuthInitScript(MOCK_GUEST_AUTH));
    await mockGuestCaptureApi(page);
    await page.setViewportSize(VIEWPORTS.m390);
    await page.goto('/dev/guest-orders?theme=classic');
    await page.waitForSelector('[data-testid="guest-orders-list"]', { state: 'visible' });
    const block = page.getByTestId('guest-orders-capture-page');
    await saveScreenshot(page, block, 'guest-orders-minsk-classic-390.png');
  });
});
