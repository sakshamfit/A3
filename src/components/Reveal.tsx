import type { ReactNode } from 'react'
import { useInView } from '../lib/useInView'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Stagger in ms. */
  delay?: number
  /** Entrance distance in px (use 0 for a pure fade). */
  distance?: number
  /** Source-specified durations. */
  duration?: 500 | 700 | 1000
}

/**
 * Fade + lift entrance. Native IntersectionObserver only — no smooth-scroll
 * library is used anywhere on this site.
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  distance = 24,
  duration = 700,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`transition-all ease-smooth ${
        duration === 500
          ? 'duration-500'
          : duration === 1000
            ? 'duration-1000'
            : 'duration-700'
      } ${inView ? 'translate-y-0 opacity-100' : 'opacity-0'} ${className}`}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
        transform: inView ? undefined : `translateY(${distance}px)`,
      }}
    >
      {children}
    </div>
  )
}
