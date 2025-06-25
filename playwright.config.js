// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    headless: true,               // Run tests without opening the browser
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
});
