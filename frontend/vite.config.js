import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.png', 'favicon.ico'],
      manifest: {
        name: 'ArogyaVani AI',
        short_name: 'ArogyaVani',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#00a896',
        icons: [
          {
            src: 'icon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: '/'
});
