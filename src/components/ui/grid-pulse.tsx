"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export interface GridPulseProps {
  className?: string
  cellSize?: number
  gap?: number
  fadeMs?: number
}

/**
 * Grid Pulse — carolinaraulino inspired
 * A hairline grid that lights up in a spectrum wherever the pointer passes,
 * then fades a moment later. Used in footer.
 *
 * Implementation: CSS grid of divs with hairline borders; on pointer move
 * the nearest cells are lit with a timed fade. Spectrum cycles rose → ink → oak.
 */
export function GridPulse({
  className,
  cellSize = 28,
  gap = 1,
  fadeMs = 720,
}: GridPulseProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [lit, setLit] = useState<Map<string, number>>(new Map())
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handlePointer = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      // only react when pointer is inside footer bounds (even if over content)
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      )
        return
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const col = Math.floor(x / (cellSize + gap))
      const row = Math.floor(y / (cellSize + gap))
      const now = performance.now()

      // light this cell + neighbours in a small radius with stagger
      setLit((prev) => {
        const next = new Map(prev)
        const radius = 1
        for (let dx = -radius; dx <= radius; dx++) {
          for (let dy = -radius; dy <= radius; dy++) {
            const dist = Math.abs(dx) + Math.abs(dy)
            if (dist > 1.5) continue
            const k = `${col + dx}:${row + dy}`
            next.set(k, now + dist * 90)
          }
        }
        // keep map bounded
        if (next.size > 400) {
          const entries = [...next.entries()].slice(-300)
          return new Map(entries)
        }
        return next
      })
    }

    // listen on window so footer content above doesn't block events
    window.addEventListener("pointermove", handlePointer, { passive: true })
    // also listen directly on element for enter
    el.addEventListener("pointerenter", handlePointer as EventListener, { passive: true } as AddEventListenerOptions)

    return () => {
      window.removeEventListener("pointermove", handlePointer)
      el.removeEventListener("pointerenter", handlePointer as EventListener)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [cellSize, gap])

  // cleanup faded cells on frame
  useEffect(() => {
    let alive = true
    const tick = () => {
      if (!alive) return
      const now = performance.now()
      setLit((prev) => {
        let changed = false
        const next = new Map(prev)
        for (const [k, t] of prev) {
          if (now - t > fadeMs + 400) {
            next.delete(k)
            changed = true
          }
        }
        return changed ? next : prev
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      alive = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [fadeMs])

  const now = performance.now()

  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-stone-900",
        "border-t border-white/10",
        className
      )}
      aria-hidden="true"
    >
      {/* hairline grid */}
      <div
        className="absolute inset-0"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, ${cellSize}px)`,
          gridAutoRows: `${cellSize}px`,
          gap: `${gap}px`,
          padding: `${gap}px`,
          // center visually?
        }}
      >
        {Array.from({ length: 420 }).map((_, i) => {
          const col = i % 28
          const row = Math.floor(i / 28)
          const key = `${col}:${row}`
          const litAt = lit.get(key)
          const age = litAt ? now - litAt : Infinity
          const isLit = age < fadeMs
          const progress = isLit ? 1 - age / fadeMs : 0 // 1→0
          return (
            <div
              key={i}
              className="relative rounded-[2px] border border-white/[0.07] bg-white/[0.02] transition-colors duration-200"
              style={
                isLit
                  ? {
                      background:
                        progress > 0.6
                          ? `rgba(201,139,146,${0.18 + progress * 0.22})`
                          : progress > 0.3
                            ? `rgba(255,255,255,${0.09 + progress * 0.08})`
                            : `rgba(154,107,63,${0.10 + progress * 0.06})`,
                      borderColor:
                        progress > 0.5
                          ? `rgba(201,139,146,${0.38 * progress})`
                          : `rgba(255,255,255,${0.14 * progress})`,
                      boxShadow:
                        progress > 0.5
                          ? `0 0 ${12 * progress}px rgba(201,139,146,${0.22 * progress})`
                          : "none",
                      transform: `scale(${0.98 + progress * 0.03})`,
                    }
                  : undefined
              }
            />
          )
        })}
      </div>

      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-stone-900/20 to-transparent" />
    </div>
  )
}

export default GridPulse
