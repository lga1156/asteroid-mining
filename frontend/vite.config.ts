import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import packageJson from '../package.json';

export default defineConfig({
    plugins: [react()],
    base: process.env.VITE_BASE_PATH ?? '/',
    define: {
        __APP_VERSION__: JSON.stringify(packageJson.version),
    },
    build: {
        rollupOptions: {
            input: {
                app: 'index.html',
                starfield: 'src/libs/starfield/index.html',
            },
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://51.250.39.129:5678',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/status': {
                target: 'http://51.250.39.129:5679',
                changeOrigin: true,
                ws: true,
            },
        },
    },
    preview: {
        proxy: {
            '/api': {
                target: 'http://51.250.39.129:5678',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/status': {
                target: 'http://51.250.39.129:5679',
                changeOrigin: true,
                ws: true,
            },
        },
    },
});
