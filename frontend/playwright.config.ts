import { defineConfig, devices } from '@playwright/test';

const frontendPort = 4173;

export default defineConfig({
    testDir: './e2e',
    fullyParallel: false,
    retries: process.env.CI ? 2 : 0,
    reporter: 'list',
    snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{ext}',
    use: {
        baseURL: `http://127.0.0.1:${frontendPort}`,
        colorScheme: 'light',
        locale: 'ru-RU',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
        viewport: { width: 1280, height: 900 },
    },
    expect: {
        toHaveScreenshot: {
            animations: 'disabled',
            maxDiffPixelRatio: 0.01,
        },
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    webServer: [
        {
            command: 'node e2e/mock-upstreams.cjs',
            port: 4101,
            reuseExistingServer: !process.env.CI,
        },
        {
            command:
                'ASTEROIDS_API_URL=http://127.0.0.1:4101 RESOURCES_API_URL=http://127.0.0.1:4102 SERVER_PORT=5678 WEBSOCKET_PORT=5679 MINING_UPDATE_INTERVAL=60000 npm run dev --workspace ../backend',
            port: 5678,
            reuseExistingServer: !process.env.CI,
        },
        {
            command:
                'VITE_API_PROXY_TARGET=http://127.0.0.1:5678 VITE_WS_PROXY_TARGET=http://127.0.0.1:5679 npm run dev -- --host 127.0.0.1 --port 4173',
            port: frontendPort,
            reuseExistingServer: !process.env.CI,
        },
    ],
});
