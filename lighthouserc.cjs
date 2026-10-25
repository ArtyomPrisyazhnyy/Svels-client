/** @type {import('@lhci/cli').LHCI.ServerCommand.Options} */
module.exports = {
  ci: {
    collect: {
      url: [
        'http://127.0.0.1:3001/',
        `http://127.0.0.1:3001/restaurants/${process.env.LIGHTHOUSE_RESTAURANT_ID ?? '00000000-0000-4000-8000-000000000001'}`,
        'http://127.0.0.1:3001/privacypolicy',
      ],
      numberOfRuns: 1,
      settings: {
        formFactor: 'mobile',
        screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75 },
        onlyCategories: ['performance', 'best-practices', 'seo'],
        chromeFlags: '--headless=new --no-sandbox --disable-dev-shm-usage',
      },
      startServerCommand: 'node scripts/lighthouse/ci-server.mjs',
      startServerReadyPattern: 'lighthouse-ci-server-ready',
      startServerReadyTimeout: 180000,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-reports/lhci',
    },
  },
};
