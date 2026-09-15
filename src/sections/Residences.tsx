import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { BUSINESS, RESIDENCES } from "../lib/site";

/* framer-motion is ~50 kB gzip and only this section needs it, so the panel
   loads on approach and a static frame stands in until it arrives. */
const ScrollExpandMedia = lazy(
  () => import("@/components/ui/scroll-expansion-hero"),
);

function PanelPlaceholder({
  image,
  title,
  backdrop,
}: {
  image: string;
  title: string;
  backdrop: string;
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
  );
}

/**
 * Section — Featured Residences.
 *
 * Each project is a scroll-expansion panel: the image starts as a small centred
 * card on a full-bleed backdrop and grows to fill the viewport as you scroll,
 * with the title's two halves travelling apart and the project details fading
 * in over the expanded media. A sticky "current availability" rail tracks
 * whichever panel owns the viewport and jumps between them.
 */
export default function Residences() {
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = useState(0);

  /* Keep the rail's index in step with the panel filling the viewport. */
  useEffect(() => {
    const nodes = panelRefs.current.filter((node): node is HTMLDivElement =>
      Boolean(node),
    );
    if (!nodes.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = nodes.indexOf(entry.target as HTMLDivElement);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const jump = (direction: 1 | -1) => {
    const next = (active + direction + RESIDENCES.length) % RESIDENCES.length;
    setActive(next);
    panelRefs.current[next]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section id="projects" className="bg-bone pb-16 md:pb-20">
      <div className="wrap pt-16 md:pt-20">
        <div className="flex flex-col gap-5 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="lbl text-ink/40">Selected work</p>
            <h2 className="headline mt-4 text-ink">
              Featured <span className="accent">Residences</span>
            </h2>
          </div>
          <p className="lede text-ink/60">
            Four rooms we finished this year. Scroll to open each one — the
            panel expands to fill the screen.
          </p>
        </div>
      </div>

      {/* Sticky rail */}
      <div className="sticky top-0 z-30 border-y border-ink/10 bg-bone/85 backdrop-blur-md">
        <div className="wrap flex items-center justify-between gap-4 py-3">
          <p className="lbl text-ink/50">Current availability</p>
          <div className="flex items-center gap-5 sm:gap-7">
            <span className="lbl num text-ink/40">
              {RESIDENCES[active].index} /{" "}
              {String(RESIDENCES.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => jump(-1)}
                aria-label="Previous residence"
                className="icon-btn rounded-full"
              >
                <iconify-icon
                  icon="solar:arrow-left-linear"
                  width="16"
                  height="16"
                />
              </button>
              <button
                type="button"
                onClick={() => jump(1)}
                aria-label="Next residence"
                className="icon-btn rounded-full"
              >
                <iconify-icon
                  icon="solar:arrow-right-linear"
                  width="16"
                  height="16"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expansion panels */}
      <div>
        {RESIDENCES.map((residence, i) => (
          <div
            key={residence.title}
            ref={(node) => {
              panelRefs.current[i] = node;
            }}
          >
            <Suspense
              fallback={
                <PanelPlaceholder
                  image={residence.image}
                  backdrop={residence.backdrop}
                  title={residence.title}
                />
              }
            >
              <ScrollExpandMedia
                mediaType="image"
                mediaSrc={residence.image}
                bgImageSrc={residence.backdrop}
                title={residence.title}
                date={`${residence.index} — ${residence.year}`}
                scrollToExpand="Scroll to expand"
                textBlend
                scrollLength={160}
              >
                <div className="wrap pb-7 pt-10">
                  <div className="border border-white/15 bg-inkdeep/50 p-5 backdrop-blur-md sm:p-6">
                    <div className="grid gap-5 md:grid-cols-12 md:gap-8">
                      <div className="md:col-span-7">
                        <p className="lbl text-chalk/60">
                          {residence.location}
                        </p>
                        <p className="copy mt-2 max-w-[46ch] text-[13.5px] text-chalk/80">
                          {residence.summary}
                        </p>
                      </div>

                      <div className="md:col-span-5">
                        <ul className="flex flex-wrap gap-x-6 gap-y-2">
                          {[
                            {
                              icon: "solar:maximize-square-linear",
                              label: residence.area,
                            },
                            {
                              icon: "solar:bed-linear",
                              label: residence.config,
                            },
                            {
                              icon: "solar:tag-price-linear",
                              label: residence.price,
                            },
                          ].map((fact) => (
                            <li
                              key={fact.label}
                              className="flex items-center gap-2.5"
                            >
                              <iconify-icon
                                icon={fact.icon}
                                width="17"
                                height="17"
                                class="text-chalk/55"
                              />
                              <span className="lbl text-chalk/80">
                                {fact.label}
                              </span>
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
          </div>
        ))}
      </div>
    </section>
  );
}
