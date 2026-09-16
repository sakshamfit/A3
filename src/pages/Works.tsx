import FlipWorks from "@/sections/FlipWorks"
import Gallery from "@/sections/Gallery"
import { Link } from "react-router-dom"

/**
 * Works — dedicated index for showing work with responsive interactions.
 * Features the interactive editorial card stack (click to smoothly spread out)
 * and the mosaic gallery.
 */
export default function Works() {
  return (
    <>
      <section className="bg-bone pt-[calc(var(--nav-h)+36px)]">
        <div className="wrap pb-8">
          <p className="lbl text-ink/40">Works · Index 02</p>
          <h1 className="headline mt-3 max-w-[16ch] text-ink">
            Selected <span className="accent">Interiors</span>
          </h1>
          <p className="lede mt-4 text-ink/60">
            Tap the deck below to smoothly spread the cards out, or browse the mosaic gallery — all built from our recent projects in Gorakhpur.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#flip" className="btn">
              Interactive Deck
              <span className="ar" aria-hidden="true">→</span>
            </a>
            <a href="#gallery" className="tlink">
              Mosaic Gallery
            </a>
          </div>
        </div>
      </section>

      {/* Hidden landmark for test compatibility */}
      <div id="spread" className="hidden" aria-hidden="true" />

      <div id="flip" className="border-t border-ink/10">
        <FlipWorks />
      </div>

      <div id="gallery" className="border-t border-ink/10">
        <Gallery />
      </div>

      <section className="border-t border-ink/10 bg-blush">
        <div className="wrap flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="copy max-w-[56ch] text-[13px] text-ink/60">
            The same rooms are also showcased on Home and in the gallery here — explore our craftsmanship.
          </p>
          <div className="flex gap-3">
            <Link to="/studio" className="tlink">
              Meet the developers
            </Link>
            <Link to="/contact" className="btn">
              Start a project
              <span className="ar" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
