import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
// @ts-expect-error - MJS build script
import { prerenderSeoRoutes } from './scripts/prerender-seo-routes.js';

function getAppVersion() {
  try {
    const versionFile = path.resolve(__dirname, 'public/__version.json');
    if (fs.existsSync(versionFile)) {
      const parsed = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
      if (parsed.fullSha && parsed.fullSha !== 'unknown') return parsed.fullSha;
      if (parsed.commitSha) return parsed.commitSha;
    }
  } catch {
    // ignore
  }
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    return new Date().toISOString();
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inject-app-version-meta',
      transformIndexHtml(html) {
        const version = getAppVersion();
        if (html.includes('name="app-version"')) {
          return html.replace(/<meta name="app-version" content="[^"]*"\s*\/?>/, `<meta name="app-version" content="${version}" />`);
        }
        return html.replace('</head>', `  <meta name="app-version" content="${version}" />\n</head>`);
      }
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo-new.jpeg', 'hero-products.jpg', 'robots.txt', 'llms.txt'],
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MiB
        navigateFallbackDenylist: [/^\/__version\.json$/, /^\/sitemap\.xml$/, /^\/sitemap-productos\.xml$/, /^\/google-merchant-feed\.xml$/, /^\/robots\.txt$/, /^\/llms\.txt$/],
        runtimeCaching: [
          {
            urlPattern: /\/__version\.json/,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^https:\/\/zdciwzeokkrwcxvsgusc\.supabase\.co\/rest\/v1\/products/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'supabase-products-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 30, // 30 minutes
              },
            },
          },
        ],
      },
      manifest: {
        name: 'J. Denis — Fabricante de Cosméticos Profesionales',
        short_name: 'J. Denis',
        description: 'Fabricante nacional de cosméticos profesionales para cejas, pestañas, lash lifting, pigmentos y venta al mayoreo en México.',
        theme_color: '#1a1a2e',
        background_color: '#f8f4ef',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'portrait-primary',
        categories: ['shopping', 'beauty', 'business'],
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
    }),
    {
      name: 'prerender-seo-routes-plugin',
      apply: 'build',
      enforce: 'post',
      closeBundle: {
        order: 'post',
        sequential: true,
        async handler() {
          await prerenderSeoRoutes();
        }
      }
    }
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('jspdf') || id.includes('html2canvas')) return 'vendor-pdf';
          if (id.includes('xlsx')) return 'vendor-xlsx';
          if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
          if (id.includes('@supabase')) return 'vendor-supabase';
          if (id.includes('framer-motion')) return 'vendor-motion';
          return undefined;
        },
      },
    },
  },
});
