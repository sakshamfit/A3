/** Bundles the smoke-test entry (React + GSAP + Three) for the jsdom harness. */
import { build } from 'esbuild'

await build({
  entryPoints: ['tools/smoke/entry.tsx'],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  jsx: 'automatic',
  outfile: 'tools/smoke/bundle.mjs',
  define: { 'process.env.NODE_ENV': '"development"' },
  logLevel: 'error',
})
