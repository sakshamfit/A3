import { gsap, SplitText, useGsap } from '../lib/gsap'
import { BUSINESS, IMAGES, METRICS } from '../lib/site'

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
 * Section 2 — Philosophy.
 *
 * 12-column grid: sticky metrics rail (3) · spacer (2) · narrative (7).
 * GSAP: figure clip-path reveal, per-word opacity scrub across the narrative,
 * counting metrics and rules that draw themselves in.
 */
export default function Philosophy() {
  const scope = useGsap<HTMLElement>((el, { reduced }) => {
    const figure = el.querySelector<HTMLElement>('[data-philosophy-figure]')
    const prose = el.querySelector<HTMLElement>('[data-scrub-words]')

    if (reduced) {
      gsap.set(el.querySelectorAll('[data-reveal]'), { opacity: 1, y: 0 })
      if (figure) gsap.set(figure, { clipPath: 'inset(0% 0% 0% 0%)' })
      return
    }

    if (figure) {
      gsap.fromTo(
        figure,
        { clipPath: 'inset(0% 0% 100% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: figure, start: 'top 88%', end: 'top 35%', scrub: true },
        },
      )
    }
    gsap.to('[data-philosophy-image]', {
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: figure, start: 'top bottom', end: 'bottom top', scrub: true },
    })

    if (prose) {
      SplitText.create(prose, {
        type: 'words',
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0.16 },
            {
              opacity: 1,
              stagger: 0.06,
              ease: 'none',
              scrollTrigger: {
                trigger: prose,
                start: 'top 82%',
                end: 'bottom 55%',
                scrub: true,
              },
            },
          ),
      })
    }

    el.querySelectorAll<HTMLElement>('[data-count]').forEach((node) => {
      const target = Number(node.dataset.count)
      const decimals = Number(node.dataset.decimals ?? 0)
      if (Number.isNaN(target)) return
      const proxy = { value: 0 }
      gsap.to(proxy, {
        value: target,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: node, start: 'top 90%', once: true },
        onUpdate: () => {
          node.textContent = proxy.value.toFixed(decimals)
        },
      })
    })

    gsap.fromTo(
      el.querySelectorAll('[data-rule]'),
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 75%', once: true },
      },
    )

  }, [])

  return (
    <section
      ref={scope}
      id="philosophy"
      className="band bg-bone"
    >
      <div className="wrap grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-8">
        {/* Sticky metrics rail */}
        <aside className="md:col-span-3 md:sticky md:top-32 md:self-start">
          <p data-reveal className="lbl text-ink/40">
            The studio in numbers
          </p>
          <div className="mt-8">
            {METRICS.map((metric, i) => (
              <div key={metric.value} className="pb-7">
                <hr data-rule className="rule" />
                <div className="flex items-start gap-4 pt-6">
                  <iconify-icon
                    icon={metric.icon}
                    width="20"
                    height="20"
                    class="mt-1 shrink-0 text-ink/45"
                  />
                  <div>
                    <p className="num flex items-baseline gap-2 text-[clamp(26px,2.6vw,38px)] font-extrabold leading-none tracking-display text-ink">
                      {i < 2 ? (
                        <span
                          data-count={i === 0 ? '4.8' : '174'}
                          data-decimals={i === 0 ? '1' : '0'}
                        >
                          {metric.value}
                        </span>
                      ) : (
                        metric.value
                      )}
                      <span className="lbl text-ink/40">{metric.suffix}</span>
                    </p>
                    <p className="copy mt-3 text-[13px] text-ink/60">{metric.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Spacer */}
        <div className="hidden md:col-span-2 md:block" aria-hidden="true" />

        {/* Narrative */}
        <div className="md:col-span-7">
          <p data-reveal className="lbl text-ink/40">
            Our philosophy
          </p>
          <h2 data-reveal className="headline mt-6 max-w-[22ch] text-ink">
            One studio from the first sketch to the <span className="accent">last handle</span>
          </h2>

          <div className="mt-8 space-y-5">
            <p data-scrub-words className="lede text-ink">
              A3 began on the second floor of Azeet Plaza with a simple frustration: good
              drawings kept falling apart on site. So we built the workshop, kept the architect
              in-house, and stopped handing our work to anybody else.
            </p>
            <p data-reveal className="copy text-[15px]">
              Today the same team that measures your rooms also makes your shutters, sets your
              stone and returns after the monsoon to check the hinges. Design and build, under
              one roof in Gorakhpur — residential, retail and everything in between.
            </p>
          </div>

          {/* Image with clip-path reveal */}
          <figure
            data-philosophy-figure
            className="image-reveal relative mt-12 cursor-none overflow-hidden bg-stone-200"
          >
            <img
              data-philosophy-image
              src={IMAGES.philosophy}
              alt="Detail of a finished interior: curved plaster meeting fluted oak, with a honed travertine ledge"
              loading="lazy"
              decoding="async"
              className="h-[420px] w-full scale-[1.08] object-cover sm:h-[520px] md:h-[600px]"
            />
            <figcaption className="absolute bottom-6 left-6 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
              <span className="lbl text-white">Limewash · Smoked oak · Travertine</span>
            </figcaption>
          </figure>

          {/* Amenities */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {AMENITIES.map((amenity) => (
              <div key={amenity.label} data-reveal className="pt-5">
                <hr data-rule className="rule" />
                <iconify-icon
                  icon={amenity.icon}
                  width="20"
                  height="20"
                  class="mt-5 text-ink/45"
                />
                <p className="subhead mt-4 text-[15px]">{amenity.label}</p>
                <p className="copy mt-2 text-[13px]">{amenity.copy}</p>
              </div>
            ))}
          </div>

          <div data-reveal className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href={BUSINESS.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn"
            >
              Start a project
              <span className="ar" aria-hidden="true">
                →
              </span>
            </a>
            <a href={BUSINESS.mapsUrl} target="_blank" rel="noreferrer" className="tlink">
              Visit the studio
              <span className="ar" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
