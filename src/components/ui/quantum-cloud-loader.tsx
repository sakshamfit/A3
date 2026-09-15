"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface QuantumCloudLoaderProps {
  className?: string
  label?: string
  sublabel?: string
}

/**
 * Quantum Cloud Loader — daiwiikharihar inspired
 * Sleek multi-colored particle loading animation featuring smooth overlapping
 * quantum-style orbits and glowing depth effects.
 *
 * Tuned for A3: bone/ink palette + rose accents, not the generic white/black demo.
 * Three overlapping orbits at different tilts, each carrying 2 particles with trails.
 */
export function QuantumCloudLoader({
  className,
  label = "A3 Interior",
  sublabel = "Crafting your space…",
}: QuantumCloudLoaderProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-8 overflow-hidden rounded-[28px] border border-ink/10 bg-bone px-8 py-10 shadow-[0_18px_60px_rgba(26,26,26,0.08)]",
        className
      )}
      role="status"
      aria-label="Loading"
    >
      {/* soft ambient glow behind orbits */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 38%, rgba(201,139,146,0.22) 0%, transparent 60%), radial-gradient(45% 35% at 70% 78%, rgba(26,26,26,0.06) 0%, transparent 55%)",
        }}
      />

      {/* orbits stage */}
      <div className="relative h-[180px] w-[180px] sm:h-[200px] sm:w-[200px]">
        {/* orbit rings */}
        <div className="absolute inset-0 grid place-items-center">
          {/* ring 1 */}
          <motion.div
            className="absolute h-[150px] w-[150px] rounded-full border border-ink/10"
            style={{ transform: "rotateX(62deg) rotateZ(-18deg)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          />
          {/* ring 2 */}
          <motion.div
            className="absolute h-[118px] w-[118px] rounded-full border border-ink/10"
            style={{ transform: "rotateX(62deg) rotateZ(42deg)" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
          />
          {/* ring 3 */}
          <motion.div
            className="absolute h-[176px] w-[176px] rounded-full border border-ink/[0.07]"
            style={{ transform: "rotateX(62deg) rotateZ(78deg)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4.1, repeat: Infinity, ease: "linear" }}
          />

          {/* glowing core */}
          <div className="absolute h-3 w-3 rounded-full bg-ink shadow-[0_0_18px_rgba(26,26,26,0.45),0_0_36px_rgba(201,139,146,0.35)]" />
          <div className="absolute h-12 w-12 rounded-full bg-ink/5 blur-[14px]" />
        </div>

        {/* particles on orbits — use absolute + rotate to simulate orbit */}
        {/* orbit A particles */}
        <motion.div
          className="absolute inset-0"
          style={{ transform: "rotateX(62deg) rotateZ(-18deg)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink shadow-[0_0_10px_rgba(26,26,26,0.5)]" />
          <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-rose shadow-[0_0_10px_rgba(201,139,146,0.8)]" />
        </motion.div>

        <motion.div
          className="absolute inset-0"
          style={{ transform: "rotateX(62deg) rotateZ(42deg)" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/80 shadow-[0_0_10px_rgba(26,26,26,0.4)]" />
          <span className="absolute bottom-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#9a6b3f] shadow-[0_0_10px_rgba(154,107,63,0.6)]" />
        </motion.div>

        <motion.div
          className="absolute inset-0"
          style={{ transform: "rotateX(62deg) rotateZ(78deg)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4.1, repeat: Infinity, ease: "linear" }}
        >
          <span
            className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9),0_0_22px_rgba(201,139,146,0.45)]"
            style={{ border: "1.5px solid rgba(26,26,26,0.12)" }}
          />
          <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-ink/40" />
        </motion.div>
      </div>

      {/* labels */}
      <div className="relative z-10 text-center">
        <p className="lbl tracking-[0.22em] text-ink/45">{label}</p>
        <p className="mt-2 font-display text-[13px] font-semibold uppercase tracking-[0.12em] text-ink/70">
          {sublabel}
        </p>
        <div className="mx-auto mt-4 flex items-center justify-center gap-1">
          <span className="h-1 w-1 animate-[quantumDot_1.2s_ease-in-out_infinite] rounded-full bg-ink" />
          <span className="h-1 w-1 animate-[quantumDot_1.2s_ease-in-out_0.15s_infinite] rounded-full bg-ink/60" />
          <span className="h-1 w-1 animate-[quantumDot_1.2s_ease-in-out_0.3s_infinite] rounded-full bg-rose" />
        </div>
      </div>

      <style>{`
        @keyframes quantumDot {
          0%, 100% { transform: translateY(0); opacity: 1 }
          50% { transform: translateY(-3px); opacity: 0.7 }
        }
      `}</style>
    </div>
  )
}

/**
 * Full-screen overlay wrapper for initial app loading
 */
export function QuantumCloudLoaderOverlay({
  show,
  onDone,
}: {
  show: boolean
  onDone?: () => void
}) {
  const [visible, setVisible] = useState(show)

  useEffect(() => {
    if (show) setVisible(true)
    else {
      const t = setTimeout(() => setVisible(false), 420)
      return () => clearTimeout(t)
    }
  }, [show])

  if (!visible) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={() => !show && onDone?.()}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bone px-6"
        >
          <div className="w-full max-w-[560px]">
            <QuantumCloudLoader />
            <p className="mt-6 text-center text-[12px] tracking-wide text-ink/30">
              Second Floor, Azeet Plaza · Gorakhpur
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default QuantumCloudLoader
