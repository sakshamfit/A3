import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Philosophy from './sections/Philosophy'
import Residences from './sections/Residences'
import Highlights from './sections/Highlights'
import Gallery from './sections/Gallery'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

export default function App() {
  return (
    /*
      No height clamp, no overflow lock and no smooth-scroll library — the page
      is a plain, naturally scrolling document from #top to the footer.
    */
    <div className="min-h-screen bg-bone text-ink">
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <Residences />
        <Highlights />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
