import { useRef, useState } from 'react'
import Reveal from '../components/Reveal'
import { BUSINESS, RESIDENCES } from '../lib/site'

/**
 * Section 4 — Featured Residences.
 *
 * A sticky "Current Availability" rail with L/R arrows drives the list below:
 * each row is a `group` with a hairline top border that warms to #F9F9F7 on
 * hover, info on the left (4 cols) and the image on the right (8 cols) with the
 * source's 1000ms scale and stone overlay.
 */
export default function Residences() {
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])
  const [active, setActive] = useState(0)

  const jump = (direction: 1 | -1) => {
    const next = (active + direction + RESIDENCES.length) % RESIDENCES.length
    setActive(next)
    itemRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section id="projects" className="bg-bone pb-24 md:pb-32">
      <div className="px-6 pt-24 sm:px-10 md:px-14 md:pt-32">
        <Reveal className="flex flex-col gap-8 pb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label text-ink/40">Selected work</p>
            <h2 className="mt-6 text-3xl font-light leading-[1.05] tracking-tighter text-ink sm:text-4xl md:text-5xl">
              Featured <span className="font-serif italic font-light">Residences</span>
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink/60">
            Apartments, duplexes and workspaces delivered end to end — drawings,
            joinery, finishes and the after-service visit nobody else offers.
          </p>
        </Reveal>
      </div>

      {/* Sticky header-style rail */}
      <div className="sticky top-0 z-30 border-y border-ink/10 bg-bone/85 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 px-6 py-4 sm:px-10 md:px-14">
          <p className="label text-ink/50">Current availability</p>
          <div className="flex items-center gap-5 sm:gap-7">
            <span className="text-[11px] tabular-nums tracking-[0.2em] text-ink/40">
              {RESIDENCES[active].index} / {String(RESIDENCES.length).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => jump(-1)}
                aria-label="Previous residence"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors duration-500 hover:bg-ink hover:text-bone"
              >
                <iconify-icon icon="solar:arrow-left-linear" width="16" height="16" />
              </button>
              <button
                type="button"
                onClick={() => jump(1)}
                aria-label="Next residence"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors duration-500 hover:bg-ink hover:text-bone"
              >
                <iconify-icon icon="solar:arrow-right-linear" width="16" height="16" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ul className="px-6 sm:px-10 md:px-14">
        {RESIDENCES.map((residence, i) => (
          <li
            key={residence.title}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            className={`group border-t border-ink/10 transition-colors duration-700 hover:bg-shell ${
              active === i ? 'bg-shell' : ''
            }`}
          >
            <div className="grid gap-6 py-8 md:grid-cols-12 md:gap-8 md:py-12">
              {/* Info */}
              <div className="md:col-span-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-[11px] tabular-nums tracking-[0.2em] text-ink/35">
                    {residence.index}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-ink/35">
                    {residence.year}
                  </span>
                </div>

                <h3 className="mt-4 text-2xl font-light leading-tight tracking-tight text-ink md:text-[28px]">
                  {residence.title}
                </h3>
                <p className="mt-2 text-[13px] text-ink/50">{residence.location}</p>
                <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-ink/65">
                  {residence.summary}
                </p>

                <ul className="mt-7 space-y-3">
                  {[
                    { icon: 'solar:maximize-square-linear', label: residence.area },
                    { icon: 'solar:bed-linear', label: residence.config },
                    { icon: 'solar:tag-price-linear', label: residence.price },
                  ].map((fact) => (
                    <li key={fact.label} className="flex items-center gap-3">
                      <iconify-icon
                        icon={fact.icon}
                        width="18"
                        height="18"
                        class="text-ink/40"
                      />
                      <span className="text-[13px] text-ink/60">{fact.label}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={BUSINESS.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link mt-8 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] text-ink"
                >
                  <span className="link-underline">Enquire about this home</span>
                  <iconify-icon
                    icon="solar:arrow-right-linear"
                    width="16"
                    height="16"
                    class="transition-transform duration-500 ease-smooth group-hover/link:translate-x-1"
                  />
                </a>
              </div>

              {/* Image */}
              <div className="md:col-span-8">
                <div className="relative overflow-hidden bg-stone-200">
                  <img
                    src={residence.image}
                    alt={`${residence.title} — ${residence.location}`}
                    loading="lazy"
                    decoding="async"
                    className="h-[260px] w-full object-cover grayscale-[20%] transition-all duration-1000 ease-smooth group-hover:scale-105 group-hover:grayscale-0 sm:h-[340px] md:h-[430px]"
                  />
                  {/* Stone overlay, transparent by default */}
                  <div className="pointer-events-none absolute inset-0 bg-stone-900/0 transition-colors duration-700 group-hover:bg-stone-900/5" />
                </div>
              </div>
            </div>
          </li>
        ))}
        <li className="border-t border-ink/10" />
      </ul>
    </section>
  )
}
