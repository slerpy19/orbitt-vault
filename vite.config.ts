import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages repo name - change this to your repo name
const REPO_NAME = 'orbitt-vault';
const GITHUB_USER = 'slerpy19';
const BASE_PATH = `/${REPO_NAME}/`;

export default defineConfig({
  base: BASE_PATH,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon-v2.png', 'favicon-v2.png', 'launch-1206x2622.png', 'tokens/*'],
      manifest: {
        id: BASE_PATH,
        start_url: BASE_PATH,
        scope: BASE_PATH,
        name: 'Orbitt Vault',
        short_name: 'Orbitt Vault',
        description: 'A local crypto wallet interface simulator with read-only market quotes and key-based access',
        theme_color: '#000000',
        background_color: '#ab9ff2',
        display: 'standalone',
        icons: [
          { src: `${BASE_PATH}pwa-192-v2.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: `${BASE_PATH}pwa-512-v2.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: `${BASE_PATH}app-icon.svg`, sizes: 'any', type: 'image/svg+xml' },
        ],
      },
    }),
  ],
  test: { environment: 'jsdom' },
});