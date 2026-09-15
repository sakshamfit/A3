/**
 * GSAP layer — ScrollTrigger + SplitText, registered once.
 *
 * Everything is created inside a `gsap.context()` scoped to the section
 * element, so unmounting a section reverts its inline styles and kills its
 * ScrollTriggers. Motion is skipped (final states applied instantly) when the
 * visitor prefers reduced motion.
 */
import { useEffect, useRef, type DependencyList } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export { gsap, ScrollTrigger, SplitText }

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

type SetupHelpers = {
  reduced: boolean
  /** gsap.matchMedia-safe breakpoint check. */
  isDesktop: boolean
}

export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: (scope: T, helpers: SetupHelpers) => void | (() => void),
  deps: DependencyList = [],
) {
  const scope = useRef<T | null>(null)

  useEffect(() => {
    const el = scope.current
    if (!el) return

    const ctx = gsap.context(
      () =>
        setup(el, {
          reduced: prefersReducedMotion(),
          isDesktop:
            typeof window.matchMedia === 'function'
              ? window.matchMedia('(min-width: 768px)').matches
              : true,
        }),
      el,
    )

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return scope
}

/**
 * Entrances are driven by IntersectionObserver rather than ScrollTrigger.
 *
 * ScrollTrigger is still used for everything it is good at — scrubs, pins,
 * counters — but it also re-renders a tween's start state on every refresh.
 * For an element that hides itself (opacity 0) that is a real hazard: a refresh
 * after a pinned section resized the document could put content back to
 * invisible, and if a trigger's start position is ever unreachable the element
 * would never appear at all. Observing intersection instead means an element
 * that enters the viewport is revealed exactly once, and nothing can undo it.
 */
export function revealOnEnter(
  elements: Iterable<HTMLElement>,
  play: (el: HTMLElement) => void,
  settle: (el: HTMLElement) => void,
  reduced: boolean,
) {
  const nodes = [...elements]
  if (!nodes.length) return () => {}

  /* No IntersectionObserver (or motion is unwanted): jump to the end state. */
  if (reduced || typeof IntersectionObserver === 'undefined') {
    nodes.forEach((el) => settle(el))
    return () => {}
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        observer.unobserve(entry.target)
        play(entry.target as HTMLElement)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  )

  nodes.forEach((el) => observer.observe(el))
  return () => observer.disconnect()
}

/** Standard entrance for every `[data-reveal]` inside a section. */
export function revealIn(
  scope: HTMLElement,
  reduced: boolean,
  options: { distance?: number; duration?: number } = {},
) {
  const nodes = [...scope.querySelectorAll<HTMLElement>('[data-reveal]')]
  const distance = options.distance ?? 24

  return revealOnEnter(
    nodes,
    (el) =>
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: options.duration ?? 0.9,
        ease: 'power3.out',
        overwrite: 'auto',
        delay: Number(el.dataset.revealDelay ?? 0),
      }),
    (el) => gsap.set(el, { opacity: 1, y: distance * 0, clearProps: 'transform' }),
    reduced,
  )
}

/**
 * Safety net for scroll-revealed content.
 *
 * Reveals are CSS-guarded (`opacity: 0` behind `.gsap-ready`) and handed to
 * ScrollTrigger. If a trigger's start position goes stale — for example when a
 * pinned section resizes the document after measurement — an element could be
 * left invisible for good. This watches for anything that is still transparent
 * while sitting inside the viewport and, after a short grace period (so it
 * never races the real animation), fades it in.
 */
export function installRevealSafetyNet() {
  if (prefersReducedMotion()) return

  const pending = new Map<HTMLElement, number>()
  let scheduled = false

  const pass = () => {
    scheduled = false
    const now = performance.now()
    const fold = window.innerHeight * 0.92

    document.querySelectorAll<HTMLElement>('[data-reveal], [data-field]').forEach((el) => {
      /* Leave the hero's copy to its intro timeline — but only while that
         timeline is plausibly running. After that it is fair game. */
      if (performance.now() < 2600 && el.closest('#top')) {
        pending.delete(el)
        return
      }
      const hidden = Number(window.getComputedStyle(el).opacity) < 0.05
      const rect = el.getBoundingClientRect()
      const onScreen = rect.top < fold && rect.bottom > -240

      if (!hidden || !onScreen) {
        pending.delete(el)
        return
      }

      const since = pending.get(el) ?? now
      pending.set(el, since)
      if (now - since > 500) {
        pending.delete(el)
        gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
      }
    })
  }

  const schedule = () => {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(pass)
  }

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  window.addEventListener('load', schedule)
  ScrollTrigger.addEventListener('refresh', schedule)
  /* Two quick passes so anything stranded on first paint is rescued within a
     second or so, rather than waiting for the user to scroll. */
  const timers = [500, 900, 1500, 2600, 3400, 4200].map((delay) => window.setTimeout(schedule, delay))

  return () => {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    window.removeEventListener('load', schedule)
    ScrollTrigger.removeEventListener('refresh', schedule)
    timers.forEach((timer) => window.clearTimeout(timer))
  }
}

/** ScrollTrigger measures before web fonts and images settle — refresh after. */
export function installScrollTriggerRefresh() {
  const refresh = () => ScrollTrigger.refresh()

  const onLoad = () => refresh()
  window.addEventListener('load', onLoad)

  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
  if (fonts?.ready) void fonts.ready.then(refresh)

  const t = window.setTimeout(refresh, 800)
  return () => {
    window.clearTimeout(t)
    window.removeEventListener('load', onLoad)
  }
}
