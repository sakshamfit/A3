import Wordmark from '../components/Wordmark'
import { BUSINESS } from '../lib/site'

const FOOTER_LINKS = ['Legal', 'Privacy', 'Credits'] as const

/** Section 9 — Footer. Stone-900 band, stacked on mobile, one row on desktop. */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="on-ink bg-stone-900 px-6 py-9 text-stone-400 sm:px-10 md:px-14">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-7">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="display text-[clamp(30px,5.2vw,62px)] text-stone-100">
              Let&apos;s build
              <br />
              <span className="accent">something</span>
            </p>
            <a
              href={BUSINESS.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn on-ink mt-6 border-stone-100 text-stone-100 hover:bg-stone-100 hover:text-stone-900"
            >
              Book a consultation
              <span className="ar" aria-hidden="true">
                →
              </span>
            </a>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:max-w-md md:gap-12">
            <div>
              <p className="lbl text-stone-500">Studio</p>
              <p className="copy mt-3 text-[13px] text-stone-400">
                {BUSINESS.addressLines.join(', ')}
              </p>
            </div>
            <div>
              <p className="lbl text-stone-500">Enquiries</p>
              <a
                href={BUSINESS.phoneHref}
                className="u num mt-3 inline-block text-[13px] text-stone-300"
              >
                {BUSINESS.phoneDisplay}
              </a>
              <p className="lbl mt-3 text-stone-500">{BUSINESS.hours}</p>
            </div>
          </div>
        </div>

        <hr className="h-px w-full border-0 bg-white/10" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <Wordmark className="text-stone-100" />
            <p className="lbl text-stone-500">
              © {year} {BUSINESS.name} · {BUSINESS.locality}
            </p>
          </div>

          <nav aria-label="Legal" className="flex items-center gap-6 md:gap-8">
            {FOOTER_LINKS.map((link) => (
              <a key={link} href="#top" className="lbl text-stone-500 hover:text-stone-100">
                {link}
              </a>
            ))}
            <a href="#top" className="lbl flex items-center gap-2 text-stone-500 hover:text-stone-100">
              Back to top
              <iconify-icon icon="solar:alt-arrow-up-linear" width="14" height="14" />
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
