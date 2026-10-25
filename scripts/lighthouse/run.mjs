#!/usr/bin/env node
/**
 * Run Lighthouse (mobile) against a production Next server + mock API.
 *
 * Env:
 *   LIGHTHOUSE_BASE_URL — default http://127.0.0.1:3001
 *   LIGHTHOUSE_SKIP_BUILD — set 1 to reuse existing .next
 *   LIGHTHOUSE_SKIP_SERVER — set 1 if next start already running
 *   LIGHTHOUSE_OUTPUT_DIR — default lighthouse-reports
 */
import { execSync, spawn } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LIGHTHOUSE_RESTAURANT_ID } from './fixtures.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

const baseUrl = process.env.LIGHTHOUSE_BASE_URL ?? 'http://127.0.0.1:3001';
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3000';
const outputDir = path.resolve(root, process.env.LIGHTHOUSE_OUTPUT_DIR ?? 'lighthouse-reports');
const restaurantId = process.env.LIGHTHOUSE_RESTAURANT_ID ?? LIGHTHOUSE_RESTAURANT_ID;

const urls = [
  { id: 'landing', url: `${baseUrl}/` },
  { id: 'venue-home', url: `${baseUrl}/restaurants/${restaurantId}` },
  { id: 'legal-privacy', url: `${baseUrl}/privacypolicy` },
];

const children = [];

function spawnBackground(command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: root,
    stdio: options.stdio ?? 'ignore',
    env: { ...process.env, ...options.env },
    shell: false,
    detached: false,
  });
  children.push(child);
  return child;
}

function runToCompletion(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: options.stdio ?? 'inherit',
      env: { ...process.env, ...options.env },
      shell: false,
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited with ${code}`));
    });
  });
}

async function findPlaywrightChrome() {
  const base = `${process.env.HOME}/.cache/ms-playwright`;
  try {
    const versions = await readdir(base);
    const chromiumDir = versions.find((name) => name.startsWith('chromium-'));
    if (!chromiumDir) {
      return undefined;
    }
    return `${base}/${chromiumDir}/chrome-linux64/chrome`;
  } catch {
    return undefined;
  }
}

async function waitForHttp(url, attempts = 60) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url, { redirect: 'manual' });
      if (res.ok || res.status === 307 || res.status === 308) {
        return;
      }
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Timeout waiting for ${url}`);
}

async function runLighthouse(targetUrl, outPath) {
  const chromeFlags = ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'];
  const chromePath =
    process.env.CHROME_PATH ??
    process.env.LIGHTHOUSE_CHROME_PATH ??
    (await findPlaywrightChrome());
  await runToCompletion(
    'npx',
    [
      'lighthouse',
      targetUrl,
      '--quiet',
      '--chrome-flags=' + chromeFlags.join(' '),
      '--only-categories=performance,best-practices,seo',
      '--form-factor=mobile',
      '--output=json',
      `--output-path=${outPath}`,
    ],
    {
      stdio: 'inherit',
      env: chromePath ? { CHROME_PATH: chromePath } : {},
    },
  );
}

async function readScores(reportPath) {
  const raw = await readFile(reportPath, 'utf8');
  const report = JSON.parse(raw);
  const categories = report.categories ?? {};
  return {
    performance: Math.round((categories.performance?.score ?? 0) * 100),
    bestPractices: Math.round((categories['best-practices']?.score ?? 0) * 100),
    seo: Math.round((categories.seo?.score ?? 0) * 100),
  };
}

async function shutdown() {
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 500));
}

process.on('SIGINT', () => {
  void shutdown().then(() => process.exit(130));
});

function freePorts() {
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
}

async function main() {
  freePorts();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await mkdir(outputDir, { recursive: true });

  if (!process.env.LIGHTHOUSE_SKIP_MOCK) {
    spawnBackground('node', [path.join(__dirname, 'mock-api.mjs')], { PORT: '3000' });
    await waitForHttp(`${apiUrl}/health`);
  }

  if (!process.env.LIGHTHOUSE_SKIP_BUILD) {
    await runToCompletion('npm', ['run', 'clean']);
    await runToCompletion('npm', ['run', 'build'], {
      env: {
        NEXT_PUBLIC_API_URL: apiUrl,
        NEXT_PUBLIC_SITE_URL: baseUrl,
      },
    });
  }

  if (!process.env.LIGHTHOUSE_SKIP_SERVER) {
    spawnBackground('npm', ['run', 'start'], {
      NEXT_PUBLIC_API_URL: apiUrl,
      NEXT_PUBLIC_SITE_URL: baseUrl,
    });
    await waitForHttp(baseUrl);
  }

  const summary = [];
  for (const entry of urls) {
    const reportPath = path.join(outputDir, `${entry.id}.report.json`);
    await runLighthouse(entry.url, reportPath);
    const scores = await readScores(reportPath);
    summary.push({ page: entry.id, url: entry.url, ...scores });
  }

  const summaryPath = path.join(outputDir, 'summary.json');
  await writeFile(summaryPath, JSON.stringify({ measuredAt: new Date().toISOString(), summary }, null, 2));
  console.log(JSON.stringify(summary, null, 2));

  await shutdown();
}

main().catch(async (error) => {
  console.error(error);
  await shutdown();
  process.exit(1);
});
