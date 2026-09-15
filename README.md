# A3 Interior Designer &amp; Builder — website

Marketing site for **A3 Interior Designer & Builder**, an interior design and build studio at
Azeet Plaza, Commercial Road, Taramandal, Gorakhpur, Uttar Pradesh 273001
(4.8 ★ · 174 Google reviews · open until 10 pm).

The design language is the *AETHER — Residential Architecture* reference build: bone
`#FDFBF9` page, near-black `#111` / `#1a1a1a` bands, Inter Tight headings with serif italic
accents, grayscale-to-colour imagery and a blend-mode navigation.

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
| Styling | Tailwind CSS 3 (PostCSS build, no CDN) |
| Type | Google Fonts — Inter Tight 300/400/500/600 + Instrument Serif (italic accents) |
| Icons | `iconify-icon` web component, Solar set bundled offline via `@iconify-icons/solar` (`src/lib/icons.ts`) |

## Sections (`src/sections`)

1. **Hero** — full-bleed image at `object-bottom` / `opacity-70` over `#111`, gradient overlay,
   serif-italic word *sculpted*, hairline footer rail.
2. **Philosophy** — 12-column grid: sticky metrics rail (3) · spacer (2) · narrative (7),
   `cursor-none` figure with a backdrop-blurred caption, amenity row and the Google reviews.
3. **Residences** — sticky "Current availability" rail with working L/R arrows over a list of
   project rows (`hover:bg-[#F9F9F7]`, 1000 ms image scale, `grayscale-[20%]` → colour).
4. **Highlights** — `#1a1a1a` band, three columns, hairline `white/10` borders.
5. **Gallery** — centred `Visuals / The Atmosphere` heading over a 400 px row mosaic
   (tall, wide, standard, standard).
6. **Contact** — `stone-100`, underlined form fields, custom select with an absolute icon; the
   form composes a pre-filled WhatsApp message to the studio (nothing is stored).

Navigation, footer and CTA links are real: `tel:+919451546780`, `wa.me/919451546780`, Google
Maps directions and the studio's Google review page.

## Scrolling

The previous build rendered a single full-height hero, so there was nothing to scroll and the
`overflow-hidden` hero clipped its own content on short viewports. The site is now a plain,
naturally scrolling document:

- no height clamp or `overflow` lock on `html`/`body`, and **no smooth-scroll library** —
  native `scroll-smooth` on `<html>` plus `scroll-behavior: smooth` in `src/index.css`;
- `overflow-x: clip` (not `hidden`) on `html, body` suppresses stray horizontal overflow
  *without* turning them into scroll containers;
- sections use `min-h-[95vh]` rather than `h-screen`, so tall content grows instead of clipping;
- the only vertical lock is the deliberate one applied while the full-screen menu is open, and
  it is released on close.

## Editing content

All business copy, projects, gallery captions, metrics and review quotes live in
`src/lib/site.ts`.
