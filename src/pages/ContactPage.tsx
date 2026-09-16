import Contact from "@/sections/Contact"

/**
 * Contact — isolated, no pinned neighbours, form is the hero.
 */
export default function ContactPage() {
  return (
    <>
      <section className="bg-bone pt-[calc(var(--nav-h)+28px)]">
        <div className="wrap pb-6">
          <p className="lbl text-ink/40">Contact · Index</p>
          <h1 className="headline mt-3 text-ink">
            Come see our <span className="accent">developers</span>
          </h1>
          <p className="lede mt-3 max-w-[52ch] text-ink/60">
            Second Floor, Azeet Plaza — bring your floor plan or just your
            Pinterest board. Form sends straight to WhatsApp, nothing stored.
          </p>
        </div>
      </section>
      <Contact />
    </>
  )
}
