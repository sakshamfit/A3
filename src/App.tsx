import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./sections/Footer"
import ScrollToTop from "./components/ScrollToTop"
import Home from "./pages/Home"
import Works from "./pages/Works"
import Studio from "./pages/Studio"
import Process from "./pages/Process"
import GalleryPage from "./pages/GalleryPage"
import ContactPage from "./pages/ContactPage"
import { QuantumCloudLoaderOverlay } from "./components/ui/quantum-cloud-loader"
import { installRevealSafetyNet, installScrollTriggerRefresh } from "./lib/gsap"

function AppShell() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const stopRefresh = installScrollTriggerRefresh()
    const stopSafetyNet = installRevealSafetyNet()
    const t = window.setTimeout(() => setLoading(false), 1550)
    return () => {
      window.clearTimeout(t)
      stopRefresh()
      stopSafetyNet?.()
    }
  }, [])

  // re-measure ScrollTrigger on route change (pinned sections differ per page)
  useEffect(() => {
    const t = window.setTimeout(() => {
      // @ts-ignore — gsap is global singleton
      import("./lib/gsap").then(({ gsap }) => {
        try {
          // @ts-ignore
          gsap.core?.globals?.().ScrollTrigger?.refresh()
        } catch {}
      })
    }, 80)
    return () => window.clearTimeout(t)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-bone text-ink">
      <QuantumCloudLoaderOverlay show={loading} />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/process" element={<Process />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <AppShell />
    </BrowserRouter>
  )
}
