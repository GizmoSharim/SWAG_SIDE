import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy evita CORS em desenvolvimento
    proxy: {
      '/products': 'http://localhost:3333',
      '/orders':   'http://localhost:3333',
    },
  },
});
