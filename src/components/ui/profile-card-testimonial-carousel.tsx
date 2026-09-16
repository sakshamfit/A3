"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export type ProfileCard = {
  id?: string
  name: string
  role: string
  avatar: string
  avatarAlt?: string
  quote: string
  highlights?: string[]
  bio?: string
  meta?: string
  location?: string
  experience?: string
  socials?: {
    instagram?: string
    linkedin?: string
    twitter?: string
    github?: string
    globe?: string
  }
  tags?: string[]
}

export interface ProfileCardCarouselProps {
  cards: ProfileCard[]
  className?: string
  autoPlay?: boolean
  interval?: number
}

/**
 * Profile Card Testimonial Carousel — Arunachalam inspired
 * Responsive testimonial carousel featuring profile cards with avatars,
 * descriptions and social links. Smooth fade/slide, bottom navigation,
 * light theme (bone/bone) tuned for A3.
 */
export function ProfileCardTestimonialCarousel({
  cards,
  className,
  autoPlay = true,
  interval = 5200,
}: ProfileCardCarouselProps) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<number | null>(null)

  const next = useCallback(() => {
    setActive((p) => (p + 1) % cards.length)
  }, [cards.length])

  const prev = useCallback(() => {
    setActive((p) => (p - 1 + cards.length) % cards.length)
  }, [cards.length])

  const goTo = useCallback((i: number) => setActive(i), [])

  useEffect(() => {
    if (!autoPlay || paused || cards.length <= 1) return
    timerRef.current = window.setInterval(next, interval)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [autoPlay, paused, interval, next, cards.length])

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [next, prev])

  if (!cards.length) return null
  const current = cards[active]

  return (
    <div
      className={cn("w-full", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Meet the developers"
    >
      <div className="relative mx-auto w-full max-w-[1080px]">
        {/* main card */}
        <div className="relative overflow-hidden rounded-[28px] border border-ink/10 bg-white shadow-[0_18px_50px_rgba(26,26,26,0.08)]">
          {/* top soft gradient */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-ink/10 to-transparent" />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.name + active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-0 md:grid-cols-[380px_1fr]"
            >
              {/* avatar pane */}
              <div className="relative bg-blush p-6 sm:p-8">
                <div className="relative aspect-[4/4.2] overflow-hidden rounded-[20px] bg-shell">
                  <img
                    src={current.avatar}
                    alt={current.avatarAlt || current.name}
                    className="h-full w-full object-cover object-top"
                    loading={active === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-inset ring-white/20" />
                  {/* floating badge */}
                  <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-inkdeep/55 px-3 py-1.5 backdrop-blur-md">
                    <span className="lbl text-white/85">
                      {String(active + 1).padStart(2, "0")} /{" "}
                      {String(cards.length).padStart(2, "0")}
                    </span>
                  </div>
                  {/* bottom meta chip */}
                  {(current.location || current.experience) && (
                    <div className="absolute inset-x-4 bottom-4 flex items-center gap-2">
                      {current.location && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-ink shadow">
                          <iconify-icon icon="solar:map-point-linear" width="14" height="14" />
                          {current.location}
                        </span>
                      )}
                      {current.experience && (
                        <span className="hidden items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[12px] font-medium text-bone shadow sm:inline-flex">
                          {current.experience}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* name below image on mobile, hidden on desktop (repeated in right pane) */}
                <div className="mt-6 md:hidden">
                  <h3 className="font-display text-[20px] font-extrabold uppercase tracking-display text-ink">
                    {current.name}
                  </h3>
                  <p className="lbl mt-1 text-ink/45">{current.role}</p>
                </div>

                {/* tags */}
                {current.tags && current.tags.length > 0 && (
                  <div className="mt-5 hidden flex-wrap gap-2 md:flex">
                    {current.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-ink/10 bg-white px-3 py-1 text-[11px] font-medium tracking-wide text-ink/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* content pane */}
              <div className="flex flex-col p-6 sm:p-8 md:p-9">
                <div className="hidden md:block">
                  <h3 className="font-display text-[26px] font-extrabold uppercase tracking-display text-ink">
                    {current.name}
                  </h3>
                  <p className="lbl mt-1.5 text-ink/45">{current.role}</p>
                  {current.meta && (
                    <p className="lbl mt-1 text-ink/30">{current.meta}</p>
                  )}
                </div>

                {/* quote */}
                <div className="relative mt-2 md:mt-6">
                  <iconify-icon
                    icon="solar:chat-round-linear"
                    width="28"
                    height="28"
                    class="text-ink/10"
                  />
                  <blockquote className="mt-3 font-display text-[18px] font-medium leading-[1.45] tracking-[-0.015em] text-ink sm:text-[20px]">
                    “{current.quote}”
                  </blockquote>
                  {current.bio && (
                    <p className="copy mt-4 max-w-[52ch] text-[14px] leading-[1.7] text-ink/60">
                      {current.bio}
                    </p>
                  )}
                </div>

                {/* socials */}
                {current.socials && (
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    {current.socials.instagram && (
                      <a
                        href={current.socials.instagram}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${current.name} on Instagram`}
                        className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-white text-ink/70 transition hover:border-ink/20 hover:text-ink"
                      >
                        <iconify-icon icon="solar:hashtag-circle-linear" width="16" height="16" />
                      </a>
                    )}
                    {current.socials.linkedin && (
                      <a
                        href={current.socials.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${current.name} on LinkedIn`}
                        className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-white text-ink/70 transition hover:border-ink/20 hover:text-ink"
                      >
                        <iconify-icon icon="solar:link-circle-linear" width="16" height="16" />
                      </a>
                    )}
                    {current.socials.twitter && (
                      <a
                        href={current.socials.twitter}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${current.name} on Twitter`}
                        className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-white text-ink/70 transition hover:border-ink/20 hover:text-ink"
                      >
                        <iconify-icon icon="solar:plain-linear" width="16" height="16" />
                      </a>
                    )}
                    {current.socials.github && (
                      <a
                        href={current.socials.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${current.name} on GitHub`}
                        className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-white text-ink/70 transition hover:border-ink/20 hover:text-ink"
                      >
                        <iconify-icon icon="solar:code-circle-linear" width="16" height="16" />
                      </a>
                    )}
                    {current.socials.globe && (
                      <a
                        href={current.socials.globe}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${current.name} website`}
                        className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-white text-ink/70 transition hover:border-ink/20 hover:text-ink"
                      >
                        <iconify-icon icon="solar:global-linear" width="16" height="16" />
                      </a>
                    )}
                    <span className="ml-2 hidden items-center gap-2 text-[12px] tracking-wide text-ink/30 sm:inline-flex">
                      <span className="h-px w-6 bg-ink/10" aria-hidden="true" />
                      Hover to pause autoplay
                    </span>
                  </div>
                )}

                {/* bottom navigation inside card */}
                <div className="mt-auto flex items-center justify-between gap-4 border-t border-ink/10 pt-6">
                  <div className="flex items-center gap-2">
                    {cards.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Show ${cards[i].name}`}
                        aria-current={i === active ? "true" : undefined}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-400",
                          i === active ? "w-8 bg-ink" : "w-2.5 bg-ink/15 hover:bg-ink/30"
                        )}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={prev}
                      aria-label="Previous"
                      className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-white text-ink transition hover:bg-bone"
                    >
                      <iconify-icon icon="solar:arrow-left-linear" width="16" height="16" />
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      aria-label="Next"
                      className="grid h-9 w-9 place-items-center rounded-full bg-ink text-bone transition hover:bg-ink/90"
                    >
                      <iconify-icon icon="solar:arrow-right-linear" width="16" height="16" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* avatars strip — quick jump */}
        <div className="mt-6 flex justify-center gap-3">
          {cards.map((card, i) => (
            <button
              key={card.name}
              onClick={() => goTo(i)}
              className={cn(
                "group relative h-12 w-12 overflow-hidden rounded-full border-2 bg-blush p-0.5 transition",
                i === active ? "border-ink" : "border-transparent hover:border-ink/20"
              )}
              aria-label={`Go to ${card.name}`}
              aria-current={i === active ? "true" : undefined}
            >
              <img
                src={card.avatar}
                alt=""
                aria-hidden="true"
                className={cn(
                  "h-full w-full rounded-full object-cover transition",
                  i === active ? "grayscale-0" : "grayscale-[35%] group-hover:grayscale-0"
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfileCardTestimonialCarousel
