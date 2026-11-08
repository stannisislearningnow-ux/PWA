import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'QR Attendance',
        short_name: 'Attendance',
        description: 'Offline-ready QR attendance scanner',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Cache the complete app shell and bundled JavaScript (including jsQR).
        globPatterns: ['**/*.{html,js,css,ico,png,svg,webmanifest}'],
        cleanupOutdatedCaches: true
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.trycloudflare.com']
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: ['.trycloudflare.com']
  }
})
