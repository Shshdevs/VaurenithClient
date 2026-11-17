import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  testMatch: 'auth-flow.spec.ts',
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4178',
    browserName: 'chromium',
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  webServer: {
    command:
      'PORT=4178 VITE_API_BASE_URL= VITE_OIDC_AUTHORITY=http://oidc.test/realms/test VITE_OIDC_CLIENT_ID=vaurenith-e2e VITE_OIDC_REDIRECT_URI=http://127.0.0.1:4178/auth/callback pnpm dev --host 127.0.0.1',
    url: 'http://127.0.0.1:4178',
    reuseExistingServer: false,
    timeout: 30_000,
  },
})
