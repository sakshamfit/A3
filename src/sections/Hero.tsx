import Reveal from '../components/Reveal'
import { BUSINESS, IMAGES } from '../lib/site'

/**
 * Section 2 — Hero.
 *
 * Layers: image (absolute inset-0, object-bottom, opacity-70) → gradient
 * overlay → content (relative z-10). The image sits over a near-black section
 * background; the serif italic span carries the studio's signature word.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[95vh] flex-col justify-end overflow-hidden bg-obsidian"
    >
      <img
        src={IMAGES.hero}
        alt="Sunlit living room with layered natural materials"
        className="absolute inset-0 h-full w-full object-cover object-bottom opacity-70"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/85 via-obsidian/45 to-obsidian" />
      <div className="absolute inset-0 bg-obsidian/20" />

      {/* Content */}
      <div className="relative z-10 px-6 pb-12 pt-32 sm:px-10 sm:pb-16 md:px-14 md:pt-40">
        <Reveal className="flex flex-wrap items-center gap-x-6 gap-y-3 text-white/70">
          <span className="label flex items-center gap-2">
            <iconify-icon icon="solar:star-bold" width="13" height="13" class="text-white/70" />
            {BUSINESS.rating} · {BUSINESS.reviewCount} Google reviews
          </span>
          <span className="hidden h-3 w-px bg-white/25 sm:block" />
          <span className="label">Interior design &amp; build</span>
          <span className="hidden h-3 w-px bg-white/25 sm:block" />
          <span className="label">{BUSINESS.locality}</span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-8 max-w-5xl text-5xl font-light leading-[0.95] tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Interiors
            <br />
            <span className="font-serif italic font-light">sculpted</span> around
            <br />
            how you live.
          </h1>
        </Reveal>

        <Reveal delay={160} className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-sm leading-relaxed text-white/65 md:text-[15px]">
            {BUSINESS.description} A studio of designers, an architect and
            craftsmen working out of Azeet Plaza, Gorakhpur — for homes and
            businesses across Uttar Pradesh.
          </p>
          <a
            href={BUSINESS.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex shrink-0 items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] text-white"
          >
            <span className="link-underline">Book a consultation</span>
            <iconify-icon
              icon="solar:arrow-right-linear"
              width="18"
              height="18"
              class="transition-transform duration-500 ease-smooth group-hover:translate-x-1"
            />
          </a>
        </Reveal>
      </div>

      {/* Footer of hero */}
      <div className="relative z-10 border-t border-white/20">
        <div className="flex flex-col gap-6 px-6 py-6 sm:px-10 md:flex-row md:items-center md:justify-between md:px-14">
          <p className="max-w-2xl text-[13px] leading-relaxed text-white/55">
            Residential interiors, retail fit-outs and architecture — drawn,
            built and finished by one studio. Free design consultation, seven
            days a week until 10 pm.
          </p>
          <div className="flex flex-wrap items-center gap-6 md:gap-8">
            <a
              href="#projects"
              className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] text-white"
            >
              <span className="link-underline">View the collection</span>
              <iconify-icon
                icon="solar:alt-arrow-down-linear"
                width="16"
                height="16"
                class="transition-transform duration-500 ease-smooth group-hover:translate-y-0.5"
              />
            </a>
            <a
              href={BUSINESS.phoneHref}
              className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] text-white"
            >
              <span className="link-underline">{BUSINESS.phoneDisplay}</span>
              <iconify-icon
                icon="solar:phone-calling-linear"
                width="16"
                height="16"
                class="transition-transform duration-500 ease-smooth group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
