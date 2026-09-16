import { useState, type ChangeEvent, type FormEvent } from 'react'
import { revealIn, useGsap } from '../lib/gsap'
import { BUSINESS, SERVICES } from '../lib/site'

const PROJECT_TYPES = [
  'Residential interiors',
  'Modular kitchen',
  'Wardrobes & storage',
  'Commercial fit-out',
  'Architecture',
  'Something else',
] as const

const INITIAL_FORM = {
  name: '',
  phone: '',
  type: PROJECT_TYPES[0] as string,
  area: '',
  message: '',
}

/**
 * Section — Contact.
 *
 * The form is deliberately loud: it sits on its own card above the blush band
 * with a visible surface, a heading and underlined fields. Motion is
 * translate-only — the fields are never a `from { opacity: 0 }` target, so the
 * form cannot be left invisible by a mis-timed ScrollTrigger.
 */
export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [sent, setSent] = useState(false)

  /* The form is never a hide/reveal target — its card fades in with everything
     else, but no field is touched, so the form cannot be left invisible. */
  const scope = useGsap<HTMLElement>((el, { reduced }) => revealIn(el, reduced, { distance: 18 }), [])

  const update =
    (key: keyof typeof INITIAL_FORM) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = [
      'Hello A3 Interior Designer & Builder,',
      '',
      `Name: ${form.name || '—'}`,
      `Phone: ${form.phone || '—'}`,
      `Project type: ${form.type}`,
      `Approx. area: ${form.area || '—'}`,
      form.message ? `Details: ${form.message}` : '',
      '',
      'I would like to book a design consultation.',
    ]
      .filter(Boolean)
      .join('\n')

    window.open(
      `${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    )
    setSent(true)
  }

  return (
    <section ref={scope} id="contact" className="band bg-blush">
      <div className="wrap grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-10">
        {/* Studio details — second on mobile, first on desktop */}
        <div className="order-last md:order-none md:col-span-5">
          <p data-reveal className="lbl text-ink/40">
            Contact
          </p>
          <h2 data-reveal className="headline mt-4 max-w-[16ch] text-ink">
            Come see our <span className="accent">developers</span>
          </h2>
          <p data-reveal className="lede mt-4 text-ink/60">
            {BUSINESS.description} Walk in for a free consultation, bring your floor plan — or
            just your Pinterest board.
          </p>

          <div className="mt-7 space-y-5">
            <div data-reveal className="flex gap-4 border-t border-ink/10 pt-5">
              <iconify-icon
                icon="solar:map-point-linear"
                width="20"
                height="20"
                class="mt-0.5 shrink-0 text-ink/45"
              />
              <div>
                <p className="lbl text-ink/40">Address</p>
                <p className="copy mt-2 text-[14.5px] text-ink/70">
                  {BUSINESS.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                <a
                  href={BUSINESS.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="lbl u mt-2.5 inline-block text-ink/60"
                >
                  Get directions
                </a>
              </div>
            </div>

            <div data-reveal className="flex gap-4 border-t border-ink/10 pt-5">
              <iconify-icon
                icon="solar:phone-calling-linear"
                width="20"
                height="20"
                class="mt-0.5 shrink-0 text-ink/45"
              />
              <div>
                <p className="lbl text-ink/40">Call or WhatsApp</p>
                <a href={BUSINESS.phoneHref} className="u num mt-2.5 inline-block text-ink">
                  {BUSINESS.phoneDisplay}
                </a>
                <p className="lbl mt-2 text-ink/50">
                  Appointments on{' '}
                  <a
                    href={BUSINESS.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="u text-ink/70"
                  >
                    wa.me
                  </a>
                </p>
              </div>
            </div>

            <div data-reveal className="flex gap-4 border-t border-ink/10 pt-5">
              <iconify-icon
                icon="solar:clock-circle-linear"
                width="20"
                height="20"
                class="mt-0.5 shrink-0 text-ink/45"
              />
              <div>
                <p className="lbl text-ink/40">Hours</p>
                <p className="copy mt-2 text-[14.5px] text-ink/70">{BUSINESS.hours}</p>
                <p className="copy mt-1 text-[12.5px] text-ink/50">{BUSINESS.hoursNote}</p>
              </div>
            </div>

            <div data-reveal className="border-t border-ink/10 pt-5">
              <p className="lbl text-ink/40">Services</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {SERVICES.map((service) => (
                  <li
                    key={service}
                    className="lbl border border-ink/15 bg-bone px-3.5 py-2 text-ink/70"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Enquiry form — its own card, first on mobile */}
        <div data-reveal className="order-first md:order-none md:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="border border-ink/15 bg-[#FDF6F6] p-6 shadow-[0_1px_0_rgba(26,26,26,0.04)] sm:p-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="lbl text-ink/45">Enquiry</p>
                <h3 className="subhead mt-2 text-[clamp(19px,2vw,24px)] text-ink">
                  Request a consultation
                </h3>
              </div>
              <p className="lbl flex items-center gap-2 text-ink/45">
                <iconify-icon icon="solar:star-bold" width="12" height="12" />
                {BUSINESS.rating} · {BUSINESS.reviewCount} reviews
              </p>
            </div>

            <div className="mt-7 space-y-6">
              <div data-field className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="lbl block text-ink/55">
                    Name <span className="text-rose">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Your full name"
                    className="field mt-2"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="lbl block text-ink/55">
                    Phone <span className="text-rose">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder="+91 00000 00000"
                    className="field mt-2"
                  />
                </div>
              </div>

              <div data-field className="grid gap-6 sm:grid-cols-2">
                <div className="relative">
                  <label htmlFor="type" className="lbl block text-ink/55">
                    Project type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={form.type}
                    onChange={update('type')}
                    className="field mt-2 appearance-none pr-8"
                  >
                    {PROJECT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <iconify-icon
                    icon="solar:alt-arrow-down-linear"
                    width="16"
                    height="16"
                    class="pointer-events-none absolute bottom-3.5 right-0 text-ink/50"
                  />
                </div>
                <div>
                  <label htmlFor="area" className="lbl block text-ink/55">
                    Approx. area
                  </label>
                  <input
                    id="area"
                    name="area"
                    type="text"
                    value={form.area}
                    onChange={update('area')}
                    placeholder="1,800 sq ft"
                    className="field mt-2"
                  />
                </div>
              </div>

              <div data-field>
                <label htmlFor="message" className="lbl block text-ink/55">
                  Tell us about the space
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  value={form.message}
                  onChange={update('message')}
                  placeholder="Rooms, timeline, and anything you already love."
                  className="field mt-2 resize-none"
                />
              </div>

              <div data-field className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-ink/10 pt-6">
                <button type="submit" className="btn">
                  Request consultation
                  <span className="ar" aria-hidden="true">
                    →
                  </span>
                </button>
                <a
                  href={BUSINESS.phoneHref}
                  className="tlink border-ink/40 text-ink/80"
                >
                  Or call {BUSINESS.phoneDisplay}
                </a>
              </div>

              <p className="copy text-[12px] text-ink/50" aria-live="polite">
                {sent
                  ? 'WhatsApp is opening with your details.'
                  : 'Sends your details straight to our developers on WhatsApp — nothing is stored on this site.'}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
