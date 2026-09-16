import Hero from "@/sections/Hero"
import Marquee from "@/components/Marquee"
import Philosophy from "@/sections/Philosophy"
import Residences from "@/sections/Residences"
import { Link } from "react-router-dom"
import { BUSINESS } from "@/lib/site"

/**
 * Home — clean landing, not overloaded.
 * Only one pinned section (Residences scroll-expansion).
 * StackSpread / Flip / Transform are on their own pages.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Philosophy />
      <Residences />

      {/* Teaser to Works — keep Home light, push heavy interactions to /works */}
      <section className="band bg-blush border-t border-ink/10">
        <div className="wrap grid gap-6 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <p className="lbl text-ink/40">Next index</p>
            <h2 className="headline mt-3 text-ink">
              More ways to <span className="accent">see the work</span>
            </h2>
            <p className="lede mt-4 text-ink/60">
              The first home expands full-screen. The rest live as a rack,
              a stacked deck and a flip book — each on its own index so nothing
              overlaps.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:col-span-5 md:items-end">
            <Link to="/works" className="btn w-full justify-center md:w-auto">
              Explore Works — Stack & Flip
              <span className="ar" aria-hidden="true">→</span>
            </Link>
            <Link to="/studio" className="tlink">
              Meet the developers
              <span className="ar" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof teaser — static, not pinned, to avoid second pinned on Home */}
      <section className="band bg-bone">
        <div className="wrap">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="lbl text-ink/40">Reviews</p>
              <h2 className="headline mt-3 text-ink">
                {BUSINESS.rating} from <span className="accent">{BUSINESS.reviewCount}</span> reviews
              </h2>
            </div>
            <Link to="/studio#reviews" className="tlink hidden md:inline-flex">
              Read all reviews
              <span className="ar" aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              "We absolutely loved the service from A3 interior designer & builders.",
              "Good looking for my design in my home very nice work thank you for company",
              "He provides interior designing service in gorakhpur, and nearby city.",
            ].map((q, i) => (
              <div key={i} className="border border-ink/10 bg-white p-6">
                <div className="flex items-center gap-1 text-ink/60">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <iconify-icon key={s} icon="solar:star-bold" width="12" height="12" />
                  ))}
                </div>
                <p className="mt-4 font-display text-[15px] font-medium leading-[1.4] text-ink">
                  “{q}”
                </p>
                <p className="lbl mt-4 text-ink/40">Google review · {String(i + 1).padStart(2, "0")}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start gap-4 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="copy text-[13px] text-ink/55">
              Full pinned Reviews track lives on the Process page — Home stays light.
            </p>
            <Link to="/process" className="btn">
              See how we build
              <span className="ar" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact teaser */}
      <section className="border-y border-ink/10 bg-bone">
        <div className="wrap flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="lbl text-ink/40">Visit us</p>
            <p className="mt-2 font-display text-[18px] font-bold uppercase tracking-display text-ink">
              Second Floor, Azeet Plaza · Taramandal
            </p>
            <p className="copy mt-1 text-[13px] text-ink/60">Open daily · 10am – 10pm · Free consultation</p>
          </div>
          <Link to="/contact" className="btn">
            Book a consultation
            <span className="ar" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  )
}
