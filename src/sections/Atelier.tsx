import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { gsap, revealIn, useGsap } from '../lib/gsap'
import { MATERIALS } from '../lib/site'

/* Three.js is ~600 kB — it is fetched only once the section is approached. */
const RoomScene = lazy(() => import('../components/three/RoomScene'))

function SceneSkeleton() {
  return (
    <div
      className="h-full w-full"
      style={{
        background:
          'radial-gradient(120% 90% at 62% 22%, #3a3129 0%, #1b1815 55%, #111111 100%)',
      }}
    >
      <div className="flex h-full flex-col justify-between p-6 sm:p-8">
        <p className="lbl text-chalk/35">Material board · loading</p>
        <p className="lbl text-chalk/25">Preparing the room…</p>
      </div>
    </div>
  )
}

/**
 * Section — Material board (dark band + Three.js).
 *
 * The WebGL room and this DOM list share one piece of state: hovering or
 * focusing a finish lifts and lights the matching plane in the 3D scene while
 * the canvas dollies closer as the section scrolls. Three.js is lazy-mounted
 * once the section comes within a screen of the viewport.
 */
export default function Atelier() {
  const [active, setActive] = useState<number | null>(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mountScene, setMountScene] = useState(false)
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    if (typeof IntersectionObserver === 'undefined') {
      setMountScene(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setMountScene(true)
            observer.disconnect()
          }
        }
      },
      { rootMargin: '500px 0px' },
    )
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  const scope = useGsap<HTMLElement>((el, { reduced }) => {
    const stopReveal = revealIn(el, reduced)

    if (reduced) return stopReveal

    gsap.fromTo(
      el.querySelectorAll('[data-rule]'),
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.07,
        scrollTrigger: { trigger: el, start: 'top 70%', once: true },
      },
    )

    return stopReveal
  }, [])

  return (
    <section ref={scope} id="atelier" className="on-ink band bg-inkdeep text-chalk">
      <div className="wrap">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-reveal className="lbl text-chalk/45">
              Material board · In Situ Showcase
            </p>
            <h2 data-reveal className="headline mt-4 max-w-[20ch] text-chalk">
              Four finishes, <span className="accent">one</span> language
            </h2>
          </div>
          <p data-reveal className="lede text-chalk/60">
            Every A3 room is pinned to the same short list of materials, so a kitchen picked in
            2024 still matches a wardrobe added in 2026. Move across the finishes — the room
            responds in situ.
          </p>
        </div>

        <div className="mt-10 grid gap-7 lg:grid-cols-12">
          {/* Architectural material showroom & visualizer */}
          <div ref={hostRef} data-reveal="fade" className="lg:col-span-7">
            <div className="h-[370px] w-full border border-white/15 sm:h-[420px] lg:h-[470px] shadow-2xl overflow-hidden">
              {mountScene ? (
                <Suspense fallback={<SceneSkeleton />}>
                  <RoomScene
                    activeMaterial={active}
                    onSelectMaterial={(idx) => {
                      setActive(idx)
                    }}
                    isZoomed={isZoomed}
                    onToggleZoom={setIsZoomed}
                    className="h-full w-full"
                  />
                </Suspense>
              ) : (
                <SceneSkeleton />
              )}
            </div>
          </div>

          {/* DOM controls for the material board */}
          <div className="flex flex-col lg:col-span-5">
            <ul>
              {MATERIALS.map((material, i) => (
                <li key={material.name}>
                  <hr data-rule className="rule" />
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => {}}
                    onFocus={() => setActive(i)}
                    onClick={() => {
                      setActive(i)
                      setIsZoomed(true)
                    }}
                    aria-pressed={active === i}
                    className={`group flex w-full items-center gap-4 py-3.5 text-left transition-colors ${
                      active === i ? 'bg-white/[0.04] px-2.5 -mx-2.5' : ''
                    }`}
                  >
                    <span
                      className={`h-9 w-9 shrink-0 border transition-all duration-500 ease-smooth ${
                        active === i
                          ? 'scale-110 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.35)]'
                          : 'border-white/20 group-hover:scale-105'
                      }`}
                      style={{ background: material.swatch }}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="subhead flex items-center gap-2 text-[16px] text-chalk">
                        {material.name}
                        {active === i && (
                          <span className="font-mono text-[9px] uppercase tracking-widest text-amber-300/90 border border-amber-300/30 px-1.5 py-0.5">
                            {isZoomed ? 'Zoomed Close Shot' : 'Active'}
                          </span>
                        )}
                      </span>
                      <span className="lbl mt-1 block text-chalk/45">
                        {material.finish} · {material.note}
                      </span>
                    </span>
                    <iconify-icon
                      icon="solar:arrow-right-linear"
                      width="18"
                      height="18"
                      class={`shrink-0 transition-all duration-500 ease-smooth ${
                        active === i
                          ? 'translate-x-0 text-amber-300'
                          : '-translate-x-1 text-chalk/30 group-hover:translate-x-0 group-hover:text-chalk/70'
                      }`}
                    />
                  </button>
                </li>
              ))}
              <hr data-rule className="rule" />
            </ul>

            <p className="copy mt-6 text-[12.5px] lg:mt-auto lg:pt-6">
              The living pavilion above illustrates these four core finishes in natural daylight.
              Move your cursor across the room to experience the parallax perspective, tap the
              pins, or inspect the 1:1 macro tactile textures.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
