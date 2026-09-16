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
  /* The sandbox proxies the preview on a generated host
     (`<port>-<sandbox>.e2b.app`); Vite's dev-server host check would answer it
     with 403, so any host that reaches this port is accepted. `preview` gets the
     same allowance because `npm run preview` serves the production build there. */
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: true,
    hmr: process.env.DISABLE_HMR === 'true' ? false : { clientPort: 443 },
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: true,
  },
})
