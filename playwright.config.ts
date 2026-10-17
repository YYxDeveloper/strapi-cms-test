import { defineConfig, devices } from '@playwright/test';

/**
 * E2E config for the LaunchPad demo.
 *
 * The app under test is expected to already be running (the OrbStack compose
 * stack serves Nuxt on :3001 by default). Point the run elsewhere with
 * `PLAYWRIGHT_BASE_URL=https://host:port npx playwright test`.
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3001';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    video: 'off',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
