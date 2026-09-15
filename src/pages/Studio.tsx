import Owners from "@/sections/Owners"
import Atelier from "@/sections/Atelier"
import { Link } from "react-router-dom"
import { BUSINESS } from "@/lib/site"

/**
 * Studio — people + materials, no pinned sections, so nothing overlaps.
 * Owners uses Profile-Card-Testimonial-Carousel, Atelier is the WebGL board.
 */
export default function Studio() {
  return (
    <>
      <section className="bg-bone pt-[calc(var(--nav-h)+36px)]">
        <div className="wrap pb-8">
          <p className="lbl text-ink/40">Studio · Index 03</p>
          <h1 className="headline mt-3 max-w-[18ch] text-ink">
            The people who <span className="accent">draw and build</span>
          </h1>
          <p className="lede mt-4 max-w-[58ch] text-ink/60">
            No sales team. You brief the people who measure your walls and set
            your stone. Studio is on the second floor of Azeet Plaza — the same
            roof where the shutters are made.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="#owners" className="btn">
              Meet the owners
              <span className="ar" aria-hidden="true">→</span>
            </a>
            <a href="#materials" className="tlink">
              Materials
            </a>
          </div>
        </div>
      </section>

      <div id="owners">
        <Owners />
      </div>

      <section className="band bg-blush border-y border-ink/10">
        <div className="wrap grid gap-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="lbl text-ink/40">At a glance</p>
            <h2 className="headline mt-3 text-ink">
              One roof in <span className="accent">Gorakhpur</span>
            </h2>
          </div>
          <div className="md:col-span-7 grid gap-6 sm:grid-cols-3">
            <div className="border border-ink/10 bg-white p-5">
              <p className="lbl text-ink/40">Founded</p>
              <p className="mt-2 font-display text-[22px] font-bold tracking-display text-ink">
                {BUSINESS.founded}
              </p>
              <p className="copy mt-1 text-[12px]">Second Floor, Azeet Plaza since 2016</p>
            </div>
            <div className="border border-ink/10 bg-white p-5">
              <p className="lbl text-ink/40">Reviews</p>
              <p className="mt-2 font-display text-[22px] font-bold tracking-display text-ink">
                {BUSINESS.rating} <span className="text-[14px] font-medium text-ink/40">/ 5</span>
              </p>
              <p className="copy mt-1 text-[12px]">{BUSINESS.reviewCount} verified Google reviews</p>
            </div>
            <div className="border border-ink/10 bg-white p-5">
              <p className="lbl text-ink/40">Hours</p>
              <p className="mt-2 font-display text-[16px] font-bold tracking-display text-ink">
                10am – 10pm
              </p>
              <p className="copy mt-1 text-[12px]">Seven days · Free consultation</p>
            </div>
          </div>
        </div>
      </section>

      <div id="materials">
        <Atelier />
      </div>

      <section className="band bg-bone border-t border-ink/10">
        <div className="wrap flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="copy max-w-[52ch] text-[13px] text-ink/60">
            Every room uses the same four finishes — the WebGL board above is the
            real palette we build with.
          </p>
          <Link to="/process" className="btn">
            See how we build
            <span className="ar" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  )
}
