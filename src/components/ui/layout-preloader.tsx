"use client"

/**
 * LayoutPreloader — a film-grain layout plate for A3.
 *
 * Two variants off one component, because both jobs are the same job (hold a
 * frame open while something loads, then let the room through):
 *
 *   · `overlay` — the full-viewport curtain on first paint. A dark plate, the
 *     wordmark, a 000→100 counter and a hairline that fills as it counts; it
 *     lifts away in one curtain (content fades, plate slides up).
 *   · `inline` — the same plate used *in* the page: the photograph sits inside
 *     it under live grain, and the grain burns off on hover. This is what the
 *     home-page figure under the rating strip uses.
 *
 * Dependencies, in the order the integrator will look for them:
 *   · `cn()` from `@/lib/utils` — shadcn's class merger (`clsx` + `tailwind-merge`)
 *   · `framer-motion` — already a dependency of this project, used for the curtain
 *   · `tailwindcss` v3 — colours are the project's own tokens (`bg-inkdeep`,
 *     `text-chalk`, `bone`), *not* the shadcn CSS variables, because
 *     `components.json` sets `cssVariables: false`
 *   · zero new packages, zero new image assets — the grain is an inline SVG
 *     turbulence tile, and `noise-animation` (see `src/index.css`) jitters it
 *
 * Accessibility: the curtain is a `role="progressbar"` the count writes into
 * (`aria-valuenow`, never a live region — a polite live region re-announces
 * sixty times a second), the backdrop photograph is `alt=""` because the hero
 * already describes it, scroll is locked for exactly as long as the curtain
 * covers the page, and every animation is dropped under `prefers-reduced-motion`
 * (the count jumps to 100 and the exit is instant).
 */

import { useEffect, useState, type CSSProperties, type ComponentProps } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useInView } from '@/lib/useInView'

/**
 * Grain tile. `feTurbulence` needs no asset and no network request; the layer
 * is oversized (`inset: -50%` in `.grain-veil`) so the ±4% travel from
 * `noise-animation` never exposes an edge.
 */
const NOISE_TILE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch' result='n'/%3E%3CfeColorMatrix in='n' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23a)' opacity='0.6'/%3E%3C/svg%3E\")"

/** Same exit curve the rest of the site uses (`--ease-smooth`). */
const CURTAIN_EASE = [0.16, 1, 0.3, 1] as const

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** 0→100 over `duration`, eased out — real progress, not a fake spinner. */
function useProgress(active: boolean, duration: number) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    if (prefersReduced()) {
      setValue(100)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / Math.max(1, duration))
      setValue(Math.round(100 * (1 - (1 - t) ** 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, duration])

  return value
}

export type LayoutPreloaderProps = {
  /** `overlay` — the plate on its own (used by the curtain); `inline` — in-page. */
  variant?: 'overlay' | 'inline'
  /** Optional photograph held inside the plate (inline variant on the home page). */
  image?: string
  /** Merged onto the `<img>`: pass `alt`, `className`, or a data hook for GSAP. */
  imageProps?: ComponentProps<'img'>
  label?: string
  sublabel?: string
  /** ms the counter takes to reach 100. */
  duration?: number
  /**
   * What the count is keyed to. The overlay is driven by the app shell
   * (`show`); an inline plate ignores it and counts when it scrolls into view,
   * because a number that finished while you were still reading the headline
   * above it is a number nobody saw.
   */
  show?: boolean
  /**
   * Inline only — drop the plate's own words (sublabel, headline, counter) and
   * leave the grain, the sweep and a top-edge hairline that fills with the
   * count. For hosts that already overlay their own caption, like the home-page
   * figure, where two sets of type in one frame is one set too many.
   */
  minimal?: boolean
  className?: string
}

/**
 * Shared layers: grain, scanlines, travelling sweep, viewfinder corners.
 * No props — how much grain is showing is a single number on the plate
 * (`--grain`), so the layers stay dumb and the host keeps control.
 */
function GrainLayers() {
  return (
    <>
      <div className="grain-veil" style={{ backgroundImage: NOISE_TILE }} aria-hidden="true" />
      <div className="grain-scanlines" aria-hidden="true" />
      <div className="grain-sweep" aria-hidden="true" />
      {[
        'left-3 top-3 border-l border-t',
        'right-3 top-3 border-r border-t',
        'bottom-3 left-3 border-b border-l',
        'bottom-3 right-3 border-b border-r',
      ].map((corner) => (
        <span
          key={corner}
          className={cn('pointer-events-none absolute h-4 w-4 border-chalk/25', corner)}
          aria-hidden="true"
        />
      ))}
    </>
  )
}

