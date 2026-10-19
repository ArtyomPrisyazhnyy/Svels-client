#!/usr/bin/env node
/**
 * Минимальный mock API для демо-заведения лендинга (порт 3000).
 */
import http from 'node:http';
import {
  LANDING_DEMO_RESTAURANT_ID,
  LANDING_DEMO_AUTH,
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

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function bearerToken(req) {
  const header = req.headers.authorization ?? '';
  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match?.[1] ?? null;
}

function isAuthed(req) {
  return bearerToken(req) === demo.demoAuth.accessToken;
}

function routeGet(path) {
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
  if (path === `/restaurants/${id}/telegram/chats`) {
    return { status: 200, body: [] };
  }
  if (path.startsWith(`/restaurants/${id}/pre-orders`)) {
    return {
      status: 200,
      body: {
        items: demo.demoOrders,
        total: demo.demoOrders.length,
        page: 1,
        limit: 50,
        serverTime: new Date().toISOString(),
      },
    };
  }

  return { status: 404, body: { message: 'Not found' } };
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  const path = (req.url ?? '/').split('?')[0];

  if (req.method === 'POST' && path === '/auth/login') {
    try {
      const body = await readBody(req);
      if (
        body.email === LANDING_DEMO_AUTH.email &&
        body.password === LANDING_DEMO_AUTH.password
      ) {
        json(res, 200, demo.demoAuth);
        return;
      }
      json(res, 401, { message: 'Invalid credentials' });
    } catch {
      json(res, 400, { message: 'Bad request' });
    }
    return;
  }

  if (req.method === 'PATCH' && path === `/restaurants/${id}/order-settings/pause`) {
    if (!isAuthed(req)) {
      json(res, 401, { message: 'Unauthorized' });
      return;
    }
    json(res, 200, demo.orderSettings);
    return;
  }

  if (req.method === 'GET') {
    if (path.startsWith(`/restaurants/${id}/pre-orders`) && !isAuthed(req)) {
      json(res, 401, { message: 'Unauthorized' });
      return;
    }
    if (path.startsWith(`/restaurants/${id}/telegram/`) && !isAuthed(req)) {
      json(res, 401, { message: 'Unauthorized' });
      return;
    }
    const match = routeGet(path);
    json(res, match.status, match.body);
    return;
  }

  json(res, 405, { message: 'Method not allowed' });
});

server.listen(port, host, () => {
  console.log(`[landing-mock-api] http://${host}:${port} (demo: /restaurants/${id})`);
});
