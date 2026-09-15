import { Suspense, lazy } from "react"
import { BUSINESS, RESIDENCES } from "../lib/site"
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel"

/* framer-motion is ~50 kB gzip and only the first panel needs it, so the panel
   loads on approach and a static frame stands in until it arrives. */
const ScrollExpandMedia = lazy(
  () => import("@/components/ui/scroll-expansion-hero")
)

function PanelPlaceholder({
  image,
  title,
  backdrop,
}: {
  image: string
  title: string
  backdrop: string
}) {
  return (
    <div className="relative h-[100svh] overflow-hidden">
      <img
        src={backdrop}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute left-1/2 top-1/2 h-[400px] w-[300px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.3)]">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h2 className="display mix-blend-difference text-white">{title}</h2>
      </div>
    </div>
  )
}

/**
 * Section — Featured Residences
 *
 * First residence uses the scroll-expansion hero (the full-homescope
 * modular-kitchen effect). The rest of the collection is presented with the
 * Ruixen UI coverflow carousel — reversed perspective, centre card square,
 * neighbours swung forward, drag to explore.
 */
export default function Residences() {
  const featured = RESIDENCES[0]
  const collection = RESIDENCES.slice(1)

  const coverflowSlides = collection.map((r) => ({
    src: r.image,
    alt: `${r.title} — ${r.location}`,
    title: r.title,
    subtitle: r.location,
    description: r.summary,
    meta: [
      { label: "Area", value: r.area },
      { label: "Type", value: r.config },
      { label: "Year", value: r.year },
    ],
    href: BUSINESS.whatsapp,
  }))

  return (
    <section id="projects" className="bg-bone">
      {/* header */}
      <div className="wrap pt-16 md:pt-20">
        <div className="flex flex-col gap-5 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="lbl text-ink/40">Selected work</p>
            <h2 className="headline mt-4 text-ink">
              Featured <span className="accent">Residences</span>
            </h2>
          </div>
          <p className="lede text-ink/60">
            First, scroll to open one home full-screen. Then drag the rack to
            wander the rest of the collection.
          </p>
        </div>
      </div>

      {/* ——— 01 — Scroll-expansion hero: ONLY the first residence ——— */}
      <div className="border-t border-ink/10">
        <div className="wrap flex items-center justify-between gap-4 py-3">
          <p className="lbl text-ink/50">Featured — Scroll to expand</p>
          <span className="lbl num text-ink/40">
            {featured.index} / {String(RESIDENCES.length).padStart(2, "0")} · Full
            homescope
          </span>
        </div>
      </div>

      <Suspense
        fallback={
          <PanelPlaceholder
            image={featured.image}
            backdrop={featured.backdrop}
            title={featured.title}
          />
        }
      >
        <ScrollExpandMedia
          mediaType="image"
          mediaSrc={featured.image}
          bgImageSrc={featured.backdrop}
          title={featured.title}
          date={`${featured.index} — ${featured.year} · Full-homescope`}
          scrollToExpand="Scroll to expand"
          textBlend
          scrollLength={150}
        >
          <div className="wrap pb-7 pt-10">
            <div className="border border-white/15 bg-inkdeep/50 p-5 backdrop-blur-md sm:p-6">
              <div className="grid gap-5 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-7">
                  <p className="lbl text-chalk/60">{featured.location}</p>
                  <p className="copy mt-2 max-w-[46ch] text-[13.5px] text-chalk/80">
                    {featured.summary} Modular kitchens & wardrobes built in our
                    workshop, fitted on site to the millimetre — every room,
                    including the ones nobody photographs.
                  </p>
                  <p className="mt-3 hidden items-center gap-2 text-[12px] tracking-wide text-chalk/50 sm:inline-flex">
                    <iconify-icon
                      icon="solar:maximize-square-linear"
                      width="14"
                      height="14"
                    />
                    Full-homescope · One price, itemised before work begins
                  </p>
                </div>

                <div className="md:col-span-5">
                  <ul className="flex flex-wrap gap-x-6 gap-y-2">
                    {[
                      {
                        icon: "solar:maximize-square-linear",
                        label: featured.area,
                      },
                      {
                        icon: "solar:bed-linear",
                        label: featured.config,
                      },
                      {
                        icon: "solar:tag-price-linear",
                        label: featured.price,
                      },
                    ].map((fact) => (
                      <li key={fact.label} className="flex items-center gap-2.5">
                        <iconify-icon
                          icon={fact.icon}
                          width="17"
                          height="17"
                          class="text-chalk/55"
                        />
                        <span className="lbl text-chalk/80">{fact.label}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={BUSINESS.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="btn on-ink mt-5"
                  >
                    Enquire about this home
                    <span className="ar" aria-hidden="true">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ScrollExpandMedia>
      </Suspense>

      {/* ——— 02 — Coverflow carousel: the rest of the collection ——— */}
      <div className="border-y border-ink/10 bg-bone">
        <div className="wrap flex flex-col gap-4 py-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="lbl text-ink/40">Collection · Coverflow</p>
            <h3 className="subhead mt-2 text-[clamp(18px,2.4vw,26px)] text-ink">
              Drag the rack — <span className="accent">more homes</span>
            </h3>
          </div>
          <p className="copy max-w-[46ch] text-[13.5px] text-ink/60">
            The centre card sits square while the ones beside it swing their outer
            edges toward you. The caption follows. Tap a side card to bring it
            forward.
          </p>
        </div>
      </div>

      <div className="bg-bone pb-16 pt-10 sm:pt-12 md:pb-20">
        <div className="wrap">
          <CoverflowCarousel slides={coverflowSlides} showCaption />
        </div>
      </div>
    </section>
  )
}
