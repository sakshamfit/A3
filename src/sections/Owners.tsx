import { ProfileCardTestimonialCarousel } from "@/components/ui/profile-card-testimonial-carousel"
import { OWNERS } from "@/lib/site"
import { revealIn, useGsap } from "@/lib/gsap"

/**
 * Section — Meet the Studio / Owners
 * Relatable profile carousel built on the Arunachalam profile-card-testimonial pattern.
 * Shows the people behind A3 — not stock testimonials, but the founders who
 * actually draw, source and build. Same bone palette as the rest of the site.
 */
export default function Owners() {
  const scope = useGsap<HTMLElement>((el, { reduced }) => revealIn(el, reduced), [])

  return (
    <section ref={scope} id="studio" className="band bg-bone">
      <div className="wrap">
        <div className="mx-auto max-w-[72ch] text-center">
          <p data-reveal className="lbl text-ink/40">
            The people behind A3
          </p>
          <h2 data-reveal className="headline mt-3 text-ink">
            Meet the <span className="accent">studio</span>
          </h2>
          <p data-reveal className="lede mx-auto mt-4 text-ink/60">
            No sales team in between. You brief the people who will measure your
            walls, order your stone and hand you the keys. Three profiles — one
            roof in Gorakhpur.
          </p>
        </div>

        <div data-reveal className="mt-10">
          <ProfileCardTestimonialCarousel
            cards={OWNERS.map((o) => ({
              name: o.name,
              role: o.role,
              avatar: o.avatar,
              quote: o.quote,
              bio: o.bio,
              location: o.location,
              experience: o.experience,
              tags: o.tags,
              meta: o.meta,
              socials: o.socials,
            }))}
          />
        </div>

        <div
          data-reveal
          className="mx-auto mt-8 flex max-w-[720px] flex-col items-center gap-3 border-t border-ink/10 pt-6 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <p className="copy text-[13px] text-ink/55">
            Second Floor, Azeet Plaza · Walk in for a free consultation — bring
            your floor plan or just your Pinterest board.
          </p>
          <a
            href="https://wa.me/919451546780"
            target="_blank"
            rel="noreferrer"
            className="btn shrink-0"
          >
            Meet us at the studio
            <span className="ar" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
