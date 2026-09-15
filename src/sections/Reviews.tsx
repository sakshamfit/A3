import ReviewQuote from '../components/ReviewQuote'
import { gsap, useGsap } from '../lib/gsap'
import { BUSINESS, REVIEWS } from '../lib/site'

/**
 * Section 7 — Reviews.
 *
 * Vertical scroll is mapped onto a horizontal track (ScrollTrigger scrub on a
 * tall section with a sticky viewport inside). Below the desktop breakpoint the
 * track falls back to a plain stacked list, so nothing is trapped.
 */
export default function Reviews() {
  const scope = useGsap<HTMLElement>((el, { reduced, isDesktop }) => {
    if (reduced || !isDesktop) return

    const track = el.querySelector<HTMLElement>('[data-review-track]')
    if (!track) return

    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth + 44),
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })
  }, [])

  return (
    <section ref={scope} id="reviews" className="relative bg-bone md:h-[210vh]">
      <div className="md:sticky md:top-0 md:flex md:h-screen md:items-center md:overflow-hidden">
        <div className="w-full">
          <div className="wrap">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="lbl text-ink/40">Reviews</p>
                <h2 className="headline mt-3 max-w-[16ch] text-ink">
                  {BUSINESS.rating} from <span className="accent">{BUSINESS.reviewCount}</span> reviews
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-ink/70">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <iconify-icon key={star} icon="solar:star-bold" width="14" height="14" />
                  ))}
                </span>
                <a
                  href={BUSINESS.reviewsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="tlink"
                >
                  Read on Google
                  <span className="ar" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Track */}
          <div className="mt-8 md:mt-10">
            <ul
              data-review-track
              className="wrap flex flex-col gap-5 md:w-max md:flex-row md:gap-6 md:pr-14"
            >
              {REVIEWS.map((review, i) => (
                <li
                  key={i}
                  className="flex w-full flex-col justify-between border border-ink/10 bg-shell p-6 md:h-[320px] md:w-[360px] md:shrink-0 lg:w-[410px]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="lbl num text-ink/35">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex items-center gap-1 text-ink/60">
                        {[0, 1, 2, 3, 4].map((star) => (
                          <iconify-icon key={star} icon="solar:star-bold" width="12" height="12" />
                        ))}
                      </span>
                    </div>
                    <ReviewQuote
                      review={review}
                      className="mt-6 font-display text-[17px] font-medium leading-[1.35] tracking-[-0.01em] text-ink md:text-[20px]"
                    />
                  </div>
                  <p className="lbl mt-6 text-ink/40">{review.meta}</p>
                </li>
              ))}

              <li className="hidden w-[360px] shrink-0 flex-col justify-between border border-ink/10 bg-ink p-6 text-chalk md:flex">
                <p className="lbl text-chalk/45">Next</p>
                <div>
                  <p className="headline text-[clamp(26px,2.6vw,40px)] text-chalk">
                    Your home,
                    <br />
                    <span className="accent">next</span>
                  </p>
                  <a
                    href={BUSINESS.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="btn on-ink mt-6"
                  >
                    Book a consultation
                    <span className="ar" aria-hidden="true">
                      →
                    </span>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
