"use client"

import React, { useEffect, useRef, useState } from "react"
import { gsap } from "@/lib/gsap"
import { cn } from "@/lib/utils"

export interface SliderItem {
  id: string
  title: string
  subtitle?: string
  category?: string
  image: string
  specs?: string
  href?: string
  year?: string
  location?: string
  quote?: string
}

export interface InfinitePerspectiveSliderProps {
  items: SliderItem[]
  autoPlay?: boolean
  autoPlaySpeed?: number
  perspective?: number
  maxTilt?: number
  gap?: number
  className?: string
  badge?: string
  heading?: React.ReactNode
  subheading?: React.ReactNode
}

/**
 * SplitTextChar Component
 * Splits a string into individual character spans with staggered transition on active/hover
 */
function SplitTextChar({
  text,
  isHovered,
  className,
}: {
  text: string
  isHovered: boolean
  className?: string
}) {
  return (
    <span className={cn("inline-flex flex-wrap overflow-hidden", className)}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="inline-block transition-transform duration-500 ease-out"
          style={{
            transform: isHovered ? "translateY(0)" : "translateY(110%)",
            transitionDelay: `${index * 16}ms`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  )
}

/**
 * Infinite Perspective Slider — Inspired by Hyperiux Vault
 *
 * An infinitely looping 3D horizontal perspective gallery where cards
 * tilt along the Y-axis and recede into depth as they travel across
 * the viewport. Supports drag, wheel, pointer velocity physics, auto-drift,
 * and SplitText caption reveals on hover.
 */
export function InfinitePerspectiveSlider({
  items,
  autoPlay = true,
  autoPlaySpeed = 0.8,
  perspective = 1300,
  maxTilt = 24,
  gap = 32,
  className,
  badge = "Perspective Gallery",
  heading = "Infinite Perspective Slider",
  subheading = "Drag or swipe across the horizon to inspect our bespoke commissions in full 3D spatial perspective.",
}: InfinitePerspectiveSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const cardElementsRef = useRef<Map<number, HTMLDivElement>>(new Map())

  // Ensure minimum number of cards for seamless infinite wrapping
  const loopedItems = React.useMemo(() => {
    if (!items.length) return []
    // Multiply to guarantee smooth wrapping regardless of wide screen size
    const factor = items.length < 5 ? 4 : 3
    const res: Array<SliderItem & { originalIndex: number; keyId: string }> = []
    for (let f = 0; f < factor; f++) {
      items.forEach((item, idx) => {
        res.push({
          ...item,
          originalIndex: idx,
          keyId: `${item.id}-${f}-${idx}`,
        })
      })
    }
    return res
  }, [items])

  const totalCards = loopedItems.length

  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  // Physics and drag state refs (avoid unnecessary React re-renders for 60fps raf)
  const positionRef = useRef(0)
  const targetVelocityRef = useRef(autoPlaySpeed)
  const currentVelocityRef = useRef(autoPlaySpeed)
  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragLastXRef = useRef(0)
  const rafIdRef = useRef<number | null>(null)
  const cardWidthRef = useRef(380)

  // Check reduced motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      setIsReducedMotion(mediaQuery.matches)
      const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches)
      mediaQuery.addEventListener("change", handler)
      return () => mediaQuery.removeEventListener("change", handler)
    }
  }, [])

  // Measure card width dynamically on resize
  useEffect(() => {
    const updateDimensions = () => {
      const width = typeof window !== "undefined" ? window.innerWidth : 1200
      if (width < 640) {
        cardWidthRef.current = 280
      } else if (width < 1024) {
        cardWidthRef.current = 330
      } else {
        cardWidthRef.current = 390
      }
    }
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Animation loop with continuous wrapping and perspective transform calculation
  useEffect(() => {
    if (!totalCards) return

    const totalWidth = totalCards * (cardWidthRef.current + gap)

    const tick = () => {
      // If not dragging, apply inertia & auto-drift
      if (!isDraggingRef.current) {
        if (isPlaying && !isReducedMotion) {
          // Smooth blend towards baseline autoPlaySpeed
          currentVelocityRef.current += (autoPlaySpeed - currentVelocityRef.current) * 0.05
        } else {
          // Decay towards 0 when paused
          currentVelocityRef.current *= 0.92
        }
        positionRef.current += currentVelocityRef.current
      } else {
        // While dragging, velocity follows user gesture
        currentVelocityRef.current += (targetVelocityRef.current - currentVelocityRef.current) * 0.3
      }

      // Infinite wrapping of position
      if (positionRef.current < 0) {
        positionRef.current += totalWidth
      } else if (positionRef.current >= totalWidth) {
        positionRef.current -= totalWidth
      }

      const container = containerRef.current
      if (container) {
        const containerRect = container.getBoundingClientRect()
        const centerX = containerRect.width / 2

        // Update each card's 3D perspective orientation
        cardElementsRef.current.forEach((el, index) => {
          if (!el) return

          const cardStep = cardWidthRef.current + gap
          // Calculate wrapped X position of card relative to view
          let cardX = (index * cardStep - (positionRef.current % totalWidth)) % totalWidth
          if (cardX < -cardWidthRef.current) {
            cardX += totalWidth
          }
          if (cardX > totalWidth - cardWidthRef.current) {
            cardX -= totalWidth
          }

          // Offset from screen center: -1.0 (left) to 0.0 (center) to +1.0 (right)
          const distanceFromCenter = cardX + cardWidthRef.current / 2 - centerX
          const normalizedDist = Math.max(-1.5, Math.min(1.5, distanceFromCenter / (centerX * 0.85)))

          if (isReducedMotion) {
            el.style.transform = `translateX(${cardX}px)`
            el.style.opacity = "1"
            el.style.filter = "none"
          } else {
            const tiltY = -normalizedDist * maxTilt
            const transZ = -Math.pow(Math.abs(normalizedDist), 1.3) * 160
            const scale = 1 - Math.min(0.18, Math.abs(normalizedDist) * 0.12)
            const brightness = 1 - Math.min(0.4, Math.abs(normalizedDist) * 0.28)

            el.style.transform = `translateX(${cardX}px) translateZ(${transZ}px) rotateY(${tiltY}deg) scale(${scale})`
            el.style.filter = `brightness(${brightness})`
            // Higher z-index for cards closer to the center
            el.style.zIndex = `${Math.round(100 - Math.abs(normalizedDist) * 50)}`
          }
        })
      }

      rafIdRef.current = requestAnimationFrame(tick)
    }

    rafIdRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [totalCards, isPlaying, autoPlaySpeed, maxTilt, gap, isReducedMotion])

  // Mouse / Touch handlers for drag interaction
  const handlePointerDown = (clientX: number) => {
    isDraggingRef.current = true
    dragStartXRef.current = clientX
    dragLastXRef.current = clientX
    targetVelocityRef.current = 0
    currentVelocityRef.current = 0
  }

  const handlePointerMove = (clientX: number) => {
    if (!isDraggingRef.current) return
    const deltaX = clientX - dragLastXRef.current
    dragLastXRef.current = clientX
    positionRef.current -= deltaX * 1.15
    targetVelocityRef.current = -deltaX * 0.8
  }

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
  }

  // Wheel interaction (horizontal tilt scrolling)
  const handleWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    if (Math.abs(delta) > 4) {
      positionRef.current += delta * 0.75
      currentVelocityRef.current = delta * 0.08
    }
  }

  const handlePrev = () => {
    const step = cardWidthRef.current + gap
    gsap.to(positionRef, {
      current: positionRef.current - step,
      duration: 0.6,
      ease: "power2.out",
    })
  }

  const handleNext = () => {
    const step = cardWidthRef.current + gap
    gsap.to(positionRef, {
      current: positionRef.current + step,
      duration: 0.6,
      ease: "power2.out",
    })
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden select-none bg-bone py-14 sm:py-20",
        className
      )}
      onWheel={handleWheel}
      aria-label="Infinite Perspective Slider Gallery"
    >
      {/* Section Header */}
      <div className="wrap mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          {badge && <p className="lbl text-ink/45 tracking-widest">{badge}</p>}
          <h2 className="headline mt-2 text-ink">{heading}</h2>
          {subheading && <div className="lede mt-3 text-ink/65">{subheading}</div>}
        </div>

        {/* Action Controls: Autoplay toggle & manual steppers */}
        <div className="flex items-center gap-3 self-start sm:self-end">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex h-10 items-center gap-2 border border-ink/15 bg-white/70 px-4 font-mono text-[11px] uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-white"
            aria-label={isPlaying ? "Pause automatic slide drift" : "Resume slide drift"}
          >
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-full",
                isPlaying ? "bg-emerald-500 animate-pulse" : "bg-ink/30"
              )}
            />
            <span>{isPlaying ? "Auto On" : "Auto Off"}</span>
          </button>

          <div className="flex items-center border border-ink/15 bg-white/70">
            <button
              type="button"
              onClick={handlePrev}
              className="flex h-10 w-11 items-center justify-center border-r border-ink/10 text-ink transition-colors hover:bg-ink hover:text-white"
              aria-label="Previous frame"
            >
              <iconify-icon icon="solar:arrow-left-linear" width="16" height="16" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex h-10 w-11 items-center justify-center text-ink transition-colors hover:bg-ink hover:text-white"
              aria-label="Next frame"
            >
              <iconify-icon icon="solar:arrow-right-linear" width="16" height="16" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Perspective Stage */}
      <div
        ref={containerRef}
        className="relative h-[430px] w-full cursor-grab overflow-hidden active:cursor-grabbing sm:h-[480px] lg:h-[510px]"
        style={{
          perspective: `${perspective}px`,
          perspectiveOrigin: "center 45%",
        }}
        onMouseDown={(e) => handlePointerDown(e.clientX)}
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
        onTouchEnd={handlePointerUp}
      >
        <div
          ref={trackRef}
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {loopedItems.map((item, idx) => {
            const isHovered = hoveredCardId === item.keyId

            return (
              <div
                key={item.keyId}
                ref={(el) => {
                  if (el) cardElementsRef.current.set(idx, el)
                  else cardElementsRef.current.delete(idx)
                }}
                onMouseEnter={() => setHoveredCardId(item.keyId)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="group absolute top-4 h-[380px] w-[280px] origin-center sm:h-[420px] sm:w-[330px] lg:h-[450px] lg:w-[390px]"
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform, filter",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Visual Card Frame */}
                <div className="relative flex h-full w-full flex-col overflow-hidden border border-ink/15 bg-inkdeep text-chalk shadow-2xl transition-all duration-300 group-hover:border-white/30">
                  {/* Photo Container */}
                  <div className="relative h-[66%] w-full overflow-hidden bg-stone-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      draggable={false}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-inkdeep via-transparent to-black/30" />

                    {/* Top tags */}
                    <div className="absolute left-4 top-4 right-4 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur-md">
                        <iconify-icon icon="solar:layers-minimalistic-linear" width="11" height="11" class="text-amber-300" />
                        {item.category || "Residence"}
                      </span>
                      {item.year && (
                        <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300">
                          {item.year}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Caption & Specs Details with SplitText Char Animation */}
                  <div className="flex h-[34%] flex-col justify-between p-4 sm:p-5 bg-inkdeep">
                    <div>
                      {/* Location or Subtitle */}
                      {item.location && (
                        <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-chalk/50">
                          <iconify-icon icon="solar:map-point-linear" width="11" height="11" class="text-amber-300/80" />
                          {item.location}
                        </p>
                      )}

                      {/* Main Title with SplitText on hover */}
                      <h3 className="mt-1 font-display text-[16px] font-bold uppercase tracking-tight text-white sm:text-[18px]">
                        <span className="group-hover:hidden">{item.title}</span>
                        <SplitTextChar
                          text={item.title}
                          isHovered={isHovered}
                          className="hidden group-hover:inline-flex"
                        />
                      </h3>

                      {/* Optional Client Quote */}
                      {item.quote && (
                        <p className="mt-1 line-clamp-1 flex items-center gap-1.5 font-mono text-[10px] italic text-chalk/75">
                          <iconify-icon icon="solar:chat-round-line-linear" width="11" height="11" class="text-amber-300 shrink-0" />
                          <span>“{item.quote}”</span>
                        </p>
                      )}
                    </div>

                    {/* Bottom Specs & Arrow */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
                      <p className="flex items-center gap-1.5 line-clamp-1 font-mono text-[11px] text-chalk/65">
                        <iconify-icon icon="solar:ruler-angular-linear" width="11" height="11" class="text-chalk/45 shrink-0" />
                        <span>{item.specs || "Bespoke Joinery & Finishes"}</span>
                      </p>
                      <span
                        className="font-mono text-xs text-amber-300 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Touch drag indicator for mobile */}
      <div className="wrap mt-4 flex items-center justify-center sm:hidden">
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink/40">
          <iconify-icon icon="solar:cursor-linear" width="12" height="12" />
          <span>← Drag horizontally to rotate →</span>
        </span>
      </div>
    </div>
  )
}

export default InfinitePerspectiveSlider
