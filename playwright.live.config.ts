import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e/live',
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    browserName: 'chromium',
    channel: 'chrome',
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
  },
})
