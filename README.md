# A3 — Boomerang

Single full-viewport marketing landing page for **Boomerang**, a conversational AI platform for financial institutions.

**Stack:** React + TypeScript + Vite + Tailwind CSS + Lucide React (`ArrowRight` only).

## Signature motion

The hero background video (CloudFront MP4) plays once while every frame is captured into offscreen canvases (max width 960px, deduplicated by `currentTime`). On `ended`, the video is hidden and a display canvas ping-pongs through the captured frames at 30fps — a soft forward→reverse "boomerang" loop. See `src/components/BoomerangVideoBg.tsx`.

## Fonts

- Display/serif: `P22 Mackinac W01 Book` (onlinewebfonts)
- UI/sans: Inter 300/400/500/600 (Google Fonts)

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview
```
