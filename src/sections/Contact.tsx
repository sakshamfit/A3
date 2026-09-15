import { useState, type ChangeEvent, type FormEvent } from 'react'
import Reveal from '../components/Reveal'
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
 * Section 7 — Contact.
 *
 * stone-100 band, two-column grid: studio details on the left, the underlined
 * form on the right. Submitting composes a WhatsApp message — no server, no
 * stored data.
 */
export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [sent, setSent] = useState(false)

  const update =
    (key: keyof typeof INITIAL_FORM) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = [
      `Hello A3 Interior Designer & Builder,`,
      ``,
      `Name: ${form.name || '—'}`,
      `Phone: ${form.phone || '—'}`,
      `Project type: ${form.type}`,
      `Approx. area: ${form.area || '—'}`,
      form.message ? `Details: ${form.message}` : '',
      ``,
      `I would like to book a design consultation.`,
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
    <section id="contact" className="bg-stone-100 px-6 py-24 sm:px-10 md:px-14 md:py-32">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-12">
        {/* Studio details */}
        <div>
          <Reveal>
            <p className="label text-ink/40">Contact</p>
            <h2 className="mt-6 max-w-md text-3xl font-light leading-[1.08] tracking-tighter text-ink sm:text-4xl md:text-5xl">
              Come see the{' '}
              <span className="font-serif italic font-light">studio</span>.
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink/60">
              {BUSINESS.description} Walk in for a free consultation, bring your
              floor plan — or just your Pinterest board.
            </p>
          </Reveal>

          <Reveal delay={80} className="mt-12 space-y-8">
            <div className="flex gap-4">
              <iconify-icon
                icon="solar:map-point-linear"
                width="20"
                height="20"
                class="mt-1 shrink-0 text-ink/45"
              />
              <div>
                <p className="label text-ink/40">Address</p>
                <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink/70">
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
                  className="group mt-3 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-ink/60 transition-colors duration-500 hover:text-ink"
                >
                  <span className="link-underline">Get directions</span>
                  <iconify-icon
                    icon="solar:arrow-right-linear"
                    width="15"
                    height="15"
                    class="transition-transform duration-500 ease-smooth group-hover:translate-x-1"
                  />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <iconify-icon
                icon="solar:phone-calling-linear"
                width="20"
                height="20"
                class="mt-1 shrink-0 text-ink/45"
              />
              <div>
                <p className="label text-ink/40">Call or WhatsApp</p>
                <a
                  href={BUSINESS.phoneHref}
                  className="link-underline mt-3 inline-block text-[15px] text-ink"
                >
                  {BUSINESS.phoneDisplay}
                </a>
                <p className="mt-1 text-[13px] text-ink/50">
                  Appointments on{' '}
                  <a
                    href={BUSINESS.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline text-ink/70"
                  >
                    wa.me
                  </a>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <iconify-icon
                icon="solar:clock-circle-linear"
                width="20"
                height="20"
                class="mt-1 shrink-0 text-ink/45"
              />
              <div>
                <p className="label text-ink/40">Hours</p>
                <p className="mt-3 text-[15px] text-ink/70">{BUSINESS.hours}</p>
                <p className="mt-1 text-[13px] text-ink/50">{BUSINESS.hoursNote}</p>
              </div>
            </div>

            <div className="border-t border-ink/10 pt-8">
              <p className="label text-ink/40">Services</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {SERVICES.map((service) => (
                  <li
                    key={service}
                    className="rounded-full border border-ink/10 bg-bone px-4 py-2 text-[12px] text-ink/65"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Form */}
        <Reveal delay={120}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="label block text-ink/40">
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
                  className="field mt-3"
                />
              </div>
              <div>
                <label htmlFor="phone" className="label block text-ink/40">
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

            <div className="grid gap-8 sm:grid-cols-2">
              <div className="relative">
                <label htmlFor="type" className="label block text-ink/40">
                  Project type
                </label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={update('type')}
                  className="field mt-3 appearance-none pr-8"
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
              <div>
                <label htmlFor="area" className="label block text-ink/40">
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

            <div>
              <label htmlFor="message" className="label block text-ink/40">
                Tell us about the space
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={update('message')}
                placeholder="Rooms, timeline, and anything you already love."
                className="field mt-3 resize-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button
                type="submit"
                className="no-tap-highlight bg-ink px-8 py-4 text-[11px] font-medium uppercase tracking-[0.28em] text-bone transition-colors duration-500 hover:bg-ink/85"
              >
                Request consultation
              </button>
              <p className="text-[12px] leading-relaxed text-ink/45" aria-live="polite">
                {sent
                  ? 'WhatsApp is opening with your details.'
                  : 'Opens WhatsApp with your details — nothing is stored here.'}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
