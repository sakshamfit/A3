# A3 Interior Designer & Builder — website

Marketing site for **A3 Interior Designer & Builder**, an interior design and build studio at
Azeet Plaza, Commercial Road, Buddha Vihar, Taramandal, Gorakhpur, Uttar Pradesh 273001
(4.8 ★ · 174 Google reviews · open until 10 pm · [wa.me](https://wa.me/919451546780) appointments).

Motion is GSAP + ScrollTrigger, the material board is a live Three.js scene, and every interior
photograph on the page was generated for this build and ships from `public/images` as WebP.
The page is a soft blush pink (`#FAEEEF`) with near-black `#111` / `#1a1a1a` bands, kept tight —
no band has more than 84 px of padding.

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

## Palette & density

The whole palette hangs off four custom properties in `src/index.css` (mirrored in
`tailwind.config.js`), so the pink can be retuned from one place:

| Token | Value | Used for |
| --- | --- | --- |
| `--bone` | `#faeeef` | page background, every light band |
| `--blush` | `#f6e8e9` | contact band, tinted cards, image placeholders |
| `--shell` | `#f4e2e4` | row hover surfaces |
| `--rose` | `#c98b92` | scrollbar, marquee separators, focus detail |
| `--ink` / `--ink-deep` | `#1a1a1a` / `#111111` | type, dark bands |

Want a rosier or paler pink? Edit those four values — nothing else references a pink literal.

**Density.** Band padding is `--pad-y: clamp(44px, 5.2vw, 84px)` (was up to 128 px), the nav is
64 / 76 px tall, and the layout avoids half-empty columns:

- Philosophy is a 3-column metrics rail plus a single 9-column narrative whose first row carries
  the prose (7) and the amenity list (5) side by side, with the figure running full width beneath
- Gallery rows are 330 px (was 400 px) with 12 px gutters; residence rows use `py-6`
- The scroll-driven sections were shortened — Transform is 165/185 vh (was 220/260 vh) and the
  Reviews track is 210 vh (was 320 vh), so no section asks for a long scroll with nothing new
- Headline-to-copy rhythm sits at `mt-3`/`mt-4`/`mt-6`, and the sub-grid gutters at 20–28 px

A source-level audit runs in the test harness and fails if an oversized spacing utility
(`mt-16`, `gap-16`, `auto-rows-[4xx px]`, `h-[6xx px]`) creeps back in.

**Second density pass.** Nothing is allowed to leave a column half empty:

- Philosophy dropped its sticky 3-column rail (the empty pink it left beside the narrative) for
  three full-width rows, with the amenity list riding inside the figure frame as a translucent
  strip
- Reviews packs a facts strip under the card track, so the pinned viewport has no dead space;
  cards are `min(46vh, 400px)` tall and the section budget is down to 185 vh
- Transform is down to 150 / 165 vh with a `min(46vh, 420px)` frame
- Atelier's swatch column is `justify-between`, anchoring its note to the bottom of the canvas
- The hero is 82 vh; gallery rows are 320 px

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

## Testing

```bash
npm run test:smoke     # builds, then runs the jsdom regression harness
```

`tools/smoke/` renders `<App />` into jsdom against the **real built CSS** and asserts 80
properties that are easy to break and hard to notice: that no scroll-revealed element is left
transparent, that the consultation form and every field in it is visible, the pink palette
tokens compile to the right `rgb()` values, the Archivo typography contract, scroll-safety, and
layout density (band padding ceiling plus a source audit that fails on oversized spacing
utilities). Run it after touching a section — it has caught real bugs, including a stranded
`opacity: 0` form and an inverted shell-wipe clip path.

## Sections

| # | Section | Motion / 3D |
| --- | --- | --- |
| 1 | **Hero** — image at `object-bottom`/`opacity-70` over `#111` with gradient | intro timeline; SplitText line masks (`autoSplit`, re-splits after font swap); scrub parallax + copy lift |
| — | **Marquee** — services ticker | infinite GSAP tween whose `timeScale` follows scroll velocity |
| 2 | **Philosophy** — three full-width rows: headline beside the narrative · metrics strip · figure with the amenity list riding inside it | clip-path figure reveal, per-word opacity scrub, counting metrics, rules that draw in |
| 3 | **Residences** — sticky availability rail with L/R arrows | row entrances, hairline draw, image parallax; `grayscale-[20%]` → colour, `duration-1000` scale |
| 4 | **Atelier** — material board | **Three.js**: abstract A3 room lit through one aperture, floating material board, pointer lean, camera dolly on scroll, planes lift when the DOM swatch list is hovered |
| 5 | **Transform** — shell → finished | pinned sticky frame; a `--p` custom property GSAP scrubs 0 → 1 wipes the blueprint shell off the finished render |
| 6 | **Gallery** — 400 px mosaic (tall / wide / standard / standard) | tile un-clip on entry + per-tile parallax, grayscale → colour on hover |
| 7 | **Reviews** — 4.8 from 174, verbatim Google quotes | scroll-driven horizontal track on desktop, stacked list on mobile |
| 8 | **Contact** — stone-100, underlined fields | field stagger; submit composes a pre-filled WhatsApp message (no server, nothing stored) |
| 9 | **Footer** — stone-900, closing CTA |

## How reveals work

Entrances (`.gsap-ready [data-reveal] { opacity: 0 }` plus an animation) are driven by
**IntersectionObserver**, not ScrollTrigger. ScrollTrigger is kept for what it is genuinely good
at — scrubs, the pinned shell wipe, counters, the horizontal review track — but it re-renders a
tween's start state on every refresh, so an element that hides itself is at risk: a refresh after
a pinned section resized the document could put it back to invisible, and an unreachable trigger
start would leave it hidden for good. Observing intersection means an element that enters the
viewport is revealed once and nothing can undo it.

Three layers protect the copy:

1. `revealOnEnter` / `revealIn` (`src/lib/gsap.ts`) — IntersectionObserver reveals, with a direct
   jump to the end state when the API is missing or motion is reduced
2. a per-section safety net that fades in anything still transparent while sitting in the
   viewport (after a short grace period, so it never races the intended animation)
3. a hero-specific failsafe, so the intro timeline can never leave the headline hidden

The consultation form deliberately opts out: its fields are never a `from { opacity: 0 }` target,
so the form cannot be hidden by a mis-timed animation.

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
