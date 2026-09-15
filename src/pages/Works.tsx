import WorksSpread from "@/sections/WorksSpread"
import FlipWorks from "@/sections/FlipWorks"
import Gallery from "@/sections/Gallery"
import { Link } from "react-router-dom"

/**
 * Works — dedicated index for showing work with different interactions.
 * StackSpread (pinned 220vh) and FlipWorks (gsap flip) live here only,
 * so they never compete with Home's scroll-expansion.
 * Gallery is also here as the third way to see the same interiors.
 */
export default function Works() {
  return (
    <>
      <section className="bg-bone pt-[calc(var(--nav-h)+36px)]">
        <div className="wrap pb-8">
          <p className="lbl text-ink/40">Works · Index 02</p>
          <h1 className="headline mt-3 max-w-[16ch] text-ink">
            Work shown <span className="accent">three ways</span>
          </h1>
          <p className="lede mt-4 text-ink/60">
            Nothing stacked on one page. Spread the deck, flip the editorial,
            then wander the mosaic — all built from the same 8 new interiors.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#spread" className="btn">
              Stack Spread
              <span className="ar" aria-hidden="true">→</span>
            </a>
            <a href="#flip" className="tlink">
              Gsap Flip
            </a>
            <a href="#gallery" className="tlink">
              Mosaic
            </a>
          </div>
        </div>
      </section>

      <div id="spread">
        <WorksSpread />
      </div>

      <div id="flip" className="border-t border-ink/10">
        <FlipWorks />
      </div>

      <div id="gallery" className="border-t border-ink/10">
        <Gallery />
      </div>

      <section className="border-t border-ink/10 bg-blush">
        <div className="wrap flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="copy max-w-[56ch] text-[13px] text-ink/60">
            Like a spread? The same rooms are also a coverflow on Home and a flip
            book here — pick your index.
          </p>
          <div className="flex gap-3">
            <Link to="/studio" className="tlink">
              Meet the makers
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
