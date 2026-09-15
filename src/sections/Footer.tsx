import Wordmark from '../components/Wordmark'
import { BUSINESS } from '../lib/site'

const FOOTER_LINKS = ['Legal', 'Privacy', 'Credits'] as const

/**
 * Section 8 — Footer. stone-900 band, stacked on mobile and a single row from
 * the desktop breakpoint up: wordmark + copyright on the left, utility links on
 * the right.
 */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-stone-900 px-6 py-10 text-stone-400 sm:px-10 md:px-14">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <Wordmark className="text-stone-100" />
          <p className="text-[12px] leading-relaxed">
            © {year} {BUSINESS.name} · {BUSINESS.locality}
          </p>
          <div className="flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-[0.24em]">
            <a
              href={BUSINESS.phoneHref}
              className="transition-colors duration-500 hover:text-stone-100"
            >
              {BUSINESS.phoneDisplay}
            </a>
            <a
              href={BUSINESS.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 transition-colors duration-500 hover:text-stone-100"
            >
              <iconify-icon icon="solar:chat-round-linear" width="15" height="15" />
              WhatsApp
            </a>
          </div>
        </div>

        <nav
          aria-label="Legal"
          className="flex items-center gap-6 md:gap-8"
        >
          {FOOTER_LINKS.map((link) => (
            <a
              key={link}
              href="#top"
              className="text-[11px] uppercase tracking-[0.24em] text-stone-400 transition-colors duration-500 hover:text-stone-100"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
