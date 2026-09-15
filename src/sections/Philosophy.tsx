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
      <div className="wrap grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
        {/* Sticky metrics rail */}
        <aside className="md:col-span-3 md:sticky md:top-24 md:self-start">
          <p data-reveal className="lbl text-ink/40">
            The studio in numbers
          </p>
          <div className="mt-6">
            {METRICS.map((metric, i) => (
              <div key={metric.value} className="pb-5">
                <hr data-rule className="rule" />
                <div className="flex items-start gap-3.5 pt-4">
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
                    <p className="copy mt-2 text-[12.5px] text-ink/60">{metric.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Narrative — prose and the amenity list share the first row so the
            measure never leaves half a column empty; the figure runs full width
            underneath. */}
        <div className="md:col-span-9 md:pl-2">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p data-reveal className="lbl text-ink/40">
                Our philosophy
              </p>
              <h2 data-reveal className="headline mt-4 max-w-[22ch] text-ink">
                One studio from the first sketch to the <span className="accent">last handle</span>
              </h2>

              <div className="mt-6 space-y-4">
                <p data-scrub-words className="lede text-ink">
                  A3 began on the second floor of Azeet Plaza with a simple frustration: good
                  drawings kept falling apart on site. So we built the workshop, kept the
                  architect in-house, and stopped handing our work to anybody else.
                </p>
                <p data-reveal className="copy text-[14.5px]">
                  Today the same team that measures your rooms also makes your shutters, sets your
                  stone and returns after the monsoon to check the hinges. Design and build, under
                  one roof in Gorakhpur — residential, retail and everything in between.
                </p>
              </div>

              <div data-reveal className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
                <a href={BUSINESS.whatsapp} target="_blank" rel="noreferrer" className="btn">
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

            {/* Amenities */}
            <div className="lg:col-span-5">
              {AMENITIES.map((amenity) => (
                <div key={amenity.label} data-reveal className="pb-4">
                  <hr data-rule className="rule" />
                  <div className="flex items-start gap-4 pt-4">
                    <iconify-icon
                      icon={amenity.icon}
                      width="19"
                      height="19"
                      class="mt-0.5 shrink-0 text-ink/45"
                    />
                    <div>
                      <p className="subhead text-[14.5px]">{amenity.label}</p>
                      <p className="copy mt-1.5 text-[12.5px]">{amenity.copy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image with clip-path reveal */}
          <figure
            data-philosophy-figure
            className="image-reveal relative mt-8 cursor-none overflow-hidden bg-blush"
          >
            <img
              data-philosophy-image
              src={IMAGES.philosophy}
              alt="Detail of a finished interior: curved plaster meeting fluted oak, with a honed travertine ledge"
              loading="lazy"
              decoding="async"
              className="h-[320px] w-full scale-[1.08] object-cover sm:h-[400px] md:h-[440px]"
            />
            <figcaption className="absolute bottom-6 left-6 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
              <span className="lbl text-white">Limewash · Smoked oak · Travertine</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
