import { gsap, useGsap } from '../lib/gsap'
import { IMAGES, PROCESS } from '../lib/site'

/**
 * Section 5 — Shell → Finished.
 *
 * A pinned frame: the raw plastered shell (rendered as a blueprint-toned layer
 * of the same photograph) is wiped away by the finished interior as the section
 * is scrolled, driven by a `--p` custom property GSAP scrubs from 0 to 1. The
 * four process steps light up as the wipe passes them.
 */
export default function Transform() {
  const scope = useGsap<HTMLElement>((el, { reduced }) => {
    const steps = el.querySelectorAll<HTMLElement>('[data-step]')

    if (reduced) {
      gsap.set(el, { '--p': 1 })
      gsap.set(steps, { opacity: 1 })
      return
    }

    gsap.set(steps, { opacity: 0.32 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    })

    tl.fromTo(el, { '--p': 0 }, { '--p': 1, ease: 'none', duration: 1 }, 0)
    steps.forEach((step, i) => {
      tl.to(step, { opacity: 1, duration: 0.001 }, (i + 0.35) / steps.length)
    })
  }, [])

  return (
    <section ref={scope} id="process" className="relative h-[165vh] bg-bone md:h-[185vh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden md:h-screen">
        <div className="wrap">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="lbl text-ink/40">Process</p>
              <h2 className="headline mt-3 max-w-[20ch] text-ink">
                Shell to <span className="accent">finished</span>
              </h2>
            </div>
            <p className="lede text-ink/60">
              One apartment, 14 weeks apart. Drag your scroll to pull the finished room across
              the bare shell.
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            {/* Wipe frame */}
            <figure className="relative overflow-hidden bg-blush lg:col-span-8">
              {/* finished render underneath */}
              <img
                src={IMAGES.residenceObsidian}
                alt="Finished dark modular kitchen after an A3 fit-out"
                loading="lazy"
                decoding="async"
                className="h-[190px] w-full object-cover sm:h-[290px] lg:h-[380px]"
              />
              {/* shell layer wiped away by --p — same room, blueprint-toned.
                  p=0 → shell fully covers the frame, p=1 → shell fully wiped. */}
              <img
                src={IMAGES.residenceObsidian}
                alt=""
                aria-hidden="true"
                className="blueprint absolute inset-0 h-full w-full object-cover"
                style={{ clipPath: 'inset(0 calc(var(--p, 0) * 100%) 0 0)' }}
              />
              {/* wipe handle */}
              <div
                className="pointer-events-none absolute inset-y-0 w-px bg-white/70"
                style={{ left: 'calc(var(--p, 0) * 100%)' }}
              >
                <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-0.5 rounded-full border border-white/40 bg-white/15 backdrop-blur-md">
                  <iconify-icon icon="solar:arrow-left-linear" width="14" height="14" class="text-white" />
                  <iconify-icon
                    icon="solar:arrow-right-linear"
                    width="14"
                    height="14"
                    class="text-white"
                  />
                </span>
              </div>

              <figcaption className="pointer-events-none absolute left-0 top-0 flex w-full items-start justify-between p-5">
                <span className="rounded-full border border-white/25 bg-inkdeep/50 px-3 py-1.5">
                  <span className="lbl text-white/80">Shell</span>
                </span>
                <span className="rounded-full border border-white/25 bg-inkdeep/50 px-3 py-1.5">
                  <span className="lbl text-white/80">Finished</span>
                </span>
              </figcaption>
            </figure>

            {/* Steps */}
            <ol className="grid grid-cols-2 gap-x-6 lg:col-span-4 lg:block">
              {PROCESS.map((step) => (
                <li key={step.step} data-step className="border-t border-ink/10 py-2.5 lg:py-3">
                  <div className="flex items-baseline gap-4">
                    <span className="lbl num text-ink/40">{step.step}</span>
                    <div>
                      <p className="subhead text-[15px] text-ink">{step.title}</p>
                      <p className="copy mt-2 hidden text-[13px] lg:block">{step.copy}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Progress bar */}
          <div className="mt-6 h-px w-full bg-ink/10">
            <div
              className="h-px bg-ink"
              style={{ width: 'calc(var(--p, 0) * 100%)' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
