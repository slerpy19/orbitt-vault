import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages repo name - change this to your repo name
const REPO_NAME = 'orbitt-vault';

export default defineConfig({
  base: `/${REPO_NAME}/`,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon-v2.png', 'favicon-v2.png', 'launch-1206x2622.png', 'tokens/*'],
      manifest: {
        id: `/${REPO_NAME}/`,
        start_url: `/${REPO_NAME}/`,
        scope: `/${REPO_NAME}/`,
        name: 'Orbitt Vault',
        short_name: 'Orbitt Vault',
        description: 'A local crypto wallet interface simulator with read-only market quotes and key-based access',
        theme_color: '#000000',
        background_color: '#ab9ff2',
        display: 'standalone',
        icons: [
          { src: 'pwa-192-v2.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512-v2.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'app-icon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
    }),
  ],
  test: { environment: 'jsdom' },
});