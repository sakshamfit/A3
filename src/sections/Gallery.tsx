import { gsap, useGsap } from '../lib/gsap'
import { GALLERY } from '../lib/site'

/**
 * Section 6 — Gallery.
 *
 * Mosaic on a 400px row grid: item 1 tall, item 2 wide, items 3 and 4 standard.
 * Each tile un-clips as it enters, then parallaxes at its own `data-speed`
 * while the page scrolls; grayscale releases on hover.
 */
export default function Gallery() {
  const scope = useGsap<HTMLElement>((el, { reduced }) => {
    if (reduced) {
      gsap.set(el.querySelectorAll('[data-reveal]'), { opacity: 1, y: 0 })
      return
    }

    el.querySelectorAll<HTMLElement>('[data-tile]').forEach((tile) => {
      const image = tile.querySelector<HTMLElement>('[data-tile-image]')
      const speed = Number(tile.dataset.speed ?? 0)

      gsap.fromTo(
        tile,
        { opacity: 0, clipPath: 'inset(14% 0% 14% 0%)' },
        {
          opacity: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: tile, start: 'top 88%', once: true },
        },
      )

      if (image && speed) {
        gsap.fromTo(
          image,
          { yPercent: -speed },
          {
            yPercent: speed,
            ease: 'none',
            scrollTrigger: { trigger: tile, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      }
    })
  }, [])

  return (
    <section ref={scope} id="gallery" className="band bg-bone">
      <div className="wrap">
        <div className="mx-auto max-w-[52ch] text-center">
          <p data-reveal className="lbl text-ink/40">
            Visuals
          </p>
          <h2 data-reveal className="headline mt-6 text-ink">
            The <span className="accent">Atmosphere</span>
          </h2>
          <p data-reveal className="lede mx-auto mt-6 text-ink/60">
            Detail first: stone, timber, light and the quiet hardware that makes a room feel
            finished.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:auto-rows-[400px] md:grid-cols-3">
          {GALLERY.map((item, i) => (
            <div
              key={item.src}
              data-tile
              data-speed={i % 2 === 0 ? 5 : 8}
              className={`${item.span === 'tall' ? 'md:row-span-2' : ''} ${
                item.span === 'wide' ? 'md:col-span-2' : ''
              }`}
            >
              <figure className="group relative h-full overflow-hidden bg-stone-200">
                <img
                  data-tile-image
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-[320px] w-full scale-[1.12] object-cover grayscale-[30%] transition-[filter,transform] duration-1000 ease-smooth group-hover:scale-[1.16] group-hover:grayscale-0 md:h-full"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-inkdeep/75 via-inkdeep/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <figcaption className="pointer-events-none absolute bottom-6 left-6 translate-y-2 opacity-0 transition-all duration-700 ease-smooth group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="lbl block text-white/70">{item.project}</span>
                  <span className="mt-1 block font-display text-[17px] font-bold uppercase tracking-display text-white">
                    {item.caption}
                  </span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
