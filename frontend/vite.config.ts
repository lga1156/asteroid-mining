import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiProxyTarget = process.env.VITE_API_PROXY_TARGET ?? 'http://51.250.39.129:5678';
const websocketProxyTarget = process.env.VITE_WS_PROXY_TARGET ?? 'http://51.250.39.129:5679';

export default defineConfig({
    plugins: [react()],
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
                target: apiProxyTarget,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/status': {
                target: websocketProxyTarget,
                changeOrigin: true,
                ws: true,
            },
        },
    },
    preview: {
        proxy: {
            '/api': {
                target: apiProxyTarget,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/status': {
                target: websocketProxyTarget,
                changeOrigin: true,
                ws: true,
            },
        },
    },
});
