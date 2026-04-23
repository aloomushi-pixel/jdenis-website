import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo-new.jpeg', 'hero-products.jpg'],
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // 5 MiB
      },
      manifest: {
        name: 'J. Denis — Insumos Profesionales',
        short_name: 'J. Denis',
        description: 'Tienda profesional de cejas, pestañas e insumos de belleza',
        theme_color: '#1a1a2e',
        background_color: '#f8f4ef',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/logo-new.jpeg',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'any maskable'
          },
          {
            src: '/logo-new.jpeg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
});
