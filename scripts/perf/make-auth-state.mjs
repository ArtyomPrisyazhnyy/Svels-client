#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const seedPath = path.resolve('e2e/.auth/seed.json');
const baseUrl = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3001';
const outPath = process.argv[2] ?? path.resolve('e2e/.auth/guest-storage.json');

const seed = JSON.parse(readFileSync(seedPath, 'utf8'));
const payload = JSON.stringify({
  state: {
    accessToken: seed.guest.accessToken,
    user: seed.guest.user,
  },
  version: 0,
});

const storage = {
  cookies: [],
  origins: [
    {
      origin: baseUrl,
      localStorage: [{ name: 'svels-auth', value: payload }],
    },
  ],
};

writeFileSync(outPath, JSON.stringify(storage, null, 2));
console.log(`Wrote ${outPath} for restaurant ${seed.restaurantId}`);
