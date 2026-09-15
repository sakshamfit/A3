import { GsapCardFlip } from "@/components/ui/gsap-card-flip"
import { FLIP_FRAMES } from "@/lib/site"

/**
 * Section — Editorial flip stack
 * Uses @hyperiux/gsap-card-flip pattern to show work as a tactile deck:
 * click stack to spread, click any frame to bring it forward.
 */
export default function FlipWorks() {
  return (
    <section id="flip-works" className="bg-bone">
      <GsapCardFlip
        items={[...FLIP_FRAMES]}
        title="Works Editorial"
        meta="Campaign Frames · Interiors"
        description="Six frames from this year’s build. Tap the pile to spread it — then any frame to bring it forward. All built under one roof in Gorakhpur."
        rounded={20}
        stackRotation={2.2}
      />
    </section>
  )
}
