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
| Motion (page) | GSAP 3.15 — ScrollTrigger + SplitText (bundled, no CDN) |
| Motion (components) | framer-motion motion values — the residence expansion panels, lazy chunk |
| 3D | Three.js 0.186, `WebGLRenderer` — lazy chunk, no `@react-three/*` wrapper, drop-in `.glb`/`.hdr` path |
| Structure | shadcn conventions — `components.json`, `@/components/ui`, `cn()` — on Vite, so **no `next`** |
| Icons | `iconify-icon` web component, Solar set registered offline from `@iconify-icons/solar` |
| First paint | `src/components/ui/layout-preloader.tsx` — film-grain curtain; the grain is an inline `feTurbulence` tile animated by `noise-animation`, so no loader package and no asset |
| Imagery | 11 generated interiors, committed as WebP/JPG (~1.4 MB total) |

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

`tools/smoke/` renders `<App />` into jsdom against the **real built CSS** and asserts 114
properties that are easy to break and hard to notice: that no scroll-revealed element is left
transparent, that the consultation form and every field in it is visible, the pink palette
tokens compile to the right `rgb()` values, the Archivo typography contract, scroll-safety, and
layout density (band padding ceiling plus a source audit that fails on oversized spacing
utilities), that the four residence expansion panels exist, pair a media image with a
backdrop, stay lazy and never hijack the wheel, and that the Atelier board keeps discovering a
dropped-in `.glb` without pulling the three loaders onto the critical path. Run it after touching a section — it has caught real bugs, including a stranded
`opacity: 0` form and an inverted shell-wipe clip path.

## Sections

| # | Section | Motion / 3D |
| --- | --- | --- |
| 1 | **Hero** — image at `object-bottom`/`opacity-70` over `#111` with gradient | intro timeline; SplitText line masks (`autoSplit`, re-splits after font swap); scrub parallax + copy lift |
| — | **Marquee** — services ticker | infinite GSAP tween whose `timeScale` follows scroll velocity |
| 2 | **Philosophy** — three full-width rows: headline beside the narrative · metrics strip · figure with the amenity list riding inside it | the detail shot is an inline `LayoutPreloader` plate (live grain + count hairline, clears on hover); clip-path figure reveal, per-word opacity scrub, counting metrics, rules that draw in |
| 3 | **Residences** — sticky availability rail with L/R arrows | row entrances, hairline draw, image parallax; `grayscale-[20%]` → colour, `duration-1000` scale |
| 4 | **Atelier** — material board: the room plate, one dot per finish, no text laid over the photograph | **Three.js**: abstract A3 room lit through one aperture, floating material board, pointer lean, camera dolly on scroll, planes lift when the DOM swatch list is hovered |
| 5 | **Transform** — the pinned wipe | a `--p` custom property GSAP scrubs 0 → 1, opening the `clip-path` on a real under-construction plate to reveal the finished kitchen underneath; the four steps light up as the seam passes them |
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
bundle stays at ~123 kB gzip and Three.js (~155 kB gzip) loads on demand. The whole room is
swappable for a real `.glb` asset — see *Material board — real assets* above.

## First paint — the film-grain curtain

`src/components/ui/layout-preloader.tsx` owns the load sequence and the home-page detail plate,
from one component with two variants:

- **`overlay`** — `<LayoutPreloaderOverlay show={loading}>` in `App.tsx`: a dark plate, the A3
  wordmark, a `000 → 100` count and a hairline that fills with it. The count and the shell's
  `INTRO_MS` are the same number, so the curtain lifts exactly when it reaches 100; the exit is
  one curtain (`AnimatePresence` slide), scroll is locked only while it covers the page, and
  `prefers-reduced-motion` skips straight to the finished state.
- **`inline`** — the Philosophy figure on Home: the same plate holding a real photograph, with
  `minimal` so it says nothing and only draws the count hairline (the figure already carries its
  own caption and the amenity strip). Grain thins as the count finishes and burns off further on
  hover, so the photo — not the effect — is what you end up looking at.

What the upstream snippet needed before it would run here:

- **Tailwind 3, not 4.** The pasted block starts with `@import "tailwindcss"` +
  `@import "tw-animate-css"`; this project is Tailwind **3.4** driven by `@tailwind` directives in
  `src/index.css`, and pasting those imports would install a second preflight and re-scale every
  spacing and colour utility in the app. So the `noise-animation` keyframes went into
  `src/index.css` verbatim (next to the `.grain-veil` / `.grain-scanlines` / `.grain-sweep` layers
  that share them), and only the *names* were registered in `tailwind.config.js`
  (`animate-noise`, `animate-noise-sweep`) — a `keyframes` block there would emit a duplicate
  `@keyframes`. The Tailwind 4 form is `@theme { --animate-noise: … }`.
