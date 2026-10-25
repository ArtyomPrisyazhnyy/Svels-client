#!/usr/bin/env node
/**
 * CI entry: mock API + production Next on :3001 for Lighthouse CI.
 */
import { execSync, spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const baseUrl = 'http://127.0.0.1:3001';
const apiUrl = 'http://127.0.0.1:3000';

const children = [];

function spawnTracked(command, args, env = {}) {
  const child = spawn(command, args, {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
  children.push(child);
  return child;
}

async function waitFor(url) {
  for (let i = 0; i < 90; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) {
        return;
      }
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Server not ready: ${url}`);
}

async function main() {
  for (const port of [3000, 3001]) {
    try {
      execSync(`lsof -ti:${port} | xargs -r kill -9`, { stdio: 'ignore', shell: true });
    } catch {
      // ignore
    }
  }
  try {
    execSync('pkill -9 -f "next-server" 2>/dev/null || true', { stdio: 'ignore', shell: true });
  } catch {
    // ignore
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));

  spawnTracked('node', [path.join(__dirname, 'mock-api.mjs')], { PORT: '3000' });
  await waitFor(`${apiUrl}/health`);

  spawnTracked('npm', ['run', 'start'], {
    NEXT_PUBLIC_API_URL: apiUrl,
    NEXT_PUBLIC_SITE_URL: baseUrl,
  });
  await waitFor(baseUrl);

  console.log('lighthouse-ci-server-ready');
  // Keep process alive for LHCI collect runs.
  await new Promise(() => {});
}

function shutdown() {
  for (const child of children) {
    child.kill('SIGTERM');
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

main().catch((error) => {
  console.error(error);
  shutdown();
  process.exit(1);
});
