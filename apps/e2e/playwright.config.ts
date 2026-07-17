import { defineConfig, devices } from '@playwright/test'

// Playground dev server (see apps/playground/vite.config.ts — host 0.0.0.0, port 8081).
const PORT = 8081
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    // Fail CI if a test.only was left in the source.
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',

    use: {
        baseURL,
        trace: 'on-first-retry',
    },

    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        // Enable locally when needed — CI runs chromium only for speed:
        // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ],

    // Playground consumes @vueland/ui straight from src via alias — no library build needed.
    webServer: {
        command: 'pnpm --filter playground dev:play',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
})
