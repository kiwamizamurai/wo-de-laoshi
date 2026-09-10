import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/wo-de-laoshi/',
  esbuild: {
    jsxImportSource: 'hono/jsx/dom',
  },
  test: {
    environment: 'happy-dom',
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon.svg', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: '我的老师 - 中国語学習アプリ',
        short_name: '我的老师',
        description: 'Chrome内蔵AIで学ぶ中国語学習アプリ。単語帳はオフラインでも利用可能。',
        lang: 'ja',
        theme_color: '#c0392b',
        background_color: '#faf7f2',
        display: 'standalone',
        start_url: '/wo-de-laoshi/#/home',
        scope: '/wo-de-laoshi/',
        id: '/wo-de-laoshi/',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
