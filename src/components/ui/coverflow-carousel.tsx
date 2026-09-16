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
 * Drag horizontally, click side cards, or use arrows; caption follows the active slide.
 *
 * Built with absolute inset-0 auto margins to ensure exact centering and eliminate
 * transform-translate collisions with Framer Motion 3D animations.
 */
export function CoverflowCarousel({
  slides,
  showCaption = true,
  className,
  loop = true,
}: CoverflowCarouselProps) {
  const isDuplicated = loop && slides.length > 0 && slides.length < 5
  const displaySlides = isDuplicated ? [...slides, ...slides] : slides
  const total = displaySlides.length

  const [active, setActive] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  )
  const dragStartX = useRef(0)

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const go = useCallback(
    (dir: 1 | -1) => {
      setActive((prev) => {
        if (loop) return (prev + dir + total) % total
        return Math.max(0, Math.min(total - 1, prev + dir))
      })
    },
    [total, loop]
  )

  const goTo = useCallback(
    (targetSlideIndex: number) => {
      if (slides.length === 0) return
      const normIndex = ((targetSlideIndex % slides.length) + slides.length) % slides.length
      if (!isDuplicated) {
        setActive(normIndex)
        return
      }

      // Find the closest occurrence in displaySlides to active
      let best = normIndex
      let minDiff = Infinity
      for (let k = 0; k < total; k++) {
        if (k % slides.length === normIndex) {
          let diff = k - active
          if (loop) {
            const alt = diff > 0 ? diff - total : diff + total
            if (Math.abs(alt) < Math.abs(diff)) diff = alt
          }
          if (Math.abs(diff) < Math.abs(minDiff)) {
            minDiff = diff
            best = (active + diff + total) % total
          }
        }
      }
      setActive(best)
    },
    [slides.length, isDuplicated, total, active, loop]
  )

  // keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1)
      if (e.key === "ArrowRight") go(1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go])

  if (!slides || slides.length === 0) return null

  const realActive = ((active % slides.length) + slides.length) % slides.length
  const current = slides[realActive]

  // Responsive spacing to ensure cards NEVER overlap the active center slide
  // Cards are 260px (mobile), 300px (sm), 340px (lg) wide
  const spacing =
    windowWidth < 640 ? 250 : windowWidth < 1024 ? 310 : 360

  return (
    <div className={cn("w-full select-none", className)}>
      {/* viewport */}
      <div className="relative mx-auto w-full max-w-[1140px]">
        {/* perspective stage */}
        <div
          className="relative flex h-[380px] w-full items-center justify-center overflow-visible touch-pan-y sm:h-[430px] lg:h-[470px]"
          style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}
          role="region"
          aria-roledescription="carousel"
          aria-label="Project coverflow"
          onPointerDown={(e) => {
            if (e.button !== 0 && e.pointerType === "mouse") return
            dragStartX.current = e.clientX
            setIsDragging(false)
          }}
          onPointerMove={(e) => {
            if (dragStartX.current !== 0) {
              if (Math.abs(e.clientX - dragStartX.current) > 10) {
                setIsDragging(true)
              }
            }
          }}
          onPointerUp={(e) => {
            if (dragStartX.current !== 0) {
              const dx = e.clientX - dragStartX.current
              const threshold = 40
              if (dx < -threshold) go(1)
              else if (dx > threshold) go(-1)
              dragStartX.current = 0
              setTimeout(() => setIsDragging(false), 50)
            }
          }}
          onPointerCancel={() => {
            dragStartX.current = 0
            setIsDragging(false)
          }}
        >
          {/* cards */}
          <div
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {displaySlides.map((slide, i) => {
              let offset = i - active
              if (loop) {
                const alt = offset > 0 ? offset - total : offset + total
                if (Math.abs(alt) < Math.abs(offset)) offset = alt
              }
              const abs = Math.abs(offset)
              const isActive = offset === 0
              // Show only adjacent slides to maintain clear, uncluttered framing
              const isVisible = abs <= 1
              if (!isVisible) return null

              // Left card (offset < 0): inner edge tilts back (-Z), outer edge tilts forward (+Z)
              // Right card (offset > 0): inner edge tilts back (-Z), outer edge tilts forward (+Z)
              const rotateY = isActive ? 0 : offset < 0 ? 22 : -22
              const x = offset * spacing
              const z = isActive ? 40 : -60 * abs
              const scale = isActive ? 1 : 0.84
              const opacity = isActive ? 1 : 0.82
              const zIndex = isActive ? 30 : 20 - abs
              const brightness = isActive ? 1 : 0.86

              return (
                <motion.div
                  key={`${slide.title}-${i}`}
                  className={cn(
                    "absolute inset-0 m-auto h-[290px] w-[260px] sm:h-[340px] sm:w-[300px] lg:h-[380px] lg:w-[340px]",
                    "overflow-hidden rounded-2xl border border-ink/10 bg-blush shadow-[0_22px_55px_rgba(0,0,0,0.18)]",
                    isActive ? "cursor-default" : "cursor-pointer"
                  )}
                  style={{
                    zIndex,
                  }}
                  initial={false}
                  animate={{
                    x,
                    z,
                    rotateY,
                    scale,
                    opacity,
                    filter: `brightness(${brightness})`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 30,
                    mass: 0.8,
                  }}
                  onClick={() => {
                    if (!isDragging && !isActive) {
                      setActive(i)
                    }
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${(i % slides.length) + 1} of ${slides.length}: ${slide.title}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <div className="relative h-full w-full">
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      className="h-full w-full object-cover"
                      loading={isActive ? "eager" : "lazy"}
                      decoding="async"
                      draggable={false}
                    />
                    {/* soft edge vignette */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-inkdeep/45 via-transparent to-transparent opacity-60" />
                    {/* active ring */}
                    {isActive && (
                      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/20" />
                    )}
                    {/* subtle inner shadow for depth */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-2xl"
                      style={{
                        boxShadow: isActive
                          ? "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.12)"
                          : "inset 0 1px 0 rgba(255,255,255,0.14)",
                      }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* nav arrows — vertical center with cards */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              go(-1)
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Previous project"
            className="absolute left-2 top-1/2 z-40 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-ink/15 bg-bone/95 text-ink shadow-md backdrop-blur-md transition hover:scale-105 hover:bg-white active:scale-95 sm:left-4 lg:left-2"
          >
            <iconify-icon icon="solar:arrow-left-linear" width="20" height="20" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              go(1)
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Next project"
            className="absolute right-2 top-1/2 z-40 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-ink/15 bg-bone/95 text-ink shadow-md backdrop-blur-md transition hover:scale-105 hover:bg-white active:scale-95 sm:right-4 lg:right-2"
          >
            <iconify-icon icon="solar:arrow-right-linear" width="20" height="20" />
          </button>

          {/* bottom dots */}
          <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goTo(i)
                }}
                onPointerDown={(e) => e.stopPropagation()}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === realActive ? "true" : undefined}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === realActive
                    ? "w-8 bg-ink"
                    : "w-2.5 bg-ink/25 hover:bg-ink/45"
                )}
              />
            ))}
          </div>
        </div>

        {/* caption — follows active */}
        {showCaption && current && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${current.title}-${realActive}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-8 max-w-[720px] px-4 text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3.5 py-1.5 shadow-sm">
                <span className="lbl text-ink/50">
                  {String(realActive + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                </span>
                {current.subtitle && (
                  <>
                    <span className="h-3 w-px bg-ink/10" aria-hidden="true" />
                    <span className="lbl text-ink/70">{current.subtitle}</span>
                  </>
                )}
              </div>

              <h3 className="mt-4 font-display text-[clamp(24px,3.8vw,38px)] font-extrabold uppercase tracking-display text-ink">
                {current.title}
              </h3>
              {current.description && (
                <p className="mx-auto mt-3 max-w-[56ch] text-[14.5px] leading-[1.65] text-ink/70 text-pretty">
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
                  className="btn mt-6 inline-flex"
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
        Drag the rack, tap side cards, or use arrows
      </p>
    </div>
  )
}

export default CoverflowCarousel

