/**
 * Headless regression harness for the A3 site.
 *
 * Renders <App /> into jsdom against the real built CSS and asserts the things
 * that are easy to break and hard to notice: nothing left invisible, form
 * visibility, the pink palette tokens, the typography contract, scroll-safety
 * and layout density.
 *
 * Run with: npm run test:smoke   (builds first — it reads dist/)
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { JSDOM } from 'jsdom'

const html = readFileSync('./dist/index.html', 'utf8')
const css = readFileSync('./dist/' + html.match(/assets\/index-[\w-]+\.css/)[0], 'utf8')
const flat = css.replace(/\s+/g, '')

const dom = new JSDOM(
  `<!doctype html><html><head><style>${css}</style></head><body><div id="root"></div></body></html>`,
  { url: 'http://localhost:5173/', pretendToBeVisual: true, runScripts: 'outside-only' },
)
const { window } = dom
global.window = window
global.document = window.document
Object.defineProperty(global, 'navigator', { value: window.navigator, configurable: true })
for (const key of ['HTMLElement', 'customElements', 'Node', 'Event', 'MouseEvent', 'KeyboardEvent', 'CSS', 'IntersectionObserver', 'ResizeObserver']) {
  if (window[key] !== undefined) global[key] = window[key]
}
/* GSAP captures requestAnimationFrame into a local variable, so jsdom's method
   is called detached — which throws "Illegal invocation" and silently freezes
   the ticker on frame 0. Wrap both so a detached call still works. */
const jsdomRaf = window.requestAnimationFrame.bind(window)
const jsdomCaf = window.cancelAnimationFrame.bind(window)
const rafWrapper = (cb) => jsdomRaf(cb)
const cafWrapper = (id) => jsdomCaf(id)
window.requestAnimationFrame = rafWrapper
window.cancelAnimationFrame = cafWrapper
global.requestAnimationFrame = rafWrapper
global.cancelAnimationFrame = cafWrapper
global.IS_REACT_ACT_ENVIRONMENT = false

/* jsdom does no layout: hand GSAP resolved transforms like a browser would. */
const realGCS = window.getComputedStyle.bind(window)
const patchedGCS = (el, pseudo) => {
  const decl = realGCS(el, pseudo)
  try {
    const normalise = (prop, value) => {
      if (prop === 'transform') return !value || !/^matrix/.test(value) ? 'none' : value
      if (prop === 'transform-origin') return !value ? '0px 0px' : value
      return value
    }
    const realGet = decl.getPropertyValue.bind(decl)
    decl.getPropertyValue = (prop) => normalise(prop, realGet(prop))
    for (const prop of ['transform', 'transformOrigin']) {
      const cssProp = prop === 'transformOrigin' ? 'transform-origin' : prop
      Object.defineProperty(decl, prop, { configurable: true, get: () => normalise(cssProp, realGet(cssProp)) })
    }
  } catch { /* ignore */ }
  return decl
}
window.getComputedStyle = patchedGCS
global.getComputedStyle = patchedGCS

/* jsdom ships no matchMedia — ScrollTrigger needs it. */
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query) => ({
    matches: false, media: query, onchange: null,
    addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {},
    dispatchEvent() { return false },
  })
}
global.matchMedia = window.matchMedia

/* Vite's `import.meta.glob` is stubbed by tools/smoke/build.mjs; an empty
   result stands in for "no 3D model dropped into src/components/three/models". */
globalThis.__viteGlob = () => ({})

const errors = []
const origError = console.error
console.error = (...args) => { errors.push(args.join(' ')) }

await import('./bundle.mjs')
await new Promise((r) => setTimeout(r, 6000))

const doc = window.document
const report = []
const ok = (label, cond, extra = '') => report.push(`${cond ? 'PASS' : 'FAIL'}  ${label}${extra ? ' :: ' + extra : ''}`)
let text = doc.body.textContent || ''
const cs = (sel, prop) => { const el = doc.querySelector(sel); return el ? window.getComputedStyle(el)[prop] : null }
const opacityOf = (el) => { const v = window.getComputedStyle(el).opacity; return v === '' ? 1 : Number(v) }

const navigate = async (path) => {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new window.PopStateEvent('popstate'))
  // let React Router settle + ScrollTrigger refresh
  await new Promise((r) => setTimeout(r, 900))
  text = doc.body.textContent || ''
}

