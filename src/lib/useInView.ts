import { useEffect, useRef, useState } from 'react'

type UseInViewOptions = {
  /** Keep watching and toggle back off when the element leaves the viewport. */
  once?: boolean
  rootMargin?: string
  threshold?: number
}

/**
 * Tiny IntersectionObserver helper for the entrance reveals.
 * Falls back to "always in view" when IntersectionObserver is unavailable.
 */
export function useInView<T extends HTMLElement>({
  once = true,
  rootMargin = '0px 0px -10% 0px',
  threshold = 0.15,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setInView(false)
          }
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once, rootMargin, threshold])

  return { ref, inView }
}
