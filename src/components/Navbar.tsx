import { useEffect, useState } from 'react'
import Wordmark from './Wordmark'
import { BUSINESS } from '../lib/site'

const MENU_LINKS = [
  { label: 'Projects', href: '#projects', icon: 'solar:gallery-linear' },
  { label: 'Philosophy', href: '#philosophy', icon: 'solar:maximize-square-linear' },
  { label: 'Materials', href: '#atelier', icon: 'solar:layers-minimalistic-linear' },
  { label: 'Gallery', href: '#gallery', icon: 'solar:gallery-linear' },
  { label: 'Contact', href: '#contact', icon: 'solar:letter-linear' },
]

/**
 * Fixed navigation, Archivo micro-type with .2em tracking.
 *
 * - `mix-blend-difference` keeps the bar legible over both the hero image and
 *   the bone bands
 * - the `nav` container is `pointer-events-none` with `pointer-events-auto` on
 *   its child, so it never swallows clicks aimed at the hero
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <>
      <nav className="pointer-events-none fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <div className="pointer-events-auto flex items-center justify-between gap-4 px-6 py-4 text-white sm:px-10 md:px-14">
          <a href="#top" aria-label={`${BUSINESS.name} — home`} className="flex items-baseline">
            <Wordmark />
          </a>

          <div className="flex items-center gap-6 sm:gap-8 md:gap-10">
            <a href="#projects" className="lbl u hidden md:inline-block">
              Projects
            </a>
            <a href="#contact" className="lbl u hidden lg:inline-block">
              Enquire
            </a>
            <span className="lbl num hidden items-center gap-2 opacity-70 xl:flex">
              <iconify-icon icon="solar:star-bold" width="12" height="12" />
              {BUSINESS.rating} · {BUSINESS.reviewCount}
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="flex items-center p-1 transition-opacity duration-500 hover:opacity-60"
            >
              <iconify-icon icon="solar:hamburger-menu-linear" width="24" height="24" />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen menu */}
      <div
        className={`fixed inset-0 z-[60] bg-bone transition-opacity duration-500 ease-smooth ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-6 py-4 sm:px-10 md:px-14">
            <Wordmark className="text-ink" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="p-1 text-ink transition-opacity duration-500 hover:opacity-60"
            >
              <iconify-icon icon="solar:close-circle-linear" width="24" height="24" />
            </button>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-8 sm:px-10 md:px-14">
            <p className="lbl mt-4 text-ink/40">Menu</p>
            <ul className="mt-6 border-t border-ink/10">
              {MENU_LINKS.map((link, i) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-center justify-between border-b border-ink/10 py-3.5 transition-colors duration-500 hover:bg-shell"
                  >
                    <span className="flex items-baseline gap-5">
                      <span className="lbl num text-ink/35">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="display text-[clamp(28px,5.6vw,64px)] text-ink">
                        {link.label}
                      </span>
                    </span>
                    <iconify-icon
                      icon={link.icon}
                      width="22"
                      height="22"
                      class="text-ink/40 transition-transform duration-500 ease-smooth group-hover:translate-x-1"
                    />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-auto grid gap-6 border-t border-ink/10 pt-6 sm:grid-cols-3">
              <div>
                <p className="lbl text-ink/40">Studio</p>
                <p className="copy mt-3 text-[13px] text-ink/70">
                  {BUSINESS.addressLines.join(', ')}
                </p>
              </div>
              <div>
                <p className="lbl text-ink/40">Call</p>
                <a href={BUSINESS.phoneHref} className="u num mt-3 inline-block text-ink">
                  {BUSINESS.phoneDisplay}
                </a>
                <p className="lbl mt-2 text-ink/45">{BUSINESS.hours}</p>
              </div>
              <div>
                <p className="lbl text-ink/40">Appointments</p>
                <a
                  href={BUSINESS.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="u mt-3 inline-block text-ink"
                >
                  Message on WhatsApp
                </a>
                <p className="lbl mt-2 text-ink/45">
                  {BUSINESS.rating} · {BUSINESS.reviewCount} reviews
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
