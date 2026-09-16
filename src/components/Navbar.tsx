import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Wordmark from './Wordmark'
import { BUSINESS } from '../lib/site'

const MENU_LINKS = [
  { label: 'Home', to: '/', icon: 'solar:gallery-linear', desc: 'Hero · Philosophy · Residences' },
  { label: 'Works', to: '/works', icon: 'solar:layers-minimalistic-linear', desc: 'Stack Spread · Flip · Gallery' },
  { label: 'Developers', to: '/studio', icon: 'solar:users-group-rounded-linear', desc: 'Owners · Atelier' },
  { label: 'Process', to: '/process', icon: 'solar:maximize-square-linear', desc: 'Shell → Finished · Reviews' },
  { label: 'Gallery', to: '/gallery', icon: 'solar:gallery-linear', desc: 'Mosaic of 18 rooms' },
  { label: 'Contact', to: '/contact', icon: 'solar:letter-linear', desc: 'Visit · Enquire' },
] as const

/**
 * Fixed navigation, Archivo micro-type with .2em tracking.
 * Multi-page: uses React Router Links, mix-blend-difference keeps it legible
 * over hero and bone bands. Menu is a full-screen index, not an anchor list.
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

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

  // close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <nav className="pointer-events-none fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <div className="pointer-events-auto flex items-center justify-between gap-4 px-6 py-4 text-white sm:px-10 md:px-14">
          <Link to="/" aria-label={`${BUSINESS.name} — home`} className="flex items-baseline">
            <Wordmark />
          </Link>

          <div className="flex items-center gap-6 sm:gap-8 md:gap-10">
            <Link to="/works" className="lbl u hidden md:inline-block">
              Works
            </Link>
            <Link to="/studio" className="lbl u hidden md:inline-block">
              Developers
            </Link>
            <Link to="/contact" className="lbl u hidden lg:inline-block">
              Enquire
            </Link>
            <span className="lbl num hidden items-center gap-2 opacity-70 xl:flex">
              <iconify-icon icon="solar:star-bold" width="12" height="12" />
              {BUSINESS.rating} · {BUSINESS.reviewCount}
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="flex items-center gap-2 p-1 transition-opacity duration-500 hover:opacity-60"
            >
              <span className="lbl hidden sm:inline">Menu</span>
              <iconify-icon icon="solar:hamburger-menu-linear" width="24" height="24" />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen menu — now an index of pages, not anchors */}
      <div
        className={`fixed inset-0 z-[60] bg-bone transition-opacity duration-500 ease-smooth ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-6 py-4 sm:px-10 md:px-14">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <Wordmark className="text-ink" />
            </Link>
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
            <p className="lbl mt-4 text-ink/40">Index — choose a page</p>
            <ul className="mt-6 border-t border-ink/10">
              {MENU_LINKS.map((link, i) => {
                const isActive = location.pathname === link.to
                return (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className={`group flex items-center justify-between border-b py-3.5 transition-colors duration-500 hover:bg-shell ${
                        isActive ? 'border-ink bg-shell' : 'border-ink/10'
                      }`}
                    >
                      <span className="flex items-baseline gap-5">
                        <span className={`lbl num ${isActive ? 'text-ink' : 'text-ink/35'}`}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="flex flex-col">
                          <span
                            className={`display text-[clamp(28px,5.6vw,64px)] ${isActive ? 'text-ink' : 'text-ink'}`}
                          >
                            {link.label}
                          </span>
                          <span className="lbl mt-1 hidden text-ink/40 sm:block">{link.desc}</span>
                        </span>
                      </span>
                      <span className="flex items-center gap-3">
                        {isActive && (
                          <span className="hidden rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold tracking-wide text-bone sm:inline-block">
                            Now
                          </span>
                        )}
                        <iconify-icon
                          icon={link.icon}
                          width="22"
                          height="22"
                          class={`transition-transform duration-500 ease-smooth group-hover:translate-x-1 ${isActive ? 'text-ink' : 'text-ink/40'}`}
                        />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-ink/10 pt-6">
              <Link to="/works" onClick={() => setMenuOpen(false)} className="btn">
                See works
                <span className="ar" aria-hidden="true">→</span>
              </Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="tlink">
                Book a consultation
              </Link>
            </div>

            <div className="mt-auto grid gap-6 border-t border-ink/10 pt-6 sm:grid-cols-3">
              <div>
                <p className="lbl text-ink/40">Developers</p>
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
