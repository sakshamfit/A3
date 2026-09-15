"use client"

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface ScrollExpandMediaProps {
  /** Source of the media being expanded. Defaults to an image. */
  mediaType?: 'video' | 'image'
  mediaSrc: string
  /** Poster frame, used when mediaType is "video". */
  posterSrc?: string
  /** Full-bleed backdrop shown behind the media until it expands. */
  bgImageSrc: string
  title?: string
  date?: string
  scrollToExpand?: string
  /** Blend the title against whatever is behind it. */
  textBlend?: boolean
  /** Scroll distance the expansion plays over, in viewport heights. */
  scrollLength?: number
  /** Content revealed once the media is expanded. */
  children?: ReactNode
  className?: string
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/**
 * Scroll-expansion media panel.
 *
 * As the panel's own scroll position advances, the media grows from a small
 * centred card to (almost) fill the viewport, the backdrop fades away, the two
 * halves of the title slide apart and the children fade in. Values mirror the
 * reference component: 300 × 400 → +1250 × +400 on desktop (+650 / +200 on
 * phones), title travel 150vw (180vw on phones), overlay 0.7 → 0.4, content
 * from ~75% progress.
 *
 * Three deliberate deviations from the reference, all documented in the README:
 *
 * 1. Progress is read from the panel's own `getBoundingClientRect()` instead of
 *    the reference's global `wheel` / `touchmove` handlers. The reference
 *    `preventDefault()`s every wheel event and calls `window.scrollTo(0, 0)`
 *    while unexpanded, which only works when it owns the entire page — dropped
 *    mid-page it freezes the document. Here the page always scrolls normally.
 * 2. `next/image` is replaced with a plain `<img>`; this is a Vite SPA, not
 *    Next.js, so there is no image optimiser to call.
 * 3. Progress drives framer-motion `MotionValue`s rather than React state, so a
 *    scroll frame never triggers a re-render.
 */
const ScrollExpandMedia = ({
  mediaType = 'image',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  scrollLength = 130,
  children,
  className,
}: ScrollExpandMediaProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const mobileRef = useRef(false)

  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const progress = useMotionValue(0)
  const smooth = useSpring(progress, { stiffness: 280, damping: 42, mass: 0.35 })

  const mediaWidth = useTransform(smooth, (v) => 300 + v * (mobileRef.current ? 650 : 1250))
  const mediaHeight = useTransform(smooth, (v) => 400 + v * (mobileRef.current ? 200 : 400))
  const textTranslateX = useTransform(smooth, (v) => v * (mobileRef.current ? 180 : 150))
  const leftTextX = useTransform(textTranslateX, (v) => `-${v}vw`)
  const rightTextX = useTransform(textTranslateX, (v) => `${v}vw`)
  const bgOpacity = useTransform(smooth, (v) => 1 - v)
  const scrimOpacity = useTransform(smooth, (v) => 0.7 - v * 0.3)
  const contentOpacity = useTransform(smooth, [0.7, 0.92], [0, 1])
  const contentY = useTransform(smooth, [0.7, 0.92], [26, 0])
  const hintOpacity = useTransform(smooth, [0, 0.4], [1, 0])

  /* Progress from this panel's own scroll position. */
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    if (reduced) {
      progress.set(1)
      return
    }

    let frame = 0
    let visible = true

    const measure = () => {
      frame = 0
      if (!visible) return
      const travel = el.offsetHeight - window.innerHeight
      const passed = -el.getBoundingClientRect().top
      progress.set(travel > 0 ? clamp01(passed / travel) : 1)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    const checkMobile = () => {
      mobileRef.current = window.innerWidth < 768
    }

    checkMobile()
    measure()

    /* Only measure while the panel is anywhere near the viewport. */
    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) visible = entry.isIntersecting
              schedule()
            },
            { rootMargin: '25% 0px' },
          )
        : null
    observer?.observe(el)

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', () => {
      checkMobile()
      schedule()
    })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener('scroll', schedule)
    }
  }, [progress, reduced])

  const firstWord = title ? title.split(' ')[0] : ''
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : ''

  return (
    <div
      ref={wrapperRef}
      data-expand-panel
      className={cn('relative', className)}
      style={reduced ? undefined : { height: `${scrollLength}vh` }}
    >
      <article
        aria-label={title}
        className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden"
      >
        {/* Backdrop */}
        <motion.div className="absolute inset-0 z-0" style={{ opacity: bgOpacity }}>
          <img
            src={bgImageSrc}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>

        {/* Media */}
        <motion.div
          className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: mediaWidth,
            height: mediaHeight,
            maxWidth: '95vw',
            maxHeight: '85vh',
            boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div data-expand-frame className="relative h-full w-full overflow-hidden rounded-2xl">
            {mediaType === 'video' ? (
              <video
                src={mediaSrc}
                poster={posterSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="h-full w-full object-cover"
                controls={false}
                disablePictureInPicture
                disableRemotePlayback
              />
            ) : (
              <img
                data-expand-media
                src={mediaSrc}
                alt={title || 'Media content'}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
            <motion.div
              className="absolute inset-0 bg-black/30"
              style={{ opacity: scrimOpacity }}
            />
          </div>

          {/* Meta beside the card — travels out with the expansion */}
          <div className="pointer-events-none absolute inset-x-0 top-full mt-3 flex items-center justify-between gap-4">
            {date && (
              <motion.p
                className="lbl text-white/80"
                style={{ x: reduced ? 0 : leftTextX }}
              >
                {date}
              </motion.p>
            )}
            {scrollToExpand && (
              <motion.p
                className="lbl flex items-center gap-2 text-white/80"
                style={{ x: reduced ? 0 : rightTextX, opacity: reduced ? 0 : hintOpacity }}
              >
                {scrollToExpand}
                <iconify-icon icon="solar:alt-arrow-down-linear" width="14" height="14" />
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Title — split so the halves can travel apart */}
        <div
          className={cn(
            'relative z-10 flex w-full flex-col items-center justify-center gap-1 px-6 text-center',
            textBlend ? 'mix-blend-difference' : 'mix-blend-normal',
          )}
        >
          <motion.h2
            className="display max-w-full text-white"
            style={{ x: reduced ? 0 : leftTextX }}
          >
            {firstWord}
          </motion.h2>
          <motion.h2
            className="display max-w-full text-white"
            style={{ x: reduced ? 0 : rightTextX }}
          >
            {restOfTitle}
          </motion.h2>
        </div>

        {/* Children — revealed once expanded */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-20"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          {children}
        </motion.div>
      </article>
    </div>
  )
}

export default ScrollExpandMedia
