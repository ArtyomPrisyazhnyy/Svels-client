import fs from 'fs';
import path from 'path';
import type { AuthResponse, AuthUser } from './api';

export interface E2eSeedMenu {
  categoryId: string;
  defaultMenuItemId: string;
  modifierMenuItemId: string;
}

export interface E2eSeedStaffAccount {
  email: string;
  password: string;
  auth: AuthResponse;
}

export interface E2eSeed {
  restaurantId: string;
  restaurantName: string;
  restaurantAdmin: {
    email: string;
    password: string;
    auth: AuthResponse;
  };
  restaurantProduction: E2eSeedStaffAccount;
  superAdmin: {
    email: string;
    password: string;
    auth: AuthResponse;
  };
  guest: AuthResponse;
  menu: E2eSeedMenu;
  createdAt: string;
}

export function getApiUrl(): string {
  return process.env.E2E_API_URL ?? 'http://127.0.0.1:3000';
}

export function getBaseUrl(): string {
  return process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3001';
}

export function getSuperAdminCredentials(): { email: string; password: string } {
  const email = process.env.E2E_SUPER_ADMIN_EMAIL ?? process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.E2E_SUPER_ADMIN_PASSWORD ?? process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Задайте E2E_SUPER_ADMIN_EMAIL/PASSWORD или SUPER_ADMIN_* в Svels-backend/.env / e2e/.env',
    );
  }

  return { email, password };
}

export function seedPath(): string {
  return path.resolve(__dirname, '../.auth/seed.json');
}

export function readSeed(): E2eSeed {
  const file = seedPath();
  if (!fs.existsSync(file)) {
    throw new Error(`Seed file not found: ${file}. Run global-setup first.`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8')) as E2eSeed;
}

export function writeSeed(seed: E2eSeed): void {
  const file = seedPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(seed, null, 2), 'utf8');
}

export type { AuthUser };
