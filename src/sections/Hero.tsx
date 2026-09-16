import { gsap, SplitText, useGsap } from '../lib/gsap'
import { BUSINESS, IMAGES } from '../lib/site'

const HERO_FACTS = [
  { label: 'Developers', value: 'Azeet Plaza, Commercial Road' },
  { label: 'Locality', value: 'Taramandal, Gorakhpur 273001' },
  { label: 'Hours', value: 'Daily · 10 am – 10 pm' },
]

/**
 * Section 1 — Hero.
 *
 * Scroll choreography (GSAP + ScrollTrigger):
 *   · an entrance timeline lifts the headline out of line masks and settles the
 *     media from scale 1.18
 *   · on scroll the copy drifts up and fades while the image parallaxes and
 *     darkens, so the hero dissolves into the next band
 */
export default function Hero() {
  const scope = useGsap<HTMLElement>((el, { reduced }) => {
    const heading = el.querySelector<HTMLElement>('[data-hero-heading]')
    const copy = el.querySelector<HTMLElement>('[data-hero-copy]')
    const media = el.querySelector<HTMLElement>('[data-hero-media]')
    const overlay = el.querySelector<HTMLElement>('[data-hero-overlay]')

    if (!heading || !copy || !media || !overlay) return

    const showEverything = () => {
      gsap.set(el.querySelectorAll('[data-reveal]'), { opacity: 1, y: 0 })
      gsap.set([heading, media], { opacity: 1 })
      gsap.set(media, { scale: 1 })
    }

    if (reduced) {
      showEverything()
      return
    }

    /* Scrub: copy lifts and fades, image parallaxes and the overlay deepens */
    gsap.to(copy, {
      y: -110,
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    })
    gsap.to(media.querySelector('img'), {
      yPercent: 14,
      scale: 1.06,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    })
    gsap.to(overlay, {
      opacity: 0.75,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    })
    gsap.to('[data-hero-rail]', {
      y: 40,
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    })

    try {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(
        media,
        { opacity: 0, scale: 1.14 },
        { opacity: 1, scale: 1, duration: 1.7, ease: 'power2.out' },
      ).to(
        el.querySelectorAll('[data-reveal]'),
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 },
        0.45,
      )

      /* autoSplit re-splits after the fonts swap, so the line masks always
         match the rendered line boxes. */
      SplitText.create(heading, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) => {
          gsap.set(heading, { opacity: 1 })
          return gsap.from(self.lines, {
            yPercent: 115,
            duration: 1.15,
            stagger: 0.09,
            ease: 'power4.out',
            delay: 0.15,
          })
        },
      })

      /* Safety net: if the split produced no line masks (no layout yet, or a
         browser that measures oddly), make sure the headline is not left
         hidden by the `data-reveal="mask"` rule. */
      if (!heading.querySelector('[class*="-mask"]')) {
        gsap.set(heading, { opacity: 1 })
      }
    } catch {
      console.warn('A3: hero entrance animation unavailable — content shown as-is.')
      showEverything()
    }

    /* Failsafe: the intro is decorative, the copy is not. If anything above
       left it hidden, show it after a beat. */
    const failsafe = window.setTimeout(() => {
      el.querySelectorAll<HTMLElement>('[data-reveal]').forEach((node) => {
        if (Number(window.getComputedStyle(node).opacity) < 0.9) {
          gsap.set(node, { opacity: 1, y: 0 })
        }
      })
      if (Number(window.getComputedStyle(heading).opacity) < 0.9) {
        gsap.set(heading, { opacity: 1 })
      }
      gsap.set(media, { opacity: 1, scale: 1 })
    }, 2000)

    return () => window.clearTimeout(failsafe)
  }, [])

  return (
    <section
      ref={scope}
      id="top"
      className="relative flex min-h-[82vh] flex-col justify-end overflow-hidden bg-inkdeep"
    >
      {/* Media layers: image → gradient → content */}
      <div data-hero-media className="absolute inset-0">
        <img
          data-hero-image
          src={IMAGES.hero}
          alt="Double-height living room at golden hour with oak slat wall and travertine floor"
          className="h-full w-full object-cover object-bottom opacity-70"
          decoding="async"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-inkdeep/85 via-inkdeep/40 to-inkdeep" />
      <div data-hero-overlay className="absolute inset-0 bg-inkdeep/10" />

      <div className="relative z-10 flex flex-1 flex-col justify-end">
        <div className="wrap pt-20 md:pt-24">
          <div data-reveal="fade" className="flex flex-wrap items-center gap-x-6 gap-y-3 text-chalk/70">
            <span className="lbl flex items-center gap-2">
              <iconify-icon icon="solar:star-bold" width="12" height="12" class="text-chalk/70" />
              {BUSINESS.rating} · {BUSINESS.reviewCount} Google reviews
            </span>
            <span className="hidden h-3 w-px bg-chalk/25 sm:block" />
            <span className="lbl">Interior design &amp; build</span>
            <span className="hidden h-3 w-px bg-chalk/25 sm:block" />
            <span className="lbl">{BUSINESS.locality}</span>
          </div>

          <h1 data-hero-heading data-reveal="mask" className="display mt-5 max-w-[18ch] text-bone">
            Interiors <span className="accent">sculpted</span> around how you live
          </h1>
          <p className="mt-4 max-w-[46ch] font-serif text-[clamp(15px,1.4vw,20px)] italic leading-snug text-chalk/70">
            {BUSINESS.name}
          </p>
        </div>

        <div data-hero-copy className="wrap mt-8 flex flex-col gap-6 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <p data-reveal className="lede text-chalk/70">
            {BUSINESS.description} Designed, drawn and built by our team of developers — for homes
            and businesses across Gorakhpur and nearby Uttar Pradesh.
          </p>
          <div data-reveal className="flex flex-wrap items-center gap-3">
            <a
              href={BUSINESS.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn on-ink"
            >
              Book a consultation
              <span className="ar" aria-hidden="true">
                →
              </span>
            </a>
            <a href="/works" className="btn btn--ghost on-ink">
              View the collection
            </a>
          </div>
        </div>
      </div>

      {/* Hero rail */}
      <div data-hero-rail className="relative z-10 border-t border-white/20">
        <div className="wrap grid grid-cols-2 gap-5 py-4 md:grid-cols-4">
          {HERO_FACTS.map((fact) => (
            <div key={fact.label}>
              <p className="lbl text-chalk/40">{fact.label}</p>
              <p className="copy mt-2 text-[13px] text-chalk/75">{fact.value}</p>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 md:justify-end">
            <a href={BUSINESS.phoneHref} className="lbl u num text-chalk/80">
              {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