- **`/components/ui` is the right folder, and it is not `components/ui`.** `components.json`
  aliases `@/components/ui` → `src/components/ui/`; writing to `components/ui` at the repo root
  would put the file outside the Vite root (`src`), outside `tsconfig.json`'s `include`, and out of
  reach of `cn()` — the file would silently never be imported by anything.
- **`demo.tsx`** — the snippet's `import App from '../app'` is a Next.js-ism. Here the tree is
  `src/App.tsx`, mounted by `src/main.tsx`, and `tsconfig.json` runs `strict` + `noUnusedLocals`,
  so a demo that does not type-check fails `npm run build`, not just the demo. It imports
  `../../App` instead.
- **No new packages.** Dependencies are `framer-motion`, `cn()` from `@/lib/utils`, lucide-free
  (the plate has no icons) and — deliberately — **no Unsplash URLs**: every other pixel on this
  site is a committed file in `public/images`, so a remote stock photo would be the one request
  that can 404, be blocked, or shift the layout. `components.json` sets `cssVariables: false`, so
  the plate uses the project's own tokens (`bg-inkdeep`, `text-chalk`, `bone`) rather than the
  shadcn CSS variables its examples expect.

## Material board — dots, not captions

`RoomScene` shows the room as a photograph with **one dot per finish and no text over it** — the
copy lives in the list beside the frame, where it can be read. Two things make the dots honest:

- **`hotspot` is authored in image space**, as a percentage of
  `public/images/material-board-room.jpg` (1376×768) — so `x: 6` means "the fluted smoked-oak
  return at the left edge", which is checkable against the file itself.
- **The viewer maps it through the frame** with `usePlateBox`, which measures the container and
  resolves the `object-contain` fit, so a dot cannot drift off its surface as the card resizes.
  `contain`, not `cover`: a cropped frame silently deletes whichever finish sits nearest the edge
  (that is how a pin at `x: 88` ended up in the crop's discard, pointing at a shadow and not at
  the black-stone sideboard at `x: 69`).

Each finish keeps a `macroImage`, the 1:1 close shot the dot zooms into; Smoked Oak's fluted
panel and Black Stone's leathered monolith must never share a coordinate — the smoke test fails
if two finishes collide or if either moves onto the other's surface.

**Nothing floats over the picture.** Two things were removed for good, both by demand rather than
taste:

- the **spotlight disc** (`h-64 w-64` radial gradient) that drifted across the room as the cursor
  moved — with a parallax tilt already on the plate it read as a torch sweep over the photograph,
  so the active finish is now marked by its own dot and by the list highlight, nothing else;
- the **close-shot chrome** — a status badge, an `01–04` numeric switcher, a bordered spec card of
  two paragraphs and a mini locator map with its own caption, all stacked on the texture. The zoom
  now says one line (`Smoked Oak · Fluted`, with the swatch as its bullet), moves between finishes
  with four dots and two chevrons, and exits through a single icon button (`Esc` too).

That spec copy is not gone — `specs` and `application` moved into `[data-material-detail]` at the
foot of the finish list, where they swap with whatever is active. The harness fails the build if a
`h-64 w-64` disc returns to the room view or if `RoomScene` renders `currentMaterial.specs` again.

## The pinned wipe — two photographs, one room

`src/sections/Transform.tsx` (on `/process`) used to fake "before" by pushing the finished render
through a `.blueprint` colour filter — a tinted duplicate, not a different moment. It is two
photographs now:

| Layer | File | State |
| --- | --- | --- |
| underneath | `/images/res-obsidian.webp` | the finished Obsidian Loft kitchen |
| wiped away by `--p` | `/images/res-obsidian-shell.jpg` | the same room as a bare shell — cement plaster, conduit runs with no fittings, brass pipe tails, drop sheets, a board-formed concrete island plinth with the sink void cast into it |

