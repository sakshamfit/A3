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
