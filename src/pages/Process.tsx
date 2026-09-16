import Transform from "@/sections/Transform"
import Reviews from "@/sections/Reviews"
import { Link } from "react-router-dom"

/**
 * Process — isolated pinned section, so scroll never collides.
 * Transform (shell → finished) lives alone here, with Reviews below it (also pinned)
 * but separated by a breathing band, so z-index never overlaps.
 */
export default function Process() {
  return (
    <>
      <section className="bg-bone pt-[calc(var(--nav-h)+36px)]">
        <div className="wrap pb-8">
          <p className="lbl text-ink/40">Process · Index 04</p>
          <h1 className="headline mt-3 max-w-[16ch] text-ink">
            Shell to <span className="accent">finished</span>
          </h1>
          <p className="lede mt-4 max-w-[56ch] text-ink/60">
            One apartment, 14 weeks apart. This page isolates the pinned wipe so
            it never overlaps the stack or coverflow. Scroll to pull the finished
            room across the bare shell.
          </p>
        </div>
      </section>

      <Transform />

      {/* breathing band between two pinned sections */}
      <section className="band bg-bone border-y border-ink/10">
        <div className="wrap">
          <p className="lbl text-ink/40">Why one team of developers</p>
          <h2 className="headline mt-3 max-w-[20ch] text-ink">
            Drawn, made and <span className="accent">built</span> under one roof
          </h2>
          <p className="copy mt-4 max-w-[52ch] text-[13.5px] text-ink/60">
            Drawings that the site can actually build from, joinery made in our
            workshop while the shell is still curing, then hardware, light and a
            full clean. No handover to a third party.
          </p>
        </div>
      </section>

      <Reviews />

      <section className="border-t border-ink/10 bg-blush">
        <div className="wrap flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="copy max-w-[52ch] text-[13px] text-ink/60">
            Pinned tracks are now isolated per page — no more 700vh of stacked
            stickies on one index.
          </p>
          <Link to="/contact" className="btn">
            Book a consultation
            <span className="ar" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  )
}
