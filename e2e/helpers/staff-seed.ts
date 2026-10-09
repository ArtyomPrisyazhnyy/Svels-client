import { spawnSync } from 'node:child_process';
import path from 'node:path';
import type { AuthResponse } from '../../src/shared/types/auth';
import { apiClient } from './api';

interface ProductionStaffInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

function seedProductionStaffInDatabase(
  restaurantId: string,
  input: ProductionStaffInput,
): void {
  const databaseUrl =
    process.env.E2E_DATABASE_URL ??
    process.env.DATABASE_URL ??
    'postgresql://postgres:postgres@127.0.0.1:5432/svels';

  const backendDir = path.resolve(__dirname, '../../Svels-backend');
  const script = `
    const bcrypt = require('bcrypt');
    const { Client } = require('pg');
    const { v7: uuidv7 } = require('uuid');

    (async () => {
      const email = process.env.E2E_STAFF_EMAIL.toLowerCase();
      const existing = await (async () => {
        const client = new Client({ connectionString: process.env.E2E_DATABASE_URL });
        await client.connect();
        const res = await client.query(
          'SELECT id FROM users WHERE email = $1 AND "restaurantId" = $2 LIMIT 1',
          [email, process.env.E2E_RESTAURANT_ID],
        );
        await client.end();
        return res.rows[0]?.id ?? null;
      })();

      if (existing) {
        return;
      }

      const passwordHash = await bcrypt.hash(process.env.E2E_STAFF_PASSWORD, 12);
      const client = new Client({ connectionString: process.env.E2E_DATABASE_URL });
      await client.connect();
      await client.query(
        \`INSERT INTO users (
          id, email, phone, "passwordHash", "firstName", "lastName",
          role, "authProvider", "googleId", "restaurantId", "createdAt", "updatedAt"
        ) VALUES ($1, $2, NULL, $3, $4, $5, 'restaurant_production', 'local', NULL, $6, now(), now())\`,
        [
          uuidv7(),
          email,
          passwordHash,
          process.env.E2E_STAFF_FIRST,
          process.env.E2E_STAFF_LAST,
          process.env.E2E_RESTAURANT_ID,
        ],
      );
      await client.end();
    })().catch((error) => {
      console.error(error);
      process.exit(1);
    });
  `;

  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: backendDir,
    env: {
      ...process.env,
      E2E_DATABASE_URL: databaseUrl,
      E2E_RESTAURANT_ID: restaurantId,
      E2E_STAFF_EMAIL: input.email,
      E2E_STAFF_PASSWORD: input.password,
      E2E_STAFF_FIRST: input.firstName,
      E2E_STAFF_LAST: input.lastName,
    },
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error('Не удалось создать restaurant_production в БД для e2e');
  }
}

/**
 * Создаёт staff production через API; при отсутствии эндпоинта — прямой INSERT (CI / локально с Postgres).
 */
export async function ensureRestaurantProductionStaff(
  restaurantId: string,
  adminToken: string,
  input: ProductionStaffInput,
): Promise<AuthResponse> {
  try {
    return await apiClient.createRestaurantStaffUser(restaurantId, adminToken, {
      ...input,
      role: 'restaurant_production',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/→ 404:|Staff user API is not available/.test(message)) {
      throw error;
    }
    seedProductionStaffInDatabase(restaurantId, input);
    return apiClient.login(input.email, input.password);
  }
}