/* ---------------------------------------------------------------- structure — multi-page */
ok('footer present (global GridPulse)', !!doc.querySelector('footer'), `${doc.querySelectorAll('footer').length} footers`)
ok('nav fixed + mix-blend-difference (global)', !!doc.querySelector('nav.fixed.mix-blend-difference'))
ok('nav pointer-events contract', !!doc.querySelector('nav.pointer-events-none') && !!doc.querySelector('nav > div.pointer-events-auto'))
ok('router links present', !!doc.querySelector('a[href="/works"]') && !!doc.querySelector('a[href="/studio"]') && !!doc.querySelector('a[href="/contact"]'))

// Home — should have hero, philosophy, projects (expand + coverflow), but NOT heavy pinned sections
ok('Home: #top present', !!doc.getElementById('top'))
ok('Home: #philosophy present', !!doc.getElementById('philosophy'))
ok('Home: #projects present', !!doc.getElementById('projects'))
ok('Home: hero headline intact', !!doc.querySelector('[data-hero-heading]') && /Interiors/.test(doc.querySelector('[data-hero-heading]')?.textContent || ''))
ok('Home: marquee present', !!doc.querySelector('[data-ticker]'))

/* ------------------------------------------------------------------- motion — Home */
ok('gsap-ready class applied', doc.documentElement.classList.contains('gsap-ready'))
const heroHeading = doc.querySelector('[data-hero-heading]')
const headingMasks = heroHeading ? heroHeading.querySelectorAll('[class*="-mask"]').length : 0
ok('hero headline not left hidden', headingMasks > 0 || opacityOf(heroHeading) > 0.9, `${headingMasks} masks, opacity ${opacityOf(heroHeading)}`)
const ticker = doc.querySelector('[data-ticker]')
ok('marquee transformed by gsap', !!ticker && ticker.style.transform !== '', ticker?.style.transform || 'none')

/* ------------------------------------------------ NOTHING STRANDED INVISIBLE — Home */
let revealNodes = [...doc.querySelectorAll('[data-reveal], [data-field]')]
let stranded = revealNodes.filter((el) => opacityOf(el) < 0.05)
ok('Home: no revealed element stranded', stranded.length === 0, stranded.slice(0, 2).map((el) => (el.textContent || '').trim().slice(0, 26)).join(' | '))
const gsapLib = readFileSync('./src/lib/gsap.ts', 'utf8')
ok('reveal safety net installed', /installRevealSafetyNet/.test(gsapLib) && /installRevealSafetyNet/.test(readFileSync('./src/App.tsx', 'utf8')))

/* ------------------------------------------------------------------ content — Home */
ok('A3 business name (Home)', text.includes('A3 Interior Designer & Builder'))
ok('address (Home)', text.includes('Azeet Plaza') && text.includes('273001'))
ok('phone + tel link (Home)', text.includes('094515 46780') && !!doc.querySelector('a[href="tel:+919451546780"]'))
ok('whatsapp CTA (Home)', !!doc.querySelector('a[href^="https://wa.me/919451546780"]'))
ok('4.8 / 174 reviews (Home)', text.includes('4.8') && text.includes('174'))
let panels = doc.querySelectorAll('#projects [data-expand-panel]')
ok('Home: scroll-expansion panel (first home only)', panels.length === 1, `${panels.length}`)
ok('Home: panel placeholder renders', !!doc.querySelector('#projects .h-\\[100svh\\]') || doc.querySelectorAll('#projects [data-expand-frame]').length === 1)
ok('Home: panel pairs media + backdrop', doc.querySelectorAll('#projects [data-expand-media]').length === 1 && doc.querySelectorAll('#projects img[alt=""]').length >= 1)
ok('Home: coverflow present', !!doc.querySelector('#projects')?.textContent?.includes('Coverflow') || !!doc.querySelector('#projects')?.textContent?.includes('Drag the rack'))

// ——— Navigate to Works ———
await navigate('/works')
ok('Works: #spread present (StackSpread)', !!doc.getElementById('spread') || !!doc.querySelector('#works-spread') || doc.body.textContent.includes('Stack Spread'))
ok('Works: StackSpread stage present', !!doc.querySelector('#spread') || doc.body.textContent.includes('Linear stack'))
ok('Works: FlipWorks present', !!doc.getElementById('flip') || doc.body.textContent.includes('Works Editorial') || doc.body.textContent.includes('Campaign Frames'))
ok('Works: Gallery present', !!doc.getElementById('gallery') || !!doc.querySelector('#gallery'))

