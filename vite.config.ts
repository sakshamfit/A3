import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      /* shadcn convention: `@/` maps to src/ */
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    hmr: process.env.DISABLE_HMR === 'true' ? false : { clientPort: 443 },
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
})
