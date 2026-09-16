import { gsap, SplitText, revealIn, useGsap } from '../lib/gsap'
import { LayoutPreloader } from '@/components/ui/layout-preloader'
import { BUSINESS, IMAGES, METRICS } from '../lib/site'

const AMENITIES = [
  {
    icon: 'solar:maximize-square-linear',
    label: 'FULL-HOME SCOPE',
    copy: 'Every room, including the ones nobody photographs.',
  },
  {
    icon: 'solar:bed-linear',
    label: 'MODULAR KITCHENS & WARDROBES',
    copy: 'Built in our workshop, fitted on site to the millimetre.',
  },
  {
    icon: 'solar:tag-price-linear',
    label: 'FIXED ESTIMATES',
    copy: 'One agreed price, itemised before work begins.',
  },
] as const

/**
 * Section — Philosophy.
 *
 * Three full-width rows, so no column is ever left holding empty space:
 *   1. headline (left) beside the narrative (right)
 *   2. a compact metrics strip, three across
 *   3. the figure, carrying the amenity list as a translucent strip inside it
 *
 * GSAP: clip-path figure reveal, per-word opacity scrub on the narrative,
 * counting metrics and hairlines that draw themselves in.
 */
export default function Philosophy() {
  const scope = useGsap<HTMLElement>((el, { reduced }) => {
    const figure = el.querySelector<HTMLElement>('[data-philosophy-figure]')
    const prose = el.querySelector<HTMLElement>('[data-scrub-words]')

    const stopReveal = revealIn(el, reduced)

    if (reduced) {
      if (figure) gsap.set(figure, { clipPath: 'inset(0% 0% 0% 0%)' })
      return stopReveal
    }

    if (figure) {
      gsap.fromTo(
        figure,
        { clipPath: 'inset(0% 0% 100% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: figure, start: 'top 90%', end: 'top 40%', scrub: true },
        },
      )
    }
    /* the plate's own img, not the plate — scaling the wrapper would push the
       grain layer outside the figure's clip */
    gsap.to('[data-philosophy-plate] img', {
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
            { opacity: 0.18 },
            {
              opacity: 1,
              stagger: 0.06,
              ease: 'none',
              scrollTrigger: {
                trigger: prose,
                start: 'top 84%',
                end: 'bottom 58%',
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
        scrollTrigger: { trigger: node, start: 'top 92%', once: true },
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
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 78%', once: true },
      },
    )

    return stopReveal
  }, [])

  return (
    <section ref={scope} id="philosophy" className="band bg-bone">
      <div className="wrap">
        {/* Row 1 — headline beside the narrative */}
        <div className="grid gap-6 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <p data-reveal className="lbl text-ink/40">
              Our philosophy
            </p>
            <h2 data-reveal className="headline mt-4 max-w-[20ch] text-ink">
              One team of developers from the first sketch to the <span className="accent">last handle</span>
            </h2>
          </div>

          <div className="md:col-span-7 lg:pt-6">
            <p data-scrub-words className="lede text-ink">
              A3 began on the second floor of Azeet Plaza with a simple frustration: good drawings
              kept falling apart on site. So we built the workshop, kept the architect in-house,
              and stopped handing our work to anybody else.
            </p>
            <p data-reveal className="copy mt-4 text-[14.5px]">
              Today the same team that measures your rooms also makes your shutters, sets your
              stone and returns after the monsoon to check the hinges. Design and build, under one
              roof in Gorakhpur — residential, retail and everything in between.
            </p>
            <div data-reveal className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
              <a href={BUSINESS.whatsapp} target="_blank" rel="noreferrer" className="btn">
                Start a project
                <span className="ar" aria-hidden="true">
                  →
                </span>
              </a>
              <a href={BUSINESS.mapsUrl} target="_blank" rel="noreferrer" className="tlink">
                Visit our developers
                <span className="ar" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Row 2 — metrics strip */}
        <div className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-3">
          {METRICS.map((metric, i) => (
            <div key={metric.value} data-reveal className="pt-4">
              <hr data-rule className="rule" />
              <div className="flex items-start gap-3.5 pt-4">
                <iconify-icon
                  icon={metric.icon}
                  width="19"
                  height="19"
                  class="mt-1 shrink-0 text-ink/45"
                />
                <div>
                  <p className="num flex items-baseline gap-2 text-[clamp(24px,2.4vw,34px)] font-extrabold leading-none tracking-display text-ink">
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

        {/* Row 3 — figure carrying the amenity strip.
            The detail shot is no longer a still: it sits inside the film-grain
            plate the preloader uses, counts up as it scrolls into view and
            clears under the cursor. Same image, same frame, same alt. */}
        <figure
          data-philosophy-figure
          className="image-reveal relative mt-10 overflow-hidden bg-blush"
        >
          <div data-philosophy-plate className="h-[320px] w-full sm:h-[400px] lg:h-[460px]">
            <LayoutPreloader
              variant="inline"
              image={IMAGES.philosophy}
              imageProps={{
                alt: 'Detail of a finished interior: curved plaster meeting fluted oak, with a honed travertine ledge',
                className: 'scale-[1.08]',
              }}
              label="Limewash, smoked oak and travertine, in one light"
              sublabel="In situ · Azeet Plaza, Gorakhpur"
              duration={2600}
              minimal
              className="h-full w-full"
            />
          </div>

          <figcaption className="absolute left-6 top-6 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
            <span className="lbl text-white">Limewash · Smoked oak · Travertine</span>
          </figcaption>

          {/* From the sm breakpoint up the amenities ride inside the frame, so
              the row below stays free; on phones they sit under the image. */}
          <div className="absolute inset-x-0 bottom-0 hidden divide-x divide-white/15 border-t border-white/15 bg-inkdeep/45 backdrop-blur-md sm:grid sm:grid-cols-3">
            {AMENITIES.map((amenity) => (
              <div key={amenity.label} className="flex items-start gap-3.5 p-5">
                <iconify-icon
                  icon={amenity.icon}
                  width="19"
                  height="19"
                  class="mt-0.5 shrink-0 text-chalk/70"
                />
                <div>
                  <p className="subhead text-[13.5px] text-chalk">{amenity.label}</p>
                  <p className="copy mt-1 text-[12px] text-chalk/60">{amenity.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </figure>

        <div className="mt-6 grid gap-5 sm:hidden">
          {AMENITIES.map((amenity) => (
            <div key={amenity.label} data-reveal className="pt-3">
              <hr data-rule className="rule" />
              <div className="flex items-start gap-3.5 pt-3">
                <iconify-icon
                  icon={amenity.icon}
                  width="19"
                  height="19"
                  class="mt-0.5 shrink-0 text-ink/45"
                />
                <div>
                  <p className="subhead text-[13.5px] text-ink">{amenity.label}</p>
                  <p className="copy mt-1 text-[12px]">{amenity.copy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