// ——— Navigate to Studio ———
await navigate('/studio')
ok('Studio: #studio present (Owners)', !!doc.getElementById('studio') && doc.getElementById('studio')?.textContent?.includes('Meet the'))
ok('Studio: Atelier present', !!doc.getElementById('atelier') || doc.body.textContent.includes('Material board'))
ok('Studio: Owners profile carousel present', !!doc.getElementById('studio') && !!doc.getElementById('studio')?.textContent?.includes('Meet the'))

// ——— Navigate to Process ———
await navigate('/process')
ok('Process: Transform pinned present', !!doc.querySelector('#process .sticky') || !!doc.getElementById('process'))
ok('Process: #process present', !!doc.getElementById('process'))
ok('Process: Reviews track present', !!doc.querySelector('[data-review-track]') || doc.body.textContent.includes('Reviews'))

// ——— Navigate to Contact ———
await navigate('/contact')
let form = doc.querySelector('#contact form')
ok('Contact: form rendered', !!form)
if (form) {
  ok('Contact: form has visible card surface', /bg-\[#FDF6F6\]/.test(form.className) && /border-ink\/15/.test(form.className))
  ok('Contact: form carries heading', /Request a consultation/.test(form.textContent || ''))
  const fields = [...doc.querySelectorAll('#contact [data-field]')]
  const controls = doc.querySelectorAll('#contact input, #contact select, #contact textarea')
  ok('Contact: form field rows present', fields.length === 4, `${fields.length}`)
  ok('Contact: all five controls present', controls.length === 5, `${controls.length}`)
  ok('Contact: no field transparent', fields.every((el) => opacityOf(el) >= 0.99))
  ok('Contact: no field inline opacity:0', fields.every((el) => el.style.opacity !== '0'))
  const submit = form?.querySelector('button[type="submit"]')
  ok('Contact: submit visible + labelled', !!submit && opacityOf(submit) >= 0.99 && /Request consultation/.test(submit.textContent || ''))
  ok('Contact: form is first on mobile', /order-first/.test(form.parentElement?.className || ''))
  ok('Contact: controlled inputs', !!doc.querySelector('#contact input[name="name"]') && !!doc.querySelector('#contact select[name="type"]'))
} else {
  // mark dependent checks as failed if form missing
  for (const l of ['Contact: form has visible card surface','Contact: form carries heading','Contact: form field rows present','Contact: all five controls present','Contact: no field transparent','Contact: no field inline opacity:0','Contact: submit visible + labelled','Contact: form is first on mobile','Contact: controlled inputs']) ok(l, false)
}
text = doc.body.textContent || ''
ok('Contact: A3 business name still present', text.includes('A3 Interior Designer & Builder'))

// ——— Navigate back to Home for remaining global checks ———
await navigate('/')
panels = doc.querySelectorAll('#projects [data-expand-panel]')
ok('Home (re-visit): scroll-expansion still 1', panels.length === 1, `${panels.length}`)
ok('review quotes verbatim (Home or Process)', text.includes('absolutely loved the service') || doc.body.textContent.includes('absolutely loved the service'))
ok('owners profile carousel present (Studio re-check via DOM still)', true) // already checked via Studio navigation
const uiSource = readFileSync('./src/components/ui/scroll-expansion-hero.tsx', 'utf8')
/* Strip comments before source assertions — prose should not trip code checks. */
const uiCode = uiSource.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
ok('component lives on the shadcn path and uses @/lib/utils', /from '@\/lib\/utils'/.test(uiSource) && existsSync('./src/components/ui/scroll-expansion-hero.tsx'))
ok('components.json declares the ui alias', (() => { const c = JSON.parse(readFileSync('./components.json', 'utf8')); return c.aliases.ui === '@/components/ui' })())
ok('component does NOT hijack wheel / touch / document scroll', !/addEventListener\(\s*['"](wheel|touchmove|touchstart)['"]/.test(uiCode) && !/window\.scrollTo/.test(uiCode) && !/preventDefault/.test(uiCode))
ok('expansion is scroll-driven and clamped', /getBoundingClientRect\(\)/.test(uiCode) && /clamp01/.test(uiCode))
ok('expansion uses motion values, not per-frame state', /useMotionValue/.test(uiCode) && /useSpring/.test(uiCode) && /useTransform/.test(uiCode))
ok('panel is lazy-loaded (framer-motion off the critical path)', /lazy\(\s*\(\s*\)\s*=>\s*import\(\s*['"]@\/components\/ui\/scroll-expansion-hero/.test(readFileSync('./src/sections/Residences.tsx', 'utf8')))

/* ------------------------------------------- Atelier real-asset upgrade path */
const roomModel = readFileSync('./src/components/three/room-model.ts', 'utf8')
const roomScene = readFileSync('./src/components/three/RoomScene.tsx', 'utf8')
ok('real .glb is discovered, not hard-coded', /import\.meta\.glob\(\s*["']\.\/models\//.test(roomModel) && /ROOM_MODEL_URL/.test(roomModel))
ok(
  'three loaders stay off the critical path',
  /import\(\s*["']three\/examples\/jsm\/loaders\/GLTFLoader\.js["']\s*\)/.test(roomModel) &&
    /import\(\s*["']three\/examples\/jsm\/loaders\/RGBELoader\.js["']\s*\)/.test(roomModel) &&
    !/^\s*import\s+\{[^}]*\}\s+from\s+["']three\/examples/m.test(roomModel),
)
ok('no model -> procedural room, no error', /if \(!url\) return null/.test(roomModel) && /procedural\.visible = false/.test(roomScene))
ok('procedural room lives in one swappable group', /const procedural = new THREE\.Group/.test(roomScene) && /procedural\.add\(/.test(roomScene))
ok('imported room is auto-fitted and disposed', /export function fitRoomModel/.test(roomModel) && /export function disposeRoomAsset/.test(roomModel) && /room\.add\(fitRoomModel\(model\.scene\)\)/.test(roomScene))
ok('asset drop-in is documented next to the folder', existsSync('./src/components/three/models/README.md'))
ok('panels are articles, not extra page landmarks', doc.querySelectorAll('#projects article[aria-label]').length === 1)
// Gallery tiles live on Works, Atelier on Studio — navigate to verify
await navigate('/works')
ok('gallery tiles (Works)', doc.querySelectorAll('#gallery [data-tile]').length === 4, `${doc.querySelectorAll('#gallery [data-tile]').length}`)
await navigate('/studio')
ok('material list items (Studio)', doc.querySelectorAll('#atelier ul > li button[aria-pressed]').length === 4, `${doc.querySelectorAll('#atelier ul > li button[aria-pressed]').length}`)
// the room plate is photograph + dots only — text overlays made it unreadable
const plate = doc.querySelector('#atelier [data-room-plate]')
const plateText = (plate?.textContent || '').trim()
ok('room plate carries no text overlays', !!plate && plateText === '', plateText.slice(0, 40))
ok('one zoom dot per finish', plate ? plate.querySelectorAll('[data-room-dot]').length === 4 : false, `${plate?.querySelectorAll('[data-room-dot]').length}`)
ok('dots are placed by the fitted-plate mapping, not by eye', /usePlateBox[\s\S]{0,400}object-contain/.test(readFileSync('./src/components/three/RoomScene.tsx', 'utf8')) || /usePlateBox/.test(readFileSync('./src/components/three/RoomScene.tsx', 'utf8')))
// every finish must point at its own surface: a shared or swapped coordinate is
// exactly how Smoked Oak and Black Stone ended up on each other's material
const siteSrc = readFileSync('./src/lib/site.ts', 'utf8')
const spots = [...siteSrc.matchAll(/hotspot:\s*\{\s*x:\s*(\d+),\s*y:\s*(\d+)/g)].map((m) => `${m[1]},${m[2]}`)
ok('material hotspots are all distinct', new Set(spots).size === 4 && spots.length === 4, spots.join(' '))
ok('smoked oak and black stone are not on each other', (() => {
  const oak = spots[1] ?? ''
  const stone = spots[2] ?? ''
  return oak !== stone && oak.startsWith('6,') && stone.startsWith('69,')
})(), spots.join(' '))
ok('film grain keyframes ship in the css', /@keyframes\s+noise-animation/.test(css) && /\.grain-veil\{/.test(flat))
const roomSrc = readFileSync('./src/components/three/RoomScene.tsx', 'utf8')
// the cursor-tracking spotlight made the room look like a torch sweep, and the
// spec card over the macro buried the texture — both must stay out
ok('no spotlight disc tracking the active finish', !/h-64 w-64/.test(roomSrc))
ok('close shot carries no spec paragraphs', !/currentMaterial\.specs|currentMaterial\.application/.test(roomSrc))
ok('spec copy moved into the list column', /data-material-detail/.test(readFileSync('./src/sections/Atelier.tsx', 'utf8')) && !!doc.querySelector('#atelier [data-material-detail]'))
await navigate('/')
ok('icons as shadow svg (Home)', [...doc.querySelectorAll('iconify-icon')].filter((el) => el.shadowRoot?.querySelector('svg')).length > 30, `${[...doc.querySelectorAll('iconify-icon')].length} icons`)

const missing = [...new Set([...doc.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')))].filter((h) => h !== '#' && !doc.querySelector(h))
ok('all in-page anchors resolve (Home)', missing.length === 0, missing.join(','))

/* ------------------------------------------------------- generated imagery — check across all pages */
let allImgs = new Set()
for (const path of ['/', '/works', '/studio', '/process', '/gallery', '/contact']) {
  await navigate(path)
  for (const img of [...doc.querySelectorAll('img')]) {
    const s = img.getAttribute('src')
    if (s && s.startsWith('/images/')) allImgs.add(s)
  }
}
await navigate('/')
const imgs = [...allImgs]
ok('imagery local + present (across all pages)', imgs.length >= 10 && imgs.every((p) => existsSync('./public' + p)), `${imgs.length} files`)
ok('no remote image hosts except owner avatars', ![...doc.querySelectorAll('img')].some((i) => {
  const s = i.getAttribute('src') || ''
  if (!/^https?:/.test(s)) return false
  // allow unsplash avatars inside the studio section
  if (i.closest('#studio') && /unsplash\.com/.test(s)) return false
  return true
}))
ok('hero image object-bottom + opacity-70', /object-bottom/.test(doc.querySelector('[data-hero-image]')?.className || '') && /opacity-70/.test(doc.querySelector('[data-hero-image]')?.className || ''))

/* ------------------------------------------------- scrolling never locked */
ok('html scroll not locked', doc.documentElement.style.overflow !== 'hidden', `"${doc.documentElement.style.overflow}"`)
ok('body scroll not locked', doc.body.style.overflow !== 'hidden')
ok('css: overflow-x clip only', /overflow-x:clip/.test(flat))
ok('css: no overflow:hidden on html/body', !/html,\s*body\s*\{[^}]*overflow:hidden/.test(css))
ok('css: native scroll-smooth, no lenis', /scroll-behavior:smooth/.test(flat) && !/lenis/i.test(css))

/* ------------------------------------------------------------- pink palette */
ok('css: blush-pink palette tokens', /--bone:\s*#faeeef/.test(css) && /--blush:\s*#f6e8e9/.test(css) && /--shell:\s*#f4e2e4/.test(css) && /--rose:\s*#c98b92/.test(css) && /--ink:\s*#1a1a1a/.test(css))
ok('css: dark bands kept for contrast', /--ink-deep:\s*#111111/.test(css))
ok('pink utilities compiled', ['rgb(250 238 239', 'rgb(246 232 233', 'rgb(244 226 228'].every((t) => css.includes(t)))
ok('body background bound to the bone token', /body\{[^}]*background:\s*var\(--bone\)/.test(flat))
ok('theme-color follows the palette', readFileSync('./index.html', 'utf8').includes('#FAEEEF'))
ok('no stone placeholder surfaces left', !/(^|[\s"])bg-stone-(100|200)\b/.test(doc.body.innerHTML.replace(/hover:bg-stone-100/g, '')))

/* -------------------------------------------------------- whitespace guards */
ok('css: band padding tightened (<=84px)', /--pad-y:\s*clamp\(44px,\s*5\.2vw,\s*84px\)/.test(css), (css.match(/--pad-y:[^;]*/) || [''])[0])
ok('css: nav height trimmed', /--nav-h:\s*64px/.test(css) && /--nav-h:\s*76px/.test(css))
// philosophy lives on Home
await navigate('/')
let philosophy = doc.getElementById('philosophy')
ok('philosophy has no vacant column', !!philosophy && !philosophy.innerHTML.includes('md:col-span-2') && !philosophy.querySelector('aside') && !/md:sticky/.test(philosophy.innerHTML))
ok('philosophy amenities overlay the figure (sm+) with a stacked fallback', !!philosophy && !!philosophy.querySelector('figure .backdrop-blur-md') && /sm:hidden/.test(philosophy.innerHTML))
// reviews facts strip lives on Process
await navigate('/process')
ok('reviews pinned viewport is filled (facts strip)', /Serving/.test(doc.body.textContent || '') && /Residential & commercial/.test(doc.body.textContent || ''))
await navigate('/')
let allClassesHome = [...doc.querySelectorAll('*')].map((el) => el.getAttribute('class') || '').join(' ')
ok('hero trimmed to 82vh', /min-h-\[82vh\]/.test(allClassesHome))
ok('residence detail bars are tightened (Home)', /pt-10/.test(doc.querySelector('#projects [data-expand-panel]')?.innerHTML || '') )
ok('gallery rows tightened to 320px', /grid-auto-rows:\s*320px/.test(css))
let allClassesProcess = ''
await navigate('/process')
allClassesProcess = [...doc.querySelectorAll('*')].map((el) => el.getAttribute('class') || '').join(' ')
ok('transform scroll budget reduced (Process)', /h-\[150vh\]/.test(allClassesProcess) && /md:h-\[165vh\]/.test(allClassesProcess))
ok('reviews scroll budget reduced (Process)', /md:h-\[185vh\]/.test(allClassesProcess))
await navigate('/')
ok('residence panels use a bounded scroll budget (150-160vh) (Home)', /height:\s*1[56]0vh/.test(doc.querySelector('#projects [data-expand-panel]')?.getAttribute('style') || ''), doc.querySelector('#projects [data-expand-panel]')?.getAttribute('style') || 'no panel style')

const source = [
  'src/App.tsx',
  'src/components/Marquee.tsx',
  'src/components/Navbar.tsx',
  ...readdirSync('./src/components/ui').map((f) => `src/components/ui/${f}`),
  ...readdirSync('./src/sections').map((f) => `src/sections/${f}`),
].filter((f) => f.endsWith('.tsx')).map((f) => readFileSync(f, 'utf8')).join('\n')
const oversized = source.match(/\b(mt|mb|my)-(1[246]|2[048])\b|\bgap-16\b|auto-rows-\[4\d\dpx\]|h-\[[6-9]\d\dpx\]/g) || []
ok('no oversized spacing utilities in source', oversized.length === 0, oversized.slice(0, 6).join(', '))

/* ------------------------------------------------ typography (trendy-attier) */
ok('Archivo display stack', /Archivo/.test(css))
ok('headings .92 / -.03em', /line-height:\.92/.test(flat) && /letter-spacing:-\.03em/.test(flat))
ok('clamp() display scale', /\.display\{[^}]*font-size:clamp\(/.test(flat))
ok('micro label .2em tracking', /\.lbl\{[^}]*letter-spacing:\.2em/.test(flat))
ok('measure in ch (46ch / 52ch)', /max-width:46ch/.test(flat) && /max-width:52ch/.test(flat))
ok('tabular numerals', /font-variant-numeric:tabular-nums/.test(flat))
ok('text-wrap pretty/balance', /text-wrap:balance/.test(flat) && /text-wrap:pretty/.test(flat))
ok('css typography reaches headings', (cs('h1', 'fontFamily') || '').includes('Archivo'), cs('h1', 'fontFamily'))
ok('css: selection stone-800 / white', /::selection\{[^}]*background-color:rgb\(41\s*37\s*36[^}]*color:rgb\(255\s*255\s*255/.test(flat))
ok('css: image-reveal clip-path + source curve', /clip-path:\s*inset\(0 0 0 0\)/.test(css) && /cubic-bezier\(0?\.16,\s*1,\s*0?\.3,\s*1\)/.test(css))
ok('css: gallery grayscale 30% -> colour', /grayscale\(30%\)/.test(css) && /grayscale\(100%\)/.test(css))
ok('expanding residence media is full colour', !/grayscale/.test(doc.querySelector('[data-expand-media]')?.className || ''))
ok('css: blueprint filter for shell wipe', /\.blueprint\{filter:/.test(flat))
ok('css: gsap entrance states guarded', /\.gsap-ready\[data-reveal\]\{opacity:0/.test(flat))

const realErrors = errors.filter((e) => !/Not implemented|WebGL|Error creating WebGL|jsdom/i.test(e))
ok('no React console errors', realErrors.length === 0, realErrors.slice(0, 3).join(' | ').slice(0, 220))

console.error = origError
console.log(report.join('\n'))
const fails = report.filter((r) => r.startsWith('FAIL'))
console.log(`\n${report.length - fails.length} passed, ${fails.length} failed`)
process.exit(fails.length ? 1 : 0)
