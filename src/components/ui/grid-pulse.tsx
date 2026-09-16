"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export interface GridPulseProps {
  className?: string
  cellSize?: number
  gap?: number
  fadeMs?: number
}

interface SnakeSegment {
  gx: number
  gy: number
  time: number
}

/**
 * Grid Pulse with Yellow Snake Trail Animation
 * Renders a crisp background grid on canvas. When the user moves their cursor
 * over the footer, a luminous yellow snake trail slithers and tracks the cursor
 * through the grid cells with authentic snake segment dynamics and glowing warmth.
 */
export function GridPulse({
  className,
  cellSize = 26,
  gap = 1,
}: GridPulseProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let width = (canvas.width = container.clientWidth)
    let height = (canvas.height = container.clientHeight)

    // Snake state
    const snake: SnakeSegment[] = []
    const maxSnakeLength = 22
    let targetGx = -1
    let targetGy = -1
    let isHovered = false

    const handleResize = () => {
      if (!container || !canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = container.clientWidth
      height = container.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        isHovered = false
        return
      }
      isHovered = true
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const step = cellSize + gap
      const newGx = Math.floor(mouseX / step)
      const newGy = Math.floor(mouseY / step)

      targetGx = newGx
      targetGy = newGy

      // If snake is empty, seed it
      if (snake.length === 0) {
        snake.push({ gx: newGx, gy: newGy, time: performance.now() })
      }
    }

    const handlePointerLeave = () => {
      isHovered = false
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    container.addEventListener("pointerleave", handlePointerLeave)

    let lastStepTime = performance.now()

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height)

      const step = cellSize + gap
      const cols = Math.ceil(width / step) + 1
      const rows = Math.ceil(height / step) + 1

      // 1. Draw hairline background grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.045)"
      ctx.lineWidth = 1

      ctx.beginPath()
      for (let c = 0; c <= cols; c++) {
        const x = c * step
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
      }
      for (let r = 0; r <= rows; r++) {
        const y = r * step
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
      }
      ctx.stroke()

      // 2. Advance snake towards cursor in a slithering motion
      if (isHovered && targetGx >= 0 && targetGy >= 0) {
        // Slither step every 35ms for a fast, responsive, snake-like crawl
        if (now - lastStepTime > 32) {
          lastStepTime = now
          const head = snake[0] || { gx: targetGx, gy: targetGy, time: now }

          if (head.gx !== targetGx || head.gy !== targetGy) {
            // Pick next grid cell toward target with slight snake slither behavior
            let nextGx = head.gx
            let nextGy = head.gy

            const dx = targetGx - head.gx
            const dy = targetGy - head.gy

            // Alternate axes occasionally to look like a true slithering snake
            if (Math.abs(dx) > Math.abs(dy)) {
              nextGx += Math.sign(dx)
            } else if (dy !== 0) {
              nextGy += Math.sign(dy)
            } else if (dx !== 0) {
              nextGx += Math.sign(dx)
            }

            snake.unshift({ gx: nextGx, gy: nextGy, time: now })

            if (snake.length > maxSnakeLength) {
              snake.pop()
            }
          }
        }
      } else {
        // Slowly shrink snake when pointer leaves
        if (now - lastStepTime > 40 && snake.length > 0) {
          lastStepTime = now
          snake.pop()
        }
      }

      // 3. Render the snake with glowing yellow color
      if (snake.length > 0) {
        ctx.save()
        for (let i = snake.length - 1; i >= 0; i--) {
          const seg = snake[i]
          const ratio = 1 - i / snake.length // 1 at head, 0 at tail
          const px = seg.gx * step
          const py = seg.gy * step

          // Segment color in vivid luminous yellow (from #facc15 to golden amber)
          const isHead = i === 0
          const alpha = isHead ? 0.95 : Math.max(0.12, ratio * 0.85)

          // Glowing shadow
          ctx.shadowColor = "rgba(250, 204, 21, 0.8)"
          ctx.shadowBlur = isHead ? 14 : Math.round(ratio * 10)

          // Filled grid block
          ctx.fillStyle = `rgba(250, 204, 21, ${alpha})`
          const pad = isHead ? 1 : 2
          ctx.fillRect(
            px + pad,
            py + pad,
            cellSize - pad * 2,
            cellSize - pad * 2
          )

          // Accent border for head & leading segments
          if (ratio > 0.4) {
            ctx.strokeStyle = `rgba(255, 245, 150, ${Math.min(1, alpha + 0.2)})`
            ctx.lineWidth = isHead ? 2 : 1
            ctx.strokeRect(
              px + pad,
              py + pad,
              cellSize - pad * 2,
              cellSize - pad * 2
            )
          }
        }
        ctx.restore()
      }

      animationId = requestAnimationFrame(render)
    }

    animationId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("pointermove", handlePointerMove)
      container.removeEventListener("pointerleave", handlePointerLeave)
      cancelAnimationFrame(animationId)
    }
  }, [cellSize, gap])

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-stone-900",
        "border-t border-white/10",
        className
      )}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
      {/* soft edge vignettes */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-stone-900/30 to-transparent" />
    </div>
  )
}

export default GridPulse
