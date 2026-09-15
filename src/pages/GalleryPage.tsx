import Gallery from "@/sections/Gallery"
import { Link } from "react-router-dom"

/**
 * Gallery — full mosaic as its own index, so the home page stays light.
 * Uses the same Gallery tiles but as a dedicated page with no pinned neighbours.
 */
export default function GalleryPage() {
  return (
    <>
      <section className="bg-bone pt-[calc(var(--nav-h)+36px)]">
        <div className="wrap pb-8">
          <p className="lbl text-ink/40">Gallery · Index</p>
          <h1 className="headline mt-3 text-ink">
            The <span className="accent">Atmosphere</span>
          </h1>
          <p className="lede mt-4 max-w-[52ch] text-ink/60">
            Stone, timber, light and the quiet hardware that makes a room feel
            finished — all 18 interiors, including the 8 new ones, in one
            mosaic.
          </p>
        </div>
      </section>

      <Gallery />

      <section className="band bg-blush border-t border-ink/10">
        <div className="wrap flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="copy text-[13px] text-ink/60">
            Hover a tile — grayscale lifts, caption slides up. Like the stack
            and flip, this is a different index for the same work.
          </p>
          <Link to="/works" className="btn">
            See Stack & Flip
            <span className="ar" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  )
}
