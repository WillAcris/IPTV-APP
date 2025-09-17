import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'iptv-app-7x3r.onrender.com',
      'localhost',
      '127.0.0.1'
    ]
  },
  preview: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
    host: '0.0.0.0',
    allowedHosts: [
      'iptv-app-7x3r.onrender.com',
      'localhost',
      '127.0.0.1'
    ]
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  }
});
