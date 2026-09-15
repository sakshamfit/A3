/**
 * Adds `gsap-ready` to <html> on first paint so the GSAP entrance states in
 * `index.css` (opacity 0 / translateY) only ever apply when JS is running.
 * Without JS the page renders in full.
 */
export function markGsapReady() {
  document.documentElement.classList.add('gsap-ready')
}

export function clearGsapReady() {
  document.documentElement.classList.remove('gsap-ready')
}
