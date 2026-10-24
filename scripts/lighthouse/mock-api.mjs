#!/usr/bin/env node
/**
 * Minimal JSON API for Lighthouse / production Next start (no Neon, no real backend).
 */
import { createServer } from 'node:http';
import {
  LIGHTHOUSE_RESTAURANT_ID,
  buildBookingSettingsFixture,
  buildLoyaltySettingsFixture,
  buildMenuFixture,
  buildOrderSettingsFixture,
  buildRestaurantFixture,
  buildStylingFixture,
} from './fixtures.mjs';

const port = Number(process.env.LIGHTHOUSE_MOCK_API_PORT ?? process.env.PORT ?? 3000);
const host = process.env.LIGHTHOUSE_MOCK_API_HOST ?? '127.0.0.1';
const allowedOrigins = new Set([
  'http://127.0.0.1:3001',
  'http://localhost:3001',
]);

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-guest-id, X-Guest-Id',
  );
}

function sendJson(req, res, status, body) {
  applyCors(req, res);
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(payload);
}

function matchRestaurantId(pathname) {
  const match = pathname.match(/^\/restaurants\/([^/]+)(?:\/(.*))?$/);
  if (!match) {
    return null;
  }
  return { id: match[1], sub: match[2] ?? '' };
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${host}`);
  const { pathname } = url;

  if (req.method === 'OPTIONS') {
    applyCors(req, res);
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === '/health') {
    sendJson(req, res, 200, { ok: true });
    return;
  }

  if (pathname === '/restaurants' && req.method === 'GET') {
    sendJson(req, res, 200, [buildRestaurantFixture(LIGHTHOUSE_RESTAURANT_ID)]);
    return;
  }

  const restaurant = matchRestaurantId(pathname);
  if (restaurant) {
    const { id, sub } = restaurant;
    if (id !== LIGHTHOUSE_RESTAURANT_ID) {
      sendJson(req, res, 404, { message: 'Not found' });
      return;
    }

    if (sub === '') {
      sendJson(req, res, 200, buildRestaurantFixture(id));
      return;
    }
    if (sub === 'styling') {
      sendJson(req, res, 200, buildStylingFixture(id));
      return;
    }
    if (sub === 'menu') {
      sendJson(req, res, 200, buildMenuFixture(id));
      return;
    }
    if (sub === 'order-settings') {
      sendJson(req, res, 200, buildOrderSettingsFixture(id));
      return;
    }
    if (sub === 'booking-settings') {
      sendJson(req, res, 200, buildBookingSettingsFixture(id));
      return;
    }
    if (sub === 'loyalty-settings') {
      sendJson(req, res, 200, buildLoyaltySettingsFixture(id));
      return;
    }
    if (sub === 'social-links') {
      sendJson(req, res, 200, []);
      return;
    }
    if (sub === 'promo-banners') {
      sendJson(req, res, 200, []);
      return;
    }
    if (sub === 'favorites') {
      sendJson(req, res, 200, { menuItemIds: [] });
      return;
    }
    if (sub.startsWith('bookings/availability')) {
      sendJson(req, res, 200, { date: url.searchParams.get('date') ?? '', slots: [] });
      return;
    }
  }

  sendJson(req, res, 404, { message: 'Not found' });
});

server.listen(port, host, () => {
  console.log(`[lighthouse-mock-api] http://${host}:${port} restaurant=${LIGHTHOUSE_RESTAURANT_ID}`);
});
