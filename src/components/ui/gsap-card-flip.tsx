"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "@/lib/gsap"
import { cn } from "@/lib/utils"

export type FlipCardItem = {
  id: string
  image: string
  alt: string
  caption?: string
  title?: string
  subtitle?: string
}

export interface GsapCardFlipProps {
  items: FlipCardItem[]
  title?: string
  meta?: string
  description?: string
  rounded?: number
  stackRotation?: number
  className?: string
}

/**
 * Gsap Card Flip — Smooth interactive editorial deck.
 * When clicked in stacked mode, the cards smoothly spread out across the stage
 * with fluid GSAP physics. In spread mode, clicking any card highlights it,
 * and clicking again or clicking the toggle gathers the stack back smoothly.
 */
export function GsapCardFlip({
  items,
  title = "Selected Interiors",
  meta = "Works Editorial · Gorakhpur",
  description = "Six completed frames from our residential archive. Click the stack to smoothly spread all rooms out, then tap any frame to inspect its details.",
  rounded = 18,
  stackRotation = 2.2,
  className,
}: GsapCardFlipProps) {
  const [active, setActive] = useState(0)
  const [spread, setSpread] = useState(false)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])

  const total = items.length

  // Animate cards on active or spread changes with smooth GSAP curves
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!cards.length) return

    const isMobile = typeof window !== "undefined" ? window.innerWidth < 640 : false
    const isTablet = typeof window !== "undefined" ? window.innerWidth < 1024 : false

    // Spacing between cards when spread out - optimized for screen width so cards do not cut off or cause scroll stutter
    const spreadSpacing = isMobile ? 54 : isTablet ? 120 : 168

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        const isCurrent = i === active

        if (spread) {
          // Spread mode: fan out smoothly across horizontal stage
          const spreadOffset = i - (total - 1) / 2 // -2.5, -1.5, -0.5, 0.5, 1.5, 2.5
          const targetX = spreadOffset * spreadSpacing
          const targetY = Math.abs(spreadOffset) * (isMobile ? 8 : 6)
          const targetRot = spreadOffset * (isMobile ? 2.5 : stackRotation)
          const targetScale = isCurrent ? (isMobile ? 1.02 : 1.05) : (isMobile ? 0.92 : 0.94)
          const targetZ = isCurrent ? 40 : 20 + Math.round(10 - Math.abs(spreadOffset))

          gsap.to(card, {
            x: targetX,
            y: targetY,
            rotation: targetRot,
            scale: targetScale,
            zIndex: targetZ,
            duration: 0.5,
            ease: "power2.out",
            force3D: true,
            overwrite: "auto",
          })
        } else {
          // Stack mode: organic, tactile pile in center
          const stackOffset = ((i - active) % total + total) % total

          let targetX = 0
          let targetY = 0
          let targetRot = 0
          let targetScale = 1

          if (stackOffset === 0) {
            targetX = 0
            targetY = 0
            targetRot = 0
            targetScale = 1
          } else if (stackOffset === 1) {
            targetX = 8
            targetY = 7
            targetRot = stackRotation * 1.1
            targetScale = 0.96
          } else if (stackOffset === 2) {
            targetX = -7
            targetY = 13
            targetRot = -stackRotation * 1.1
            targetScale = 0.92
          } else if (stackOffset === 3) {
            targetX = 10
            targetY = 19
            targetRot = stackRotation * 1.6
            targetScale = 0.88
          } else {
            targetX = (stackOffset % 2 === 0 ? 8 : -8)
            targetY = 22 + (stackOffset - 3) * 3
            targetRot = (stackOffset % 2 === 0 ? 2 : -2) * stackRotation
            targetScale = 0.85
          }

          const targetZ = total + 15 - stackOffset

          gsap.to(card, {
            x: targetX,
            y: targetY,
            rotation: targetRot,
            scale: targetScale,
            zIndex: targetZ,
            duration: 0.45,
            ease: "power2.out",
            force3D: true,
            overwrite: "auto",
          })
        }
      })
    }, stageRef)

    return () => ctx.revert()
  }, [active, spread, stackRotation, total])

  // Handle clicking a card
  const handleCardClick = useCallback((i: number) => {
    if (!spread) {
      // In stacked mode: click spreads out the cards smoothly!
      setActive(i)
      setSpread(true)
    } else {
      // In spread mode: clicking any card focuses it; clicking the active card gathers back to stack
      if (i === active) {
        setSpread(false)
      } else {
        setActive(i)
      }
    }
  }, [active, spread])

  const toggleSpread = useCallback(() => {
    setSpread((prev) => !prev)
  }, [])

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % total)
  }, [total])

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + total) % total)
  }, [total])

  const activeItem = items[active]

  return (
    <section
      id="flip-works"
      className={cn("relative w-full overflow-hidden bg-bone py-14 sm:py-18", className)}
      aria-label={title}
    >
      <div className="wrap">
        {/* Header and Controls */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {meta && <p className="lbl text-ink/40">{meta}</p>}
            <h2 className="headline mt-2 text-ink">
              {title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="accent">{title.split(" ").slice(-1)}</span>
            </h2>
            {description && (
              <p className="lede mt-3 max-w-[50ch] text-ink/60">{description}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Prev / Next Controls */}
            <div className="flex items-center gap-1.5 rounded-full border border-ink/10 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous card"
                className="grid h-8 w-8 place-items-center rounded-full text-ink transition hover:bg-blush active:scale-95"
              >
                <iconify-icon icon="solar:arrow-left-linear" width="16" height="16" />
              </button>
              <span className="lbl num px-2 text-[12px] font-semibold text-ink">
                {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next card"
                className="grid h-8 w-8 place-items-center rounded-full text-ink transition hover:bg-blush active:scale-95"
              >
                <iconify-icon icon="solar:arrow-right-linear" width="16" height="16" />
              </button>
            </div>

            {/* Direct Spread / Gather toggle button */}
            <button
              type="button"
              onClick={toggleSpread}
              className="rounded-full border border-ink/15 bg-white px-5 py-2 text-[12.5px] font-semibold tracking-wide text-ink shadow-sm transition hover:bg-blush active:scale-95"
            >
              {spread ? "Stack Cards" : "Spread Out"}
            </button>
          </div>
        </div>

        {/* Interactive Deck Stage */}
        <div
          ref={stageRef}
          className="relative mx-auto mt-10 h-[470px] w-full max-w-[1080px] sm:h-[530px]"
          style={{ perspective: "1200px" }}
        >
          <div className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2">
            {items.map((item, i) => {
              const isCurrent = i === active
              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    cardRefs.current[i] = el
                  }}
                  onClick={() => handleCardClick(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handleCardClick(i)
                    }
                  }}
                  aria-label={`${item.alt} — ${i + 1} of ${total}`}
                  aria-current={isCurrent ? "true" : undefined}
                  className={cn(
                    "absolute left-1/2 top-1/2 h-[340px] w-[240px] -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none overflow-hidden border bg-white shadow-[0_12px_32px_rgba(26,26,26,0.12)] sm:h-[420px] sm:w-[320px] sm:shadow-[0_22px_55px_rgba(26,26,26,0.16)]",
                    "transition-[border-color] duration-300"
                  )}
                  style={{
                    borderRadius: rounded,
                    borderColor: isCurrent
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(26,26,26,0.08)",
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div className="relative h-full w-full">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="h-full w-full object-cover"
                      loading={isCurrent ? "eager" : "lazy"}
                      decoding="async"
                      draggable={false}
                    />
                    {/* Dark gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-inkdeep/75 via-inkdeep/20 to-transparent" />

                    {/* Card Content */}
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      {item.subtitle && (
                        <p className="lbl text-white/70">{item.subtitle}</p>
                      )}
                      {item.title && (
                        <p className="mt-1 font-display text-[18px] font-bold uppercase tracking-display text-white">
                          {item.title}
                        </p>
                      )}
                      {item.caption && (
                        <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.5] text-white/85">
                          {item.caption}
                        </p>
                      )}
                    </div>

                    {/* Number badge */}
                    <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink shadow">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* User action prompt banner */}
          <div className="pointer-events-none absolute inset-x-0 -bottom-2 flex justify-center">
            <p className="rounded-full border border-ink/10 bg-white/90 px-4 py-1.5 text-center text-[12px] font-medium tracking-wide text-ink/70 backdrop-blur shadow-sm">
              {spread
                ? "Tap any card to focus · Tap selected to stack"
                : "Click on the deck to spread out"}
            </p>
          </div>
        </div>

        {/* Selected Frame Detail Bar */}
        {activeItem && (
          <div className="mx-auto mt-10 max-w-[760px] rounded-2xl border border-ink/10 bg-white p-5 text-center shadow-sm sm:p-6">
            <p className="font-display text-[15.5px] font-medium leading-[1.5] text-ink">
              {activeItem.caption || activeItem.alt}
            </p>
            <p className="lbl mt-2 text-ink/50">
              {activeItem.subtitle || ""} · {spread ? "Spread View" : "Stacked View"}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default GsapCardFlip


