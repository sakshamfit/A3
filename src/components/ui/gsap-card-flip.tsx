"use client"

import { useEffect, useRef, useState } from "react"
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
 * Gsap Card Flip — hyperiux inspired
 * Editorial card stack: 5 frames, click stack to spread, click any frame to
 * flip it forward with GSAP. Adapted for A3 interiors.
 */
export function GsapCardFlip({
  items,
  title = "Selected Frames",
  meta,
  description,
  rounded = 16,
  stackRotation = 2,
  className,
}: GsapCardFlipProps) {
  const [active, setActive] = useState(0)
  const [spread, setSpread] = useState(false)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])

  // initial stack layout + spread toggle
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!cards.length) return

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        const isActive = i === active
        const offset = i - active
        // when spread: fan out horizontally + slight rotation; when stacked: tight pile
        const target = spread
          ? {
              x: offset * 86,
              y: Math.abs(offset) * 8,
              rotation: offset * stackRotation,
              scale: isActive ? 1 : 0.92,
              zIndex: isActive ? 10 : 5 - Math.abs(offset),
            }
          : {
              x: i * 2 - 4,
              y: i * 2 - 4,
              rotation: (i - 2) * stackRotation * 0.6,
              scale: 1 - i * 0.015,
              zIndex: items.length - i,
            }

        gsap.to(card, {
          ...target,
          duration: 0.62,
          ease: "power3.out",
          overwrite: "auto",
        })

        // highlight active border
        gsap.to(card, {
          borderColor: isActive ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.10)",
          duration: 0.4,
        })
      })
    }, stageRef)

    return () => ctx.revert()
  }, [active, spread, stackRotation, items.length])

  const handleCardClick = (i: number) => {
    if (!spread) {
      setSpread(true)
      return
    }
    if (i === active) {
      setSpread((v) => !v)
      return
    }
    // flip animation: scale down slightly then bring to front
    const el = cardRefs.current[i]
    if (el) {
      gsap.fromTo(
        el,
        { scale: 0.92, rotationY: -12 },
        {
          scale: 1,
          rotationY: 0,
          duration: 0.55,
          ease: "power3.out",
          overwrite: "auto",
        }
      )
    }
    setActive(i)
  }

  const activeItem = items[active]

  return (
    <section
      className={cn("relative w-full overflow-hidden bg-bone", className)}
      aria-label={title}
    >
      <div className="wrap py-12 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {meta && <p className="lbl text-ink/40">{meta}</p>}
            <h2 className="headline mt-2 text-ink">
              {title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="accent">{title.split(" ").slice(-1)}</span>
            </h2>
            {description && (
              <p className="lede mt-3 max-w-[48ch] text-ink/60">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="lbl num text-ink/40">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(items.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => setSpread((v) => !v)}
              className="rounded-full border border-ink/10 bg-white px-4 py-2 text-[12px] font-medium tracking-wide text-ink hover:bg-blush"
            >
              {spread ? "Stack" : "Spread"}
            </button>
          </div>
        </div>

        <div
          ref={stageRef}
          className="relative mx-auto mt-10 h-[460px] w-full max-w-[960px] sm:h-[520px]"
          style={{ perspective: "1100px" }}
        >
          <div className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2">
            {items.map((item, i) => (
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
                aria-label={`${item.alt} — ${i + 1} of ${items.length}`}
                aria-current={i === active ? "true" : undefined}
                className={cn(
                  "absolute left-1/2 top-1/2 h-[380px] w-[300px] -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none overflow-hidden border bg-white shadow-[0_18px_50px_rgba(26,26,26,0.14)] sm:h-[420px] sm:w-[340px]",
                  "transition-[border-color] duration-300"
                )}
                style={{
                  borderRadius: rounded,
                  borderColor: i === active ? "rgba(255,255,255,0.22)" : "rgba(26,26,26,0.08)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="relative h-full w-full">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="h-full w-full object-cover"
                    loading={i === active ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                  />
                  {/* gradient scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-inkdeep/55 via-transparent to-transparent" />
                  {/* caption */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    {item.subtitle && (
                      <p className="lbl text-white/70">{item.subtitle}</p>
                    )}
                    {item.title && (
                      <p className="mt-1 font-display text-[17px] font-bold uppercase tracking-display text-white">
                        {item.title}
                      </p>
                    )}
                    {item.caption && (
                      <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.5] text-white/80">
                        {item.caption}
                      </p>
                    )}
                  </div>
                  {/* top index */}
                  <div className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink shadow">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* hint */}
          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
            <p className="rounded-full border border-ink/10 bg-white/80 px-3.5 py-1.5 text-center text-[12px] tracking-wide text-ink/60 backdrop-blur">
              Click the stack to spread — then any frame to bring it forward
            </p>
          </div>
        </div>

        {/* active detail bar */}
        {activeItem && (
          <div className="mx-auto mt-8 max-w-[760px] rounded-2xl border border-ink/10 bg-white p-5 text-center shadow-sm sm:p-6">
            <p className="font-display text-[15px] font-medium leading-[1.5] text-ink">
              {activeItem.caption || activeItem.alt}
            </p>
            <p className="lbl mt-2 text-ink/40">
              {activeItem.subtitle || ""} · Tap spread to see all
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default GsapCardFlip
