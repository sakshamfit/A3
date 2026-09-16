import { StackSpread } from "@/components/ui/stack-spread"
import { STACK_SPREAD_ITEMS } from "@/lib/site"

/**
 * Section — Works as stack-spread
 * Uses the @daiwiikharihar/stack-spread pattern: linear deck → spatial spread on scroll.
 * Heading is placed cleanly at the top so the expanding deck never collides into the copy.
 */
export default function WorksSpread() {
  return (
    <section id="works-spread" className="bg-bone pt-10">
      <div className="wrap pb-4 text-center">
        <p className="lbl text-ink/40">Works · Stack Spread</p>
        <h3 className="subhead mt-2 text-ink">
          Five rooms, one table — <span className="accent">spread to see them</span>
        </h3>
        <p className="copy mx-auto mt-3 max-w-[56ch] text-[13.5px] text-ink/60">
          The deck starts stacked like samples in our studio. Scroll and it fans out —
          each card is a real A3 job, from Taramandal to Rapti Nagar.
        </p>
      </div>
      <StackSpread items={[...STACK_SPREAD_ITEMS]} />
    </section>
  )
}

