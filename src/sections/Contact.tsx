import { useState, type ChangeEvent, type FormEvent } from 'react'
import { gsap, useGsap } from '../lib/gsap'
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
 * Section 8 — Contact. Two columns: the studio's details on the left, the
 * underlined form on the right. Submitting composes a WhatsApp message — no
 * server, nothing stored.
 */
export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [sent, setSent] = useState(false)

  const scope = useGsap<HTMLElement>((el, { reduced }) => {
    if (reduced) {
      gsap.set(el.querySelectorAll('[data-reveal]'), { opacity: 1, y: 0 })
      return
    }
    gsap.fromTo(
      el.querySelectorAll('[data-field]'),
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 72%', once: true },
      },
    )
  }, [])

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
      <div className="wrap grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-10">
        {/* Studio details */}
        <div>
          <p data-reveal className="lbl text-ink/40">
            Contact
          </p>
          <h2 data-reveal className="headline mt-4 max-w-[18ch] text-ink">
            Come see the <span className="accent">studio</span>
          </h2>
          <p data-reveal className="lede mt-4 text-ink/60">
            {BUSINESS.description} Walk in for a free consultation, bring your floor plan — or
            just your Pinterest board.
          </p>

          <div className="mt-8 space-y-6">
            <div data-reveal className="flex gap-4">
              <iconify-icon
                icon="solar:map-point-linear"
                width="20"
                height="20"
                class="mt-1 shrink-0 text-ink/45"
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
                  className="lbl u mt-3 inline-block text-ink/60"
                >
                  Get directions
                </a>
              </div>
            </div>

            <div data-reveal className="flex gap-4">
              <iconify-icon
                icon="solar:phone-calling-linear"
                width="20"
                height="20"
                class="mt-1 shrink-0 text-ink/45"
              />
              <div>
                <p className="lbl text-ink/40">Call or WhatsApp</p>
                <a href={BUSINESS.phoneHref} className="u num mt-3 inline-block text-ink">
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

            <div data-reveal className="flex gap-4">
              <iconify-icon
                icon="solar:clock-circle-linear"
                width="20"
                height="20"
                class="mt-1 shrink-0 text-ink/45"
              />
              <div>
                <p className="lbl text-ink/40">Hours</p>
                <p className="copy mt-3 text-[15px] text-ink/70">{BUSINESS.hours}</p>
                <p className="copy mt-1 text-[13px] text-ink/50">{BUSINESS.hoursNote}</p>
              </div>
            </div>

            <div data-reveal className="border-t border-ink/10 pt-7">
              <p className="lbl text-ink/40">Services</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {SERVICES.map((service) => (
                  <li
                    key={service}
                    className="lbl border border-ink/10 bg-bone px-4 py-2 text-ink/65"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div data-field>
              <label htmlFor="name" className="lbl block text-ink/40">
                Name
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
                className="field mt-2.5"
              />
            </div>
            <div data-field>
              <label htmlFor="phone" className="lbl block text-ink/40">
                Phone
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
                className="field mt-3"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div data-field className="relative">
              <label htmlFor="type" className="lbl block text-ink/40">
                Project type
              </label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={update('type')}
                className="field mt-2.5 appearance-none pr-8"
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
                class="pointer-events-none absolute bottom-4 right-0 text-ink/50"
              />
            </div>
            <div data-field>
              <label htmlFor="area" className="lbl block text-ink/40">
                Approx. area
              </label>
              <input
                id="area"
                name="area"
                type="text"
                value={form.area}
                onChange={update('area')}
                placeholder="1,800 sq ft"
                className="field mt-3"
              />
            </div>
          </div>

          <div data-field>
            <label htmlFor="message" className="lbl block text-ink/40">
              Tell us about the space
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={form.message}
              onChange={update('message')}
              placeholder="Rooms, timeline, and anything you already love."
              className="field mt-2.5 resize-none"
            />
          </div>

          <div data-field className="flex flex-wrap items-center gap-6">
            <button type="submit" className="btn">
              Request consultation
              <span className="ar" aria-hidden="true">
                →
              </span>
            </button>
            <p className="copy text-[12px] text-ink/45" aria-live="polite">
              {sent
                ? 'WhatsApp is opening with your details.'
                : 'Opens WhatsApp with your details — nothing is stored here.'}
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
