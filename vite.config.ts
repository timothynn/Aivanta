import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: './',
    plugins: [react()],
    build: {
      target: 'es2020',
      sourcemap: true,
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET ?? 'http://localhost:8787',
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: 'jsdom',
      exclude: ['**/node_modules/**', '**/dist/**', '**/server-dist/**'],
      globals: true,
      setupFiles: './src/test/setup.ts',
      testTimeout: 30_000,
      hookTimeout: 30_000,
    },
  };
});
