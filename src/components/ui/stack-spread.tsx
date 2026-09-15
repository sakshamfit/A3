"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

export type StackSpreadItem = {
  src: string
  alt: string
  title: string
  subtitle?: string
  span?: string
}

export interface StackSpreadProps {
  items?: StackSpreadItem[]
  className?: string
}

/**
 * Stack Spread — daiwiikharihar inspired
 * Interactive scroll-driven linear → spatial stack spread.
 * As you scroll, a linear stacked deck fans out into a spatial grid.
 *
 * For A3: interiors deck that starts stacked (like samples on a table)
 * and spreads to reveal each room as you scroll.
 */
const DEFAULT_ITEMS: StackSpreadItem[] = [
  {
    src: "/images/gal-living.webp",
    alt: "Living room with oak battens wrapping a lit media wall",
    title: "Living",
    subtitle: "Terracotta Villa",
  },
  {
    src: "/images/gal-lounge.webp",
    alt: "Lounge alcove with two curved armchairs and an arched mirror",
    title: "Lounge",
    subtitle: "Obsidian Loft",
  },
  {
    src: "/images/gal-kitchen.webp",
    alt: "Modular kitchen island in pale stone with two oak stools",
    title: "Kitchen",
    subtitle: "Studio Bone",
  },
  {
    src: "/images/gal-bedroom.webp",
    alt: "Master bedroom with a fluted plaster headboard wall",
    title: "Bedroom",
    subtitle: "Garden Duplex",
  },
  {
    src: "/images/res-obsidian.webp",
    alt: "Dark stone kitchen island with seamless storage walls",
    title: "Obsidian",
    subtitle: "Taramandal · 2025",
  },
]

export function StackSpread({ items = DEFAULT_ITEMS, className }: StackSpreadProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  // spread goes 0 → 1 as you scroll through the pinned section
  const spread = useTransform(scrollYProgress, [0, 0.52, 1], [0, 1, 1])

  return (
    <div ref={ref} className={cn("relative h-[180vh] w-full overflow-clip md:h-[220vh]", className)}>
      <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-visible bg-bone">
        {/* header */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
          <div className="wrap flex items-center justify-between gap-4 py-6">
            <p className="lbl text-ink/40">Stack Spread · Scroll</p>
            <p className="hidden items-center gap-2 text-[12px] tracking-wide text-ink/40 sm:inline-flex">
              <iconify-icon icon="solar:cursor-linear" width="14" height="14" />
              Scroll to spread the deck
            </p>
          </div>
        </div>

        {/* cards stage */}
        <div className="relative h-[420px] w-full max-w-[1080px] px-6 sm:h-[460px]">
          {items.map((item, i) => {
            const n = items.length
            // stacked: all centered with slight offset/rotate, linear
            // spread: distributed in a row/grid
            const idx = i - (n - 1) / 2 // -2, -1, 0, 1, 2

            // transforms driven by spread — responsive x to avoid mobile overflow
            const x = useTransform(spread, (v) => {
              const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false
              const gap = isMobile ? 124 : 210
              return idx * gap * v + i * 1.1 * (1 - v)
            })
            const y = useTransform(spread, (v) => -Math.abs(idx) * 8 * v + i * 3 * (1 - v))
            const rotate = useTransform(spread, (v) => idx * 3.2 * v + (i - 2) * 0.9 * (1 - v))
            const scale = useTransform(spread, (v) => 0.9 + 0.1 * v - i * 0.02 * (1 - v))
            const opacity = useTransform(spread, (v) => 0.95 + 0.05 * v)

            return (
              <motion.div
                key={item.title + i}
                style={{ x, y, rotate, scale, opacity, zIndex: n - i }}
                className="absolute left-1/2 top-1/2 h-[320px] w-[260px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_16px_40px_rgba(26,26,26,0.12)] sm:h-[360px] sm:w-[300px]"
              >
                <div className="relative h-full w-full">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inkdeep/55 via-inkdeep/0 to-transparent opacity-80" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="lbl text-white/70">{item.subtitle}</p>
                    <p className="mt-1 font-display text-[18px] font-bold uppercase tracking-display text-white">
                      {item.title}
                    </p>
                  </div>
                  {/* index badge */}
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink shadow">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* bottom caption morphs with spread */}
        <motion.div
          style={{ opacity: useTransform(spread, [0, 0.35], [0.6, 1]) }}
          className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center px-6"
        >
          <div className="rounded-full border border-ink/10 bg-white/80 px-4 py-2 text-center text-[12px] tracking-wide text-ink/60 backdrop-blur">
            Linear stack — then spatial spread as you scroll
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default StackSpread
