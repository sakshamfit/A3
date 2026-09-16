import { gsap, useGsap } from '../lib/gsap'
import { IMAGES, PROCESS } from '../lib/site'

/**
 * Section 5 — the pinned wipe.
 *
 * Two photographs of the *same* room, stacked: the bare cement shell on top of
 * the finished kitchen. GSAP scrubs a `--p` custom property from 0 to 1 across
 * the section, the shell's `clip-path` opens with it, and the four process steps
 * light up as the wipe passes them.
 *
 * The shell used to be the finished render pushed through a `.blueprint` CSS
 * filter, which read as a tinted duplicate rather than a different moment — so
 * it is a real plate now (`/images/res-obsidian-shell.jpg`, shot to the same
 * framing: the plinth sits where the island is built, the same window, the same
 * plants). No filter, no colour trick: the wipe works because the geometry
 * lines up.
 *
 * This section deliberately carries no headline of its own — `src/pages/Process.tsx`
 * already titles the page "Shell to finished", and repeating it in the section
 * put the same six words on screen twice.
 */
export default function Transform() {
  const scope = useGsap<HTMLElement>((el, { reduced }) => {
    const steps = el.querySelectorAll<HTMLElement>('[data-step]')
    const readout = el.querySelector<HTMLElement>('[data-wipe-pct]')

    if (reduced) {
      gsap.set(el, { '--p': 1 })
      gsap.set(steps, { opacity: 1 })
      if (readout) readout.textContent = '100'
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

    // the meter in the top-right micro label, driven off the same timeline so it
    // can never disagree with what the wipe is doing
    const meter = { p: 0 }
    tl.to(
      meter,
      {
        p: 1,
        ease: 'none',
        duration: 1,
        onUpdate: () => {
          if (readout) readout.textContent = String(Math.round(meter.p * 100)).padStart(3, '0')
        },
      },
      0,
    )
  }, [])

  return (
    <section ref={scope} id="process" className="relative h-[150vh] bg-bone md:h-[165vh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden md:h-screen">
        <div className="wrap">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5 border-b border-ink/10 pb-2.5">
            <p className="lbl text-ink/45">
              Obsidian Loft · Taramandal — kitchen, 14 weeks apart
            </p>
            <p className="lbl num text-ink/40">
              Wiped <span data-wipe-pct>000</span>%
            </p>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-12">
            {/* Wipe frame */}
            <figure className="relative overflow-hidden bg-blush lg:col-span-8">
              {/* finished render underneath */}
              <img
                src={IMAGES.residenceObsidian}
                alt="The Obsidian Loft kitchen finished — black stone island, oak open shelving, brass tapware, city beyond the glass"
                loading="lazy"
                decoding="async"
                className="h-[200px] w-full object-cover sm:h-[300px] lg:h-[min(46vh,420px)]"
              />
              {/* the bare shell, wiped away by --p.
                  p=0 → the shell covers the frame, p=1 → the shell is gone. */}
              <img
                src={IMAGES.residenceObsidianShell}
                alt="The same kitchen before fit-out — cement-plastered shell, open electrical conduits, brass pipe tails and a concrete plinth where the island is built"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
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
          <div className="mt-5 h-px w-full bg-ink/10">
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
