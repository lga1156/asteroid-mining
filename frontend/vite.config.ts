import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
