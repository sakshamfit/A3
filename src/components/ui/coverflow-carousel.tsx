"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export type CoverflowSlide = {
  src: string
  alt: string
  title: string
  subtitle?: string
  description?: string
  meta?: { label: string; value: string }[]
  href?: string
  // optional project details for residences
  location?: string
  area?: string
  config?: string
  price?: string
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[]
  showCaption?: boolean
  className?: string
  loop?: boolean
}

/**
 * CoverflowCarousel — Ruixen UI inspired
 *
 * A rack of square covers with perspective reversed.
 * Centre card sits square to the viewer while ones beside it swing
 * their outer edges forward, so the rack opens toward you.
 * Drag horizontally or use arrows; caption follows the active slide.
 *
 * Tweaked for A3: bone/ink palette, Archivo display, lbl micro-type,
 * and the same rounded-2xl + shadow language as the scroll-expansion hero.
 */
export function CoverflowCarousel({
  slides,
  showCaption = true,
  className,
  loop = true,
}: CoverflowCarouselProps) {
  const [active, setActive] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)

  const go = useCallback(
    (dir: 1 | -1) => {
      setActive((prev) => {
        if (loop) return (prev + dir + slides.length) % slides.length
        return Math.max(0, Math.min(slides.length - 1, prev + dir))
      })
    },
    [slides.length, loop]
  )

  const goTo = useCallback(
    (i: number) => setActive(((i % slides.length) + slides.length) % slides.length),
    [slides.length]
  )

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1)
      if (e.key === "ArrowRight") go(1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go])

  // for autoplay pause on hover we could add, but keep manual
  const current = slides[active]

  return (
    <div className={cn("w-full select-none overflow-clip", className)}>
      {/* viewport */}
      <div className="relative mx-auto w-full max-w-[1100px] overflow-visible">
        {/* perspective stage - handle drag here, not on overlay */}
        <div
          className="relative flex h-[420px] items-center justify-center overflow-visible sm:h-[460px] lg:h-[520px]"
          style={{ perspective: "1100px", perspectiveOrigin: "50% 50%" }}
          role="region"
          aria-roledescription="carousel"
          aria-label="Project coverflow"
          onPointerDown={(e) => {
            setIsDragging(true)
            dragStartX.current = e.clientX
            ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
          }}
          onPointerUp={(e) => {
            if (!isDragging) return
            const dx = e.clientX - dragStartX.current
            const threshold = 48
            if (dx < -threshold) go(1)
            else if (dx > threshold) go(-1)
            setIsDragging(false)
          }}
          onPointerCancel={() => setIsDragging(false)}
        >

          {/* cards */}
          <div
            className="relative flex h-full w-full items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {slides.map((slide, i) => {
              const offset = i - active
              // handle wrapping for loop visual distance: choose shortest signed distance
              let d = offset
              if (loop) {
                const alt = offset > 0 ? offset - slides.length : offset + slides.length
                if (Math.abs(alt) < Math.abs(offset)) d = alt
              }
              const abs = Math.abs(d)
              const isActive = d === 0
              const isVisible = abs <= 2 // show only 5 at a time for performance
              if (!isVisible) return null

              // reversed coverflow: outer edges forward
              // left cards: rotateY negative, right cards: rotateY positive
              const rotateY = d === 0 ? 0 : d < 0 ? -38 : 38
              const x = d * 190 // horizontal offset (responsive handled via scale, not xLg to avoid window check)
              const scale = isActive ? 1 : 0.86 - abs * 0.04
              const opacity = isActive ? 1 : 0.96 - abs * 0.18
              const zIndex = 10 - abs
              const brightness = isActive ? 1 : 0.92 - abs * 0.06

              return (
                <motion.div
                  key={`${slide.title}-${i}`}
                  className={cn(
                    "absolute left-1/2 top-1/2 h-[320px] w-[300px] -translate-x-1/2 -translate-y-1/2 sm:h-[360px] sm:w-[340px] lg:h-[400px] lg:w-[380px]",
                    "overflow-hidden rounded-2xl border border-ink/10 bg-blush shadow-[0_18px_50px_rgba(0,0,0,0.18)]",
                    isActive ? "cursor-default" : "cursor-pointer"
                  )}
                  style={{
                    zIndex,
                  }}
                  initial={false}
                  animate={{
                    x,
                    rotateY,
                    scale,
                    opacity,
                    filter: `brightness(${brightness})`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 28,
                    mass: 0.8,
                  }}
                  onClick={() => {
                    if (!isActive) goTo(i)
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${slides.length}: ${slide.title}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <div className="relative h-full w-full">
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      className="h-full w-full object-cover"
                      loading={i === active ? "eager" : "lazy"}
                      decoding="async"
                      draggable={false}
                    />
                    {/* soft edge vignette */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-inkdeep/45 via-transparent to-transparent opacity-60" />
                    {/* active ring */}
                    {isActive && (
                      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/15" />
                    )}
                    {/* subtle inner shadow for depth */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-2xl"
                      style={{
                        boxShadow: isActive
                          ? "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.12)"
                          : "inset 0 1px 0 rgba(255,255,255,0.14)",
                      }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* nav arrows — absolute on sides, but centered vertically */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="absolute left-2 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-ink/10 bg-bone/90 text-ink backdrop-blur-md transition hover:bg-bone sm:left-4 lg:left-1"
          >
            <iconify-icon icon="solar:arrow-left-linear" width="18" height="18" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next project"
            className="absolute right-2 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-ink/10 bg-bone/90 text-ink backdrop-blur-md transition hover:bg-bone sm:right-4 lg:right-1"
          >
            <iconify-icon icon="solar:arrow-right-linear" width="18" height="18" />
          </button>

          {/* bottom dots */}
          <div className="absolute -bottom-1 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to ${slides[i].title}`}
                aria-current={i === active ? "true" : undefined}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-400",
                  i === active
                    ? "w-8 bg-ink"
                    : "w-2.5 bg-ink/20 hover:bg-ink/35"
                )}
              />
            ))}
          </div>
        </div>

        {/* caption — follows active */}
        {showCaption && current && (
          <AnimatePresence mode="wait">
            <motion.div
              key={current.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-8 max-w-[720px] px-4 text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3.5 py-1.5 shadow-sm">
                <span className="lbl text-ink/50">
                  {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                </span>
                {current.subtitle && (
                  <>
                    <span className="h-3 w-px bg-ink/10" aria-hidden="true" />
                    <span className="lbl text-ink/70">{current.subtitle}</span>
                  </>
                )}
              </div>

              <h3 className="mt-4 font-display text-[clamp(22px,3.6vw,36px)] font-extrabold uppercase tracking-display text-ink">
                {current.title}
              </h3>
              {current.description && (
                <p className="mx-auto mt-3 max-w-[56ch] text-[14.5px] leading-[1.65] text-ink/65 text-pretty">
                  {current.description}
                </p>
              )}

              {current.meta && current.meta.length > 0 && (
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {current.meta.map((m) => (
                    <span
                      key={`${m.label}-${m.value}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-blush px-3 py-1.5"
                    >
                      <span className="lbl text-ink/45">{m.label}</span>
                      <span className="text-[13px] font-medium tracking-tight text-ink">
                        {m.value}
                      </span>
                    </span>
                  ))}
                </div>
              )}

              {current.href && (
                <a
                  href={current.href}
                  target="_blank"
                  rel="noreferrer"
                  className="btn mt-6"
                >
                  Enquire about this home
                  <span className="ar" aria-hidden="true">→</span>
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* drag hint */}
      <p className="mt-6 flex items-center justify-center gap-2 text-center text-[12px] tracking-wide text-ink/40">
        <iconify-icon icon="solar:cursor-linear" width="14" height="14" />
        Drag the rack or use arrows — centre card opens toward you
      </p>
    </div>
  )
}

export default CoverflowCarousel
