import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,          // test, expect 등을 전역으로
    setupFiles: './vitest.setup.js',
  },
});