**Why the plate is worth its bytes:** a wipe only reads as *time passing* if the geometry
registers. The shell was generated **from** the finished frame (image-to-image, "same camera, same
framing, unfinished") so the ceiling line, the window mullions, the plant on the sill and the
counter/plinth run all land where the finished room puts them, and both are 1376×768 — identical
`object-cover` crop on both sides, so the seam never slides one plate relative to the other. Two
earlier takes were rejected this way: one framed the room wider (doubled mullions and ceiling line
across the seam), one matched the island but pitched the camera down (the ceiling vanished). The
check is cheap and unambiguous — `convert a.png b.png -evaluate-sequence mean` and look for
doubled straight lines.

The section deliberately has **no headline of its own**: `src/pages/Process.tsx` already titles the
page *Shell to finished*, and the section repeating it put the same six words on screen twice in one
viewport. It carries one micro row instead — the room and gap ("Obsidian Loft · Taramandal — kitchen,
14 weeks apart") plus a `Wiped 000%` meter driven off the same timeline as the wipe, so the number
can never disagree with what the frame is doing.

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

## Residence expansion panels

The four projects in `#projects` use the scroll-expansion treatment: a small centred card on a
full-bleed backdrop that grows to fill the viewport as it scrolls past, the two title halves
travelling apart and the detail bar fading in over the expanded media.

- `src/components/ui/scroll-expansion-hero.tsx` — the component, on the shadcn path
  (`@/components/ui`), using `cn()` from `@/lib/utils` and framer-motion motion values.
- Progress comes from the panel's **own** `getBoundingClientRect()`. The reference
  implementation drives it from global `wheel`/`touchmove` handlers that call `preventDefault()`
  and `window.scrollTo(0, 0)`; that only works while the component owns the page, and
  mid-document it freezes the scroll. The page always scrolls natively here.
- Each panel is an `<article aria-label>` (not `<section>`, which would inflate the page's
  landmark count) with a 160vh scroll budget, and the sticky *Current availability* rail tracks
  which one is active.
- `React.lazy` + `Suspense` keep framer-motion (163 kB / 53 kB gzip) in its own chunk — the main
  bundle stays at 355 kB / 123 kB gzip.
- Reduced motion skips the expansion and renders the expanded state directly.

## Component structure (shadcn)

The project keeps shadcn's layout conventions without adopting the CLI, and it stays a plain
Vite SPA — so `next` is deliberately *not* a dependency and components use `<img>` where the
upstream examples use `next/image`:

- `components.json` — style `new-york`, `rsc: false`, tailwind config `tailwind.config.js`,
  css `src/index.css`, base colour `stone`, aliases for `components`, `ui`, `lib`, `utils`,
  `hooks`, icon library `lucide`.
- `@/*` → `./src/*` in **both** `vite.config.ts` (so the dev server resolves it) and
  `tsconfig.json` (so TypeScript does). Changing one without the other breaks silently.
- `src/components/ui/` is the default component path; `src/lib/utils.ts` exports `cn()`
  (`clsx` + `tailwind-merge`).
- Icons rendered on the page stay `iconify-icon` (Solar) — the project rule — while `lucide` is
  declared because shadcn components expect it.

## Material board — real assets

The Atelier board ("One language, four finishes") is
`src/components/three/RoomScene.tsx`. It ships as a procedural room so the page has something
to show with no asset pipeline — and it upgrades to a real model by **dropping a file in**,
with no code change:

| Drop this | Where | Effect |
| --- | --- | --- |
| `room.glb` — Blender ▸ File ▸ Export ▸ glTF 2.0, format *glTF Binary*, *Apply Modifiers*, textures embedded | `src/components/three/models/` | replaces the procedural room; auto-fitted to 7 world units wide and dropped onto the floor |
| `studio.hdr` — Poly Haven, CC0, 1k or 2k is plenty | `src/components/three/models/` | equirect HDRI becomes the scene environment — the single biggest realism lever for PBR materials |

Both are discovered at build time with `import.meta.glob`, which means:

- an empty folder costs nothing — the three loaders (GLTFLoader, DRACOLoader, KTX2Loader,
  RGBELoader) are dynamic imports in their own chunks, requested only once a file is detected;
- Draco geometry and KTX2 textures work with **no extra setup** — `three` carries its own
  decoder copies and Vite emits them next to the lazy loader chunks;
- a missing, unreadable or malformed file never breaks the page: the loader resolves `null`, the
  procedural room stays, and the overlay reads `WebGL` instead of `Live model`.

Knobs live in `src/components/three/room-model.ts`:

- `fitRoomModel(scene, { width: 7, ground: 0, z: -0.6 })` — world width, floor height, depth;
- `KEEP_MATERIAL_BOARD` — set `false` if the model brings its own floating finish board, so the
  primitive board steps aside;
- animated exports play automatically (first clip wins); the HDRI becomes `scene.environment`
  while the room's own lights keep working.

Wiring the path costs 530 kB → 606 kB raw (134 kB → 155 kB gzip) *in the lazy RoomScene chunk*;
the main bundle is untouched. `src/components/three/models/README.md` repeats the drop-in table
for whoever opens that folder first.

## Content

All business copy, projects, materials, process steps, gallery captions, metrics and review
quotes live in `src/lib/site.ts`.
