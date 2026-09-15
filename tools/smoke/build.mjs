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
  plugins: [
    {
      /* Vite replaces `import.meta.glob` at build time; esbuild cannot, so the
         harness stubs it. An empty result means "no model dropped in", which is
         exactly what the default checkout looks like. */
      name: 'vite-import-meta-glob',
      setup(pluginBuild) {
        pluginBuild.onLoad({ filter: /\.(ts|tsx)$/ }, async (args) => {
          const source = await (await import('node:fs/promises')).readFile(args.path, 'utf8')
          if (!source.includes('import.meta.glob')) return null
          return {
            contents: source.replace(/import\.meta\.glob/g, 'globalThis.__viteGlob'),
            loader: args.path.endsWith('.tsx') ? 'tsx' : 'ts',
          }
        })
      },
    },
  ],
})
