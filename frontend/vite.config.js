import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import optimizeImages from './optimize-images.mjs'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react(), optimizeImages()],
  server: {
    host: '0.0.0.0',
    proxy: { '/api': 'http://127.0.0.1:5000', '/fotos': 'http://127.0.0.1:5000', '/logos': 'http://127.0.0.1:5000' },
    port: 3000,
    strictPort: true,
    fs: { allow: [fileURLToPath(new URL('..', import.meta.url))] }
  }
})
