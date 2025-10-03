import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['dump-icon.svg'],
      manifest: {
        name: 'DUMP - Digital Unorganized Memory Pile',
        short_name: 'DUMP',
        description: 'Ta bilder av det du skal huske - Digital Unorganized Memory Pile',
        theme_color: '#646cff',
        background_color: '#242424',
        display: 'standalone',
        icons: [
          {
            src: 'dump-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'dump-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.gitpod.dev']
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  }
})
