import Reveal from '../components/Reveal'
import { HIGHLIGHTS } from '../lib/site'

/**
 * Section 5 — Highlights. Dark band: #1a1a1a background, #f2f2f2 copy,
 * hairline borders at 10% white.
 */
export default function Highlights() {
  return (
    <section className="bg-ink px-6 py-24 text-chalk sm:px-10 md:px-14 md:py-28">
      <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <p className="label text-chalk/45">How we work</p>
        <p className="max-w-md text-[15px] leading-relaxed text-chalk/60">
          Design, drawings and execution stay in the same building — which is
          why our timelines hold and our details line up.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
        {HIGHLIGHTS.map((item, i) => (
          <Reveal key={item.title} delay={i * 90} className="border-t border-white/10 pt-8">
            <iconify-icon icon={item.icon} width="26" height="26" class="text-chalk/70" />
            <h3 className="mt-7 text-xl font-light tracking-tight text-chalk">
              {item.title}
            </h3>
            <p className="mt-4 text-[14px] leading-relaxed text-chalk/60">{item.copy}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
