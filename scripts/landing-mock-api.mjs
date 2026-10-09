#!/usr/bin/env node
/**
 * Минимальный mock API для демо-заведения лендинга (порт 3000).
 * Используется при съёмке скриншотов и локально с `next start`.
 */
import http from 'node:http';
import {
  LANDING_DEMO_RESTAURANT_ID,
  buildLandingDemoPayload,
} from '../e2e/mock-api/landing-demo-data.mjs';

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? '127.0.0.1';
const demo = buildLandingDemoPayload();
const id = LANDING_DEMO_RESTAURANT_ID;

function json(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(body));
}

function route(url) {
  const path = url.split('?')[0];

  if (path === '/health') {
    return { status: 200, body: { ok: true } };
  }
  if (path === '/restaurants') {
    return { status: 200, body: [demo.restaurant] };
  }
  if (path === `/restaurants/${id}`) {
    return { status: 200, body: demo.restaurant };
  }
  if (path === `/restaurants/${id}/menu`) {
    return { status: 200, body: demo.menu };
  }
  if (path === `/restaurants/${id}/order-settings`) {
    return { status: 200, body: demo.orderSettings };
  }
  if (path === `/restaurants/${id}/styling`) {
    return { status: 200, body: demo.styling };
  }
  if (path === `/restaurants/${id}/social-links`) {
    return { status: 200, body: demo.socialLinks };
  }
  if (path === `/restaurants/${id}/promo-banners/active`) {
    return { status: 200, body: demo.promoBanners };
  }
  if (path === `/restaurants/${id}/booking-settings`) {
    return { status: 200, body: demo.bookingSettings };
  }
  if (path === `/restaurants/${id}/loyalty-settings`) {
    return { status: 200, body: demo.loyaltySettings };
  }
  if (path === `/restaurants/${id}/locations`) {
    return { status: 200, body: demo.locations };
  }

  return { status: 404, body: { message: 'Not found' } };
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    json(res, 405, { message: 'Method not allowed' });
    return;
  }

  const match = route(req.url ?? '/');
  json(res, match.status, match.body);
});

server.listen(port, host, () => {
  console.log(`[landing-mock-api] http://${host}:${port} (demo: /restaurants/${id})`);
});
