import { useRef, useState } from 'react'
import { gsap, useGsap } from '../lib/gsap'
import { BUSINESS, RESIDENCES } from '../lib/site'

/**
 * Section 3 — Featured Residences.
 *
 * A sticky "current availability" rail with working L/R arrows sits above a
 * list of project rows. GSAP draws each hairline in, lifts the rows as they
 * enter and parallaxes the imagery inside its frame; the zoom + grayscale
 * release stays on hover.
 */
export default function Residences() {
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])
  const [active, setActive] = useState(0)

  const scope = useGsap<HTMLElement>((el, { reduced }) => {
    if (reduced) {
      gsap.set(el.querySelectorAll('[data-reveal]'), { opacity: 1, y: 0 })
      return
    }

    el.querySelectorAll<HTMLElement>('[data-row]').forEach((row) => {
      const image = row.querySelector<HTMLElement>('[data-row-image]')
      const line = row.querySelector<HTMLElement>('[data-rule]')

      gsap.fromTo(
        row,
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 88%', once: true },
        },
      )

      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 92%', once: true },
          },
        )
      }

      if (image) {
        gsap.fromTo(
          image,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      }
    })
  }, [])

  const jump = (direction: 1 | -1) => {
    const next = (active + direction + RESIDENCES.length) % RESIDENCES.length
    setActive(next)
    itemRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section ref={scope} id="projects" className="bg-bone pb-16 md:pb-20">
      <div className="wrap pt-16 md:pt-20">
        <div className="flex flex-col gap-5 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-reveal className="lbl text-ink/40">
              Selected work
            </p>
            <h2 data-reveal className="headline mt-4 text-ink">
              Featured <span className="accent">Residences</span>
            </h2>
          </div>
          <p data-reveal className="lede text-ink/60">
            Apartments, duplexes and workspaces delivered end to end — drawings, joinery,
            finishes and the after-service visit nobody else offers.
          </p>
        </div>
      </div>

      {/* Sticky rail */}
      <div className="sticky top-0 z-30 border-y border-ink/10 bg-bone/85 backdrop-blur-md">
        <div className="wrap flex items-center justify-between gap-4 py-3">
          <p className="lbl text-ink/50">Current availability</p>
          <div className="flex items-center gap-5 sm:gap-7">
            <span className="lbl num text-ink/40">
              {RESIDENCES[active].index} / {String(RESIDENCES.length).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => jump(-1)}
                aria-label="Previous residence"
                className="icon-btn rounded-full"
              >
                <iconify-icon icon="solar:arrow-left-linear" width="16" height="16" />
              </button>
              <button
                type="button"
                onClick={() => jump(1)}
                aria-label="Next residence"
                className="icon-btn rounded-full"
              >
                <iconify-icon icon="solar:arrow-right-linear" width="16" height="16" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ul className="wrap">
        {RESIDENCES.map((residence, i) => (
          <li
            key={residence.title}
            data-row
            ref={(node) => {
              itemRefs.current[i] = node
            }}
            className={`group transition-colors duration-700 hover:bg-shell ${
              active === i ? 'bg-shell' : ''
            }`}
          >
            <hr data-rule className="rule" />
            <div className="grid gap-5 py-6 md:grid-cols-12 md:gap-8 md:py-8">
              <div className="md:col-span-4">
                <div className="flex items-baseline gap-4">
                  <span className="lbl num text-ink/35">{residence.index}</span>
                  <span className="lbl num text-ink/35">{residence.year}</span>
                </div>

                <h3 className="subhead mt-4 text-ink">{residence.title}</h3>
                <p className="lbl mt-3 text-ink/45">{residence.location}</p>
                <p className="copy mt-3 text-[13.5px]">{residence.summary}</p>

                <ul className="mt-5 space-y-2.5">
                  {[
                    { icon: 'solar:maximize-square-linear', label: residence.area },
                    { icon: 'solar:bed-linear', label: residence.config },
                    { icon: 'solar:tag-price-linear', label: residence.price },
                  ].map((fact) => (
                    <li key={fact.label} className="flex items-center gap-3">
                      <iconify-icon icon={fact.icon} width="18" height="18" class="text-ink/40" />
                      <span className="lbl text-ink/60">{fact.label}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={BUSINESS.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="tlink mt-6"
                >
                  Enquire about this home
                  <span className="ar" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>

              <div className="md:col-span-8">
                <div className="relative overflow-hidden bg-blush">
                  <img
                    data-row-image
                    src={residence.image}
                    alt={`${residence.title} — ${residence.location}`}
                    loading="lazy"
                    decoding="async"
                    className="h-[250px] w-full scale-[1.08] object-cover grayscale-[20%] transition-[filter] duration-1000 ease-smooth group-hover:grayscale-0 sm:h-[300px] md:h-[360px]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/5" />
                </div>
              </div>
            </div>
          </li>
        ))}
        <li aria-hidden="true">
          <hr className="rule" />
        </li>
      </ul>
    </section>
  )
}
