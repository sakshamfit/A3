import Reveal from '../components/Reveal'
import { GALLERY } from '../lib/site'

/**
 * Section 6 — Gallery.
 *
 * Centred "Visuals / The Atmosphere" heading above a three-column mosaic on a
 * 400px row grid: item 1 is tall (row-span-2), item 2 is wide (col-span-2),
 * items 3 and 4 are standard cells.
 */
export default function Gallery() {
  return (
    <section id="gallery" className="bg-bone px-6 py-24 sm:px-10 md:px-14 md:py-32">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="label text-ink/40">Visuals</p>
        <h2 className="mt-6 text-3xl font-light leading-tight tracking-tighter text-ink sm:text-4xl md:text-5xl">
          The <span className="font-serif italic font-light">Atmosphere</span>
        </h2>
        <p className="mt-6 text-[15px] leading-relaxed text-ink/60">
          Detail first: stone, timber, light and the quiet hardware that makes a
          room feel finished.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-4 md:auto-rows-[400px] md:grid-cols-3">
        {GALLERY.map((item, i) => (
          <Reveal
            key={item.src}
            delay={i * 70}
            distance={16}
            duration={1000}
            className={`${item.span === 'tall' ? 'md:row-span-2' : ''} ${
              item.span === 'wide' ? 'md:col-span-2' : ''
            }`}
          >
            <figure className="group relative h-full overflow-hidden bg-stone-200">
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="h-[300px] w-full object-cover grayscale-[30%] transition-all duration-1000 ease-smooth group-hover:scale-[1.02] group-hover:grayscale-0 md:h-full"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              <figcaption className="pointer-events-none absolute bottom-6 left-6 translate-y-2 opacity-0 transition-all duration-700 ease-smooth group-hover:translate-y-0 group-hover:opacity-100">
                <span className="block text-[11px] uppercase tracking-[0.24em] text-white/70">
                  {item.project}
                </span>
                <span className="mt-1 block text-base font-light text-white">
                  {item.caption}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
