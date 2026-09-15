# A3 Interior Designer & Builder — website

Marketing site for **A3 Interior Designer & Builder**, an interior design and build studio at
Azeet Plaza, Commercial Road, Buddha Vihar, Taramandal, Gorakhpur, Uttar Pradesh 273001
(4.8 ★ · 174 Google reviews · open until 10 pm · [wa.me](https://wa.me/919451546780) appointments).

Motion is GSAP + ScrollTrigger, the material board is a live Three.js scene, and every interior
photograph on the page was generated for this build and ships from `public/images` as WebP.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview
```

## Stack

| Piece | Choice |
| --- | --- |
| Build | Vite 5 + React 18 + TypeScript |
| Styling | Tailwind CSS 3 (PostCSS build) + a small token layer in `src/index.css` |
| Motion | GSAP 3.15 — ScrollTrigger + SplitText (bundled, no CDN) |
| 3D | Three.js 0.186, `WebGLRenderer` — lazy chunk, no `@react-three/*` wrapper |
| Icons | `iconify-icon` web component, Solar set registered offline from `@iconify-icons/solar` |
| Imagery | 10 generated interiors, committed as WebP (~1.2 MB total) |

## Type system

Carried over from [`sakshamfit/trendy-attier`](https://github.com/sakshamfit/trendy-attier) and
re-tuned to the A3 palette:

- **Archivo** (400–900) for all display type — uppercase, `line-height: .92`, `letter-spacing: -.03em`,
  with `-0.045em` on the tightest scale
- `clamp()` type scale (`.display`, `.headline`, `.subhead`, `.lbl`, `.lede`) so nothing steps
  awkwardly between 360 px and 1440 px
- Measure is set in `ch` (`.lede` 46ch, `.copy` 52ch) with `text-wrap: pretty` / `balance`,
  and `font-variant-numeric: tabular-nums` on every figure (`.num`)
- Micro labels at `.2em` tracking; underline-wipe links (`.u`); Archivo buttons at `0.18em`
- **Instrument Serif italic** survives as the `.accent` class for the one emphasised word per
  headline, with **Inter Tight** for running copy

## Sections

| # | Section | Motion / 3D |
| --- | --- | --- |
| 1 | **Hero** — image at `object-bottom`/`opacity-70` over `#111` with gradient | intro timeline; SplitText line masks (`autoSplit`, re-splits after font swap); scrub parallax + copy lift |
| — | **Marquee** — services ticker | infinite GSAP tween whose `timeScale` follows scroll velocity |
| 2 | **Philosophy** — sticky metrics rail (3) · spacer (2) · narrative (7) | clip-path figure reveal, per-word opacity scrub, counting metrics, rules that draw in |
| 3 | **Residences** — sticky availability rail with L/R arrows | row entrances, hairline draw, image parallax; `grayscale-[20%]` → colour, `duration-1000` scale |
| 4 | **Atelier** — material board | **Three.js**: abstract A3 room lit through one aperture, floating material board, pointer lean, camera dolly on scroll, planes lift when the DOM swatch list is hovered |
| 5 | **Transform** — shell → finished | pinned sticky frame; a `--p` custom property GSAP scrubs 0 → 1 wipes the blueprint shell off the finished render |
| 6 | **Gallery** — 400 px mosaic (tall / wide / standard / standard) | tile un-clip on entry + per-tile parallax, grayscale → colour on hover |
| 7 | **Reviews** — 4.8 from 174, verbatim Google quotes | scroll-driven horizontal track on desktop, stacked list on mobile |
| 8 | **Contact** — stone-100, underlined fields | field stagger; submit composes a pre-filled WhatsApp message (no server, nothing stored) |
| 9 | **Footer** — stone-900, closing CTA |

## Three.js notes

`src/components/three/RoomScene.tsx` builds the room from primitives, one `DirectionalLight`
through the aperture with soft shadow maps, ACES tone mapping and a canvas-generated glow
texture for the sun patch. It pauses when off-screen (`IntersectionObserver`), renders once when
`prefers-reduced-motion` is set, falls back to a static gradient panel without WebGL, and is
`React.lazy`-loaded only once the section comes within 500 px of the viewport — so the main
bundle stays at ~121 kB gzip and Three.js (~134 kB gzip) loads on demand.

## Scrolling

A plain, naturally scrolling document — this is deliberate:

- no height clamp or `overflow` lock on `html`/`body`; `overflow-x: clip` (never `hidden`)
  suppresses stray horizontal overflow **without** creating a scroll container, which also keeps
  every `position: sticky` element working
- native `scroll-smooth` plus `scroll-behavior: smooth` — **no Lenis** or similar
- pinning is CSS `sticky` inside tall sections, so there are no `pin-spacer` jumps
- the only vertical lock is the deliberate one while the full-screen menu is open
- GSAP's entrance states live behind `.gsap-ready` (added only once JS boots) and every
  `gsap.context()` reverts on unmount, so the page is fully readable without JS and after a
  route/section teardown

## Content

All business copy, projects, materials, process steps, gallery captions, metrics and review
quotes live in `src/lib/site.ts`.
