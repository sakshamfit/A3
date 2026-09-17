import Hero from "@/sections/Hero"
import Philosophy from "@/sections/Philosophy"
import Residences from "@/sections/Residences"
import { Link } from "react-router-dom"
import { BUSINESS, IMAGES } from "@/lib/site"
import { InfinitePerspectiveSlider, SliderItem } from "@/components/ui/infinite-perspective-slider"

const PERSPECTIVE_SLIDES: SliderItem[] = [
  {
    id: "betiahata-library",
    title: "Arched Oak Library",
    subtitle: "Betiahata Private Estate",
    category: "Joinery & Library",
    location: "Betiahata · Gorakhpur",
    year: "2024",
    specs: "Full-height smoked oak bookstacks with honed travertine reveals",
    image: IMAGES.archedLibrary,
    quote: "We absolutely loved the service from A3 interior designer & builders.",
    href: "/works",
  },
  {
    id: "ivory-culinary",
    title: "Monolithic Ivory Kitchen",
    subtitle: "Civil Lines Duplex",
    category: "Modular Kitchen",
    location: "Civil Lines · Gorakhpur",
    year: "2024",
    specs: "Brushed black granite plinth & fluted cabinetry with soft servo-drive",
    image: IMAGES.ivoryKitchen,
    href: "/works",
  },
  {
    id: "obsidian-penthouse",
    title: "Obsidian Horizon Lounge",
    subtitle: "Taramandal Tower",
    category: "Living Suite",
    location: "Taramandal · Gorakhpur",
    year: "2024",
    specs: "Slatted acoustic smoked oak panelling with concealed pivot entrance",
    image: IMAGES.obsidianLuxe,
    href: "/works",
  },
  {
    id: "brass-sanctuary",
    title: "Travertine Master Bath",
    subtitle: "Park Road Residence",
    category: "Sanctuary",
    location: "Park Road · Gorakhpur",
    year: "2023",
    specs: "Unfilled Roman travertine monolithic basin and unlacquered brass fittings",
    image: IMAGES.brassBath,
    href: "/works",
  },
  {
    id: "sage-suite",
    title: "Mineral Sage Bedroom",
    subtitle: "Medical College Road",
    category: "Master Suite",
    location: "Medical Road · Gorakhpur",
    year: "2023",
    specs: "Hand-trowelled limewash walls with bespoke built-in oak floating headboard",
    image: IMAGES.sageBedroom,
    href: "/works",
  },
  {
    id: "courtyard-atrium",
    title: "Sunlit Courtyard Atrium",
    subtitle: "Rustampur Villa",
    category: "Architecture & Light",
    location: "Rustampur · Gorakhpur",
    year: "2023",
    specs: "Architectural clerestory glazing, fluted columns and living planter ledges",
    image: IMAGES.courtyard,
    href: "/works",
  },
  {
    id: "oak-pavilion",
    title: "Smoked Oak Dining Pavilion",
    subtitle: "Golghar Executive Suite",
    category: "Dining Room",
    location: "Golghar · Gorakhpur",
    year: "2024",
    specs: "Cantilevered solid European oak banquet table with sculptural plaster ceiling",
    image: IMAGES.oakDining,
    href: "/works",
  },
]

/**
 * Home — clean landing, not overloaded.
 * Residences scroll-expansion, followed by works teaser and
 * Hyperiux Infinite Perspective Slider.
 */
export default function Home() {
  return (
    <>
      <Hero />
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

      {/* Infinite Perspective Slider (Hyperiux Vault component) replacing previous static reviews */}
      <section id="perspective-slider" className="border-t border-ink/10 bg-bone">
        <InfinitePerspectiveSlider
          items={PERSPECTIVE_SLIDES}
          badge="3D Spatial Archive"
          heading={
            <>
              Infinite <span className="accent">Perspective</span> Slider
            </>
          }
          subheading={
            <div className="flex flex-col gap-1">
              <p>
                Drag, wheel, or swipe horizontally to inspect our bespoke interior commissions in dynamic 3D tilt perspective.
              </p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-ink/50 mt-1">
                {BUSINESS.rating} Rating · {BUSINESS.reviewCount} Verified Commissions
              </p>
            </div>
          }
        />
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
