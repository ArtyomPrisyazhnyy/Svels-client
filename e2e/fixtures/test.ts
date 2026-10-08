import { test as base, expect } from '@playwright/test';
import { apiClient } from '../helpers/api';
import { injectAuth } from '../helpers/auth';
import { readSeed, type E2eSeed } from '../helpers/env';

type Fixtures = {
  seed: E2eSeed;
  asSuperAdmin: void;
  asRestaurantAdmin: void;
  asGuest: void;
};

export const test = base.extend<Fixtures>({
  seed: async ({}, use) => {
    await use(readSeed());
  },

  asSuperAdmin: async ({ page, seed }, use) => {
    await injectAuth(page, seed.superAdmin.auth);
    await use();
  },

  asRestaurantAdmin: async ({ page, seed }, use) => {
    await injectAuth(page, seed.restaurantAdmin.auth);
    await use();
  },

  asGuest: async ({ page, seed }, use) => {
    await injectAuth(page, seed.guest);
    await use();
  },
});

export { expect, apiClient };
