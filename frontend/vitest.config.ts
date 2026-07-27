import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        exclude: ['e2e/**', 'node_modules/**'],
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
        css: true,
        server: {
            deps: {
                inline: ['@gravity-ui/uikit', '@gravity-ui/icons'],
            },
        },
    },
});