export function LayoutPreloader({
  variant = 'overlay',
  image,
  imageProps,
  label = 'A3 Interior Designer & Builder',
  sublabel = 'Loading the studio',
  duration = 1550,
  show = true,
  minimal = false,
  className,
}: LayoutPreloaderProps) {
  const inline = variant === 'inline'
  const { ref: plateRef, inView } = useInView<HTMLDivElement>({ threshold: 0.2 })
  const progress = useProgress(inline ? inView : show, duration)
  const done = progress >= 100

  return (
    <div
      ref={plateRef}
      className={cn(
        'grain-plate relative isolate overflow-hidden bg-inkdeep text-chalk',
        inline ? 'h-full w-full' : 'flex h-full w-full items-center justify-center',
        className,
      )}
      /* The one place `--grain` is set. It sits on the plate (not on the veil)
         so `.grain-plate:hover .grain-veil` can still win — an inline value on
         the element the rule targets would beat the stylesheet outright. */
      style={
        {
          '--grain': inline ? (0.9 - progress / 160).toFixed(3) : '0.55',
        } as CSSProperties
      }
      {...(inline
        ? {}
        : {
            role: 'progressbar',
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-valuenow': progress,
            'aria-valuetext': `${progress}% — ${sublabel}`,
            'aria-label': label,
          })}
    >
      {image && (
        <>
          <img
            {...imageProps}
            src={image}
            alt={imageProps?.alt ?? ''}
            loading={inline ? 'lazy' : 'eager'}
            decoding="async"
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-all duration-700',
              inline
                ? 'opacity-95 saturate-[0.85]'
                : 'opacity-20 grayscale contrast-[1.15]',
              imageProps?.className,
            )}
          />
          {/* legibility wash — keeps white type readable over a bright room */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-inkdeep via-inkdeep/45 to-inkdeep/70"
            aria-hidden="true"
          />
        </>
      )}

      <GrainLayers />

      {/* Inline chrome: either the full caption row, or nothing but the
          hairline — hosts that overlay their own copy use `minimal`. */}
      {inline &&
        (minimal ? (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-chalk/10">
            <div
              className="h-px origin-left bg-chalk/70"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
        ) : (
          <div className="relative z-10 flex h-full w-full flex-col justify-between p-6 sm:p-8">
            <span className="lbl w-fit border border-chalk/20 bg-inkdeep/45 px-3 py-1.5 text-chalk/70 backdrop-blur-sm">
              {sublabel}
            </span>
            <div className="flex items-end justify-between gap-4">
              <p className="subhead max-w-[24ch] text-chalk/90">{label}</p>
              <p className="num text-[clamp(22px,3vw,34px)] font-extrabold leading-none tracking-display text-chalk/80">
                {String(progress).padStart(3, '0')}
                <span className="lbl ml-1 text-chalk/40">%</span>
              </p>
            </div>
            <div className="h-px w-full bg-chalk/10">
              <div
                className="h-px origin-left bg-chalk/70"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            </div>
          </div>
        ))}

      {!inline && (
        <div className="relative z-10 w-full max-w-[520px] px-8 text-center">
          <p className="lbl text-chalk/45">{label}</p>
          <p className="display mt-4 text-bone" style={{ fontSize: 'clamp(56px,11vw,124px)' }}>
            A3
          </p>
          <p className="lbl mt-3 text-chalk/55">{done ? 'Ready · Gorakhpur' : sublabel}</p>
          <div className="mx-auto mt-7 h-px w-full max-w-[300px] bg-chalk/10">
            <div
              className="h-px origin-left bg-chalk/75"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
          <p className="num mt-3 text-[11px] tracking-[0.2em] text-chalk/40">
            {String(progress).padStart(3, '0')} / 100
          </p>
        </div>
      )}
    </div>
  )
}

export type LayoutPreloaderOverlayProps = {
  /** Controlled by the app shell: `false` starts the curtain exit. */
  show: boolean
  /** Keep this equal to the shell's own timer so the count lands on 100. */
  duration?: number
  label?: string
  sublabel?: string
  /** A room photograph held behind the grain, if the brand wants one. */
  image?: string
  /** Fires once the curtain has fully left the viewport. */
  onComplete?: () => void
}

/**
 * Full-viewport curtain for the first paint. Mounted while `show`, kept alive
 * through the exit so framer-motion can play it, and unmounted on completion —
 * which is also when `onComplete` reports back.
 */
export function LayoutPreloaderOverlay({
  show,
  duration = 1550,
  label,
  sublabel,
  image,
  onComplete,
}: LayoutPreloaderOverlayProps) {
  const [mounted, setMounted] = useState(show)
  const reduced = prefersReduced()

  useEffect(() => {
    if (show) setMounted(true)
  }, [show])

  /* The curtain covers the page, so the page must not scroll behind it. */
  useEffect(() => {
    if (!show) return
    const body = document.body
    const previous = body.style.overflow
    body.style.overflow = 'hidden'
    return () => {
      body.style.overflow = previous
    }
  }, [show])

  return (
    <AnimatePresence
      onExitComplete={() => {
        setMounted(false)
        onComplete?.()
      }}
    >
      {show && mounted && (
        <motion.div
          className={cn('fixed inset-0 z-[100] overflow-hidden', !show && 'pointer-events-none')}
          aria-busy={show}
          exit={{ y: '-100%' }}
          transition={{ duration: reduced ? 0 : 0.85, ease: CURTAIN_EASE }}
        >
          <motion.div
            className="h-full w-full"
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: reduced ? 0 : 0.28, ease: 'easeOut' }}
          >
            <LayoutPreloader
              variant="overlay"
              show
              duration={duration}
              label={label}
              sublabel={sublabel}
              image={image}
              imageProps={{ alt: '' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LayoutPreloader
