import { defineConfig } from '@playwright/test';

// Build both targets first; see the test:e2e step in .github/workflows/test.yml.
// "production" is what Pages deploys. "development" exposes window.ng, which the
// suite uses to read Angular state and attach an exportEvent listener.
const targets = [
  { name: 'production', dir: 'demo/dist/browser', port: 4310 },
  { name: 'development', dir: 'demo/dist-e2e/browser', port: 4311 },
];

export default defineConfig({
  testDir: '.',
  outputDir: '../test-results',
  forbidOnly: !!process.env['CI'],
  reporter: 'list',
  use: { viewport: { width: 1400, height: 900 }, acceptDownloads: true },
  projects: targets.map(({ name, port }) => ({
    name,
    use: { browserName: 'chromium', baseURL: `http://localhost:${port}/` },
  })),
  webServer: targets.map(({ dir, port }) => ({
    command: `node e2e/serve.mjs ${dir} ${port}`,
    cwd: '..',
    port,
    reuseExistingServer: !process.env['CI'],
  })),
});
