/**
 * Demo entry for the ui/ folder — renders the whole app, exactly as it ships,
 * so a component here can be eyeballed in isolation without a separate
 * preview route.
 *
 * The snippet this came from imports `App from '../app'`. That path is a
 * Next.js-ism (`app/` or a root `pages`-style export) and it does not resolve
 * here for two reasons:
 *   1. this is a Vite SPA — the component tree lives at `src/App.tsx`
 *      (capital A) and is mounted by `src/main.tsx`;
 *   2. `tsconfig.json` includes `src` with `strict` + `noUnusedLocals`, so a
 *      demo that does not type-check fails `npm run build`, not just the demo.
 * Hence the relative import below. `@/App` would also work — `@` → `src` is
 * wired in both `vite.config.ts` and `tsconfig.json`.
 */
import App from '../../App'

export default function DefaultDemo() {
  return <App />
}
