import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Marquee from './components/Marquee'
import Hero from './sections/Hero'
import Philosophy from './sections/Philosophy'
import Residences from './sections/Residences'
import Atelier from './sections/Atelier'
import Transform from './sections/Transform'
import Gallery from './sections/Gallery'
import Reviews from './sections/Reviews'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import { installScrollTriggerRefresh } from './lib/gsap'

export default function App() {
  /* ScrollTrigger measures early — re-measure once fonts and images settle. */
  useEffect(() => installScrollTriggerRefresh(), [])

  return (
    /*
      A plain, naturally scrolling document: no height clamp, no overflow lock,
      no smooth-scroll library. Motion is GSAP + ScrollTrigger only, and every
      section reverts its animations when it unmounts.
    */
    <div className="min-h-screen bg-bone text-ink">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Philosophy />
        <Residences />
        <Atelier />
        <Transform />
        <Gallery />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
