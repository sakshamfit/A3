import { useEffect, useRef } from 'react'
import Reveal from '../components/Reveal'
import ReviewQuote from '../components/ReviewQuote'
import { useInView } from '../lib/useInView'
import { BUSINESS, IMAGES, METRICS, REVIEWS } from '../lib/site'

const AMENITIES = [
  {
    icon: 'solar:maximize-square-linear',
    label: 'Full-home scope',
    copy: 'Every room, including the ones nobody photographs.',
  },
  {
    icon: 'solar:bed-linear',
    label: 'Modular kitchens & wardrobes',
    copy: 'Built in our workshop, fitted on site to the millimetre.',
  },
  {
    icon: 'solar:tag-price-linear',
    label: 'Fixed estimates',
    copy: 'One agreed price, itemised before work begins.',
  },
] as const

/**
 * Section 3 — Philosophy.
 *
 * 12-column grid: 3-column sticky metrics rail, a 2-column spacer, then the
 * 7-column narrative column holding the image, the amenity row and the reviews.
 * The figure keeps the source's `cursor-none` and a backdrop-blurred caption.
 */
export default function Philosophy() {
  const { ref: imageRef, inView: imageInView } = useInView<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: '0px 0px -8% 0px',
  })
  const figureRef = useRef<HTMLElement | null>(null)
  const cursorRef = useRef<HTMLDivElement | null>(null)

  /* Bespoke cursor — only on hover-capable pointers. */
  useEffect(() => {
    const figure = figureRef.current
    const cursor = cursorRef.current
    if (!figure || !cursor) return
    if (typeof window.matchMedia !== 'function') return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const onMove = (event: PointerEvent) => {
      const rect = figure.getBoundingClientRect()
      cursor.style.transform = `translate3d(${event.clientX - rect.left}px, ${
        event.clientY - rect.top
      }px, 0) translate(-50%, -50%)`
    }
    const onEnter = () => {
      cursor.style.opacity = '1'
    }
    const onLeave = () => {
      cursor.style.opacity = '0'
    }

    figure.addEventListener('pointermove', onMove)
    figure.addEventListener('pointerenter', onEnter)
    figure.addEventListener('pointerleave', onLeave)
    return () => {
      figure.removeEventListener('pointermove', onMove)
      figure.removeEventListener('pointerenter', onEnter)
      figure.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <section id="philosophy" className="bg-bone px-6 py-24 sm:px-10 md:px-14 md:py-32">
      <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-8">
        {/* Sticky metrics rail */}
        <aside className="md:col-span-3 md:sticky md:top-32 md:self-start">
          <p className="label text-ink/40">Studio in numbers</p>
          <div className="mt-8 border-t border-ink/10">
            {METRICS.map((metric) => (
              <div key={metric.value} className="border-b border-ink/10 py-6">
                <iconify-icon
                  icon={metric.icon}
                  width="20"
                  height="20"
                  class="text-ink/45"
                />
                <p className="mt-5 flex items-baseline gap-2 text-3xl font-light tracking-tight text-ink">
                  {metric.value}
                  <span className="text-[11px] uppercase tracking-[0.2em] text-ink/40">
                    {metric.suffix}
                  </span>
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/55">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </aside>

        {/* Spacer (source layout keeps two empty columns here) */}
        <div className="hidden md:col-span-2 md:block" aria-hidden="true" />

        {/* Narrative column */}
        <div className="md:col-span-7">
          <Reveal>
            <p className="label text-ink/40">Our philosophy</p>
            <h2 className="mt-6 max-w-2xl text-3xl font-light leading-[1.08] tracking-tighter text-ink sm:text-4xl md:text-5xl">
              One studio from the first sketch to the{' '}
              <span className="font-serif italic font-light">last handle</span>.
            </h2>
          </Reveal>

          <Reveal delay={80} className="mt-8 max-w-xl space-y-5 text-[15px] leading-relaxed text-ink/65">
            <p>
              A3 began on the second floor of Azeet Plaza with a simple
              frustration: good drawings kept falling apart on site. So we built
              the workshop, kept the architect in-house, and stopped handing our
              work to anybody else.
            </p>
            <p>
              Today the same team that measures your rooms also makes your
              shutters, sets your stone and returns after the monsoon to check
              the hinges. Design and build, under one roof in Gorakhpur.
            </p>
          </Reveal>

          {/* Image — cursor-none + backdrop-blurred caption */}
          <div ref={imageRef} className="mt-12">
            <figure
              ref={figureRef}
              className={`image-reveal group relative cursor-none overflow-hidden bg-stone-200 ${
                imageInView ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-700 ease-smooth`}
            >
              <img
                src={IMAGES.philosophy}
                alt="Detail of a finished interior with layered lighting and natural stone"
                loading="lazy"
                decoding="async"
                className={`h-[420px] w-full object-cover transition-transform duration-[1200ms] ease-smooth sm:h-[520px] md:h-[620px] ${
                  imageInView ? 'scale-100' : 'scale-105'
                }`}
              />
              <figcaption className="absolute bottom-6 left-6 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white backdrop-blur-md">
                Arched passage · Terracotta Villa
              </figcaption>
              <div
                ref={cursorRef}
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 hidden h-24 w-24 items-center justify-center rounded-full border border-white/30 bg-white/10 text-[10px] uppercase tracking-[0.24em] text-white opacity-0 backdrop-blur-md transition-opacity duration-500 md:flex"
              >
                View
              </div>
            </figure>
          </div>

          {/* Amenity row */}
          <Reveal delay={40} className="mt-10 grid gap-6 sm:grid-cols-3">
            {AMENITIES.map((amenity) => (
              <div key={amenity.label} className="border-t border-ink/10 pt-5">
                <iconify-icon
                  icon={amenity.icon}
                  width="20"
                  height="20"
                  class="text-ink/45"
                />
                <p className="mt-4 text-[13px] font-medium tracking-tight text-ink">
                  {amenity.label}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/55">
                  {amenity.copy}
                </p>
              </div>
            ))}
          </Reveal>

          {/* Reviews */}
          <Reveal delay={40} className="mt-20">
            <div className="flex flex-wrap items-end justify-between gap-4 border-t border-ink/10 pt-8">
              <div>
                <p className="label text-ink/40">Reviews</p>
                <p className="mt-4 flex items-center gap-3 text-2xl font-light tracking-tight text-ink">
                  {BUSINESS.rating}
                  <span className="flex items-center gap-0.5 text-ink/70">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <iconify-icon
                        key={star}
                        icon="solar:star-bold"
                        width="13"
                        height="13"
                      />
                    ))}
                  </span>
                  <span className="text-[13px] font-normal tracking-normal text-ink/50">
                    {BUSINESS.reviewCount} Google reviews
                  </span>
                </p>
              </div>
              <a
                href={BUSINESS.reviewsUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-ink/70 transition-colors duration-500 hover:text-ink"
              >
                <span className="link-underline">View all Google reviews</span>
                <iconify-icon
                  icon="solar:arrow-right-linear"
                  width="16"
                  height="16"
                  class="transition-transform duration-500 ease-smooth group-hover:translate-x-1"
                />
              </a>
            </div>

            <ul className="mt-8 space-y-6">
              {REVIEWS.map((review, i) => (
                <li key={i} className="border-b border-ink/10 pb-6 last:border-b-0">
                  <ReviewQuote review={review} />
                  <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-ink/35">
                    {review.meta}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
