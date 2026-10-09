import dotenv from 'dotenv';
import path from 'path';
import { apiClient } from './helpers/api';
import { getSuperAdminCredentials, writeSeed, type E2eSeed } from './helpers/env';
import { ensureRestaurantProductionStaff } from './helpers/staff-seed';

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../../Svels-backend/.env') });

function randomDigits(length: number): string {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += String(Math.floor(Math.random() * 10));
  }
  return out;
}

async function waitForApi(maxAttempts = 30): Promise<void> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await apiClient.listRestaurants();
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error(`Backend API недоступен: ${String(lastError)}`);
}

export default async function globalSetup(): Promise<void> {
  await waitForApi();

  const superCreds = getSuperAdminCredentials();
  const superAuth = await apiClient.login(superCreds.email, superCreds.password);

  const stamp = Date.now().toString(36);
  const email = `e2e.admin.${stamp}@svels.test`;
  const password = `E2ePass!${stamp}`;
  const restaurantName = `E2E Cafe ${stamp}`;
  const unp = randomDigits(9);

  const registered = await apiClient.register({
    email,
    password,
    firstName: 'E2E',
    lastName: 'Admin',
  });

  const request = await apiClient.registerRestaurant(registered.accessToken, {
    name: restaurantName,
    unp,
    description: 'Playwright e2e restaurant',
    isChain: false,
    locations: [
      { city: 'Минск', address: 'ул. Тестовая 1' },
      { city: 'Минск', address: 'ул. Тестовая 2' },
    ],
  });

  await apiClient.reviewRegistration(superAuth.accessToken, request.id, 'approve');

  const adminAuth = await apiClient.login(email, password);
  if (adminAuth.user.role !== 'restaurant_admin' || !adminAuth.user.restaurantId) {
    throw new Error(
      `Expected restaurant_admin with restaurantId, got role=${adminAuth.user.role} restaurantId=${adminAuth.user.restaurantId}`,
    );
  }

  const restaurantId = adminAuth.user.restaurantId;

  const productionEmail = `e2e.production.${stamp}@svels.test`;
  const productionPassword = `E2ePass!${stamp}P`;
  const productionAuth = await ensureRestaurantProductionStaff(
    restaurantId,
    adminAuth.accessToken,
    {
      email: productionEmail,
      password: productionPassword,
      firstName: 'E2E',
      lastName: 'Production',
    },
  );

  if (productionAuth.user.role !== 'restaurant_production') {
    throw new Error(
      `Expected restaurant_production staff, got role=${productionAuth.user.role}`,
    );
  }

  const menu = await apiClient.seedDefaultMenu(restaurantId, adminAuth.accessToken);

  const seededLocations = await apiClient.listRestaurantLocations(
    restaurantId,
    adminAuth.accessToken,
  );
  for (const [index, location] of seededLocations.entries()) {
    await apiClient.updateRestaurantLocation(restaurantId, adminAuth.accessToken, location.id, {
      lat: 53.9045 + index * 0.01,
      lng: 27.5615 + index * 0.01,
    });
  }

  const { auth: guest } = await apiClient.createGuest(restaurantId, 'Seed', 'Guest');

  const seed: E2eSeed = {
    restaurantId,
    restaurantName,
    restaurantAdmin: {
      email,
      password,
      auth: adminAuth,
    },
    restaurantProduction: {
      email: productionEmail,
      password: productionPassword,
      auth: productionAuth,
    },
    superAdmin: {
      email: superCreds.email,
      password: superCreds.password,
      auth: superAuth,
    },
    guest,
    menu,
    createdAt: new Date().toISOString(),
  };

  writeSeed(seed);
  console.log(`[e2e] Seeded restaurant ${seed.restaurantId} (${restaurantName}) as ${email}`);
}
