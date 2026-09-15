import { gsap, ScrollTrigger, useGsap } from '../lib/gsap'
import { MARQUEE } from '../lib/site'

/**
 * GSAP-driven ticker. The track holds the list twice and is translated -50% on
 * an infinite tween; scroll velocity feeds `timeScale`, so the band accelerates
 * as the page is thrown and calms back down.
 */
export default function Marquee() {
  const scope = useGsap<HTMLDivElement>((el, { reduced }) => {
    const track = el.querySelector<HTMLElement>('[data-ticker]')
    if (!track || reduced) return

    const loop = gsap.to(track, {
      xPercent: -50,
      repeat: -1,
      duration: 34,
      ease: 'none',
    })

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const speed = 1 + Math.min(3, Math.abs(self.getVelocity()) / 1400)
        gsap.to(loop, { timeScale: speed, duration: 0.4, overwrite: true })
      },
    })

    return () => {
      loop.kill()
      trigger.kill()
    }
  }, [])

  return (
    <div
      ref={scope}
      className="on-ink select-none overflow-hidden border-y border-white/10 bg-ink"
    >
      <div data-ticker className="flex w-max items-center py-3">
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0 items-center" aria-hidden={group === 1}>
            {MARQUEE.map((item) => (
              <span key={item} className="flex items-center">
                <span className="lbl px-6 text-chalk/70">{item}</span>
                <span className="text-rose/60" aria-hidden="true">
                  ✳
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
