import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@app': path.resolve(__dirname, './src/app'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      // All /api requests are forwarded to the backend server.
      // This avoids CORS in development — the browser only ever talks to localhost:3000.
      '/api': {
        target: 'https://rosybrown-goat-692345.hostingersite.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
