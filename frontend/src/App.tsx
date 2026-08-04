import { Suspense, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/Tooltip'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileCta } from '@/components/layout/MobileCta'
import { SkipLink } from '@/components/common/SkipLink'
import { Preloader } from '@/components/motion/Preloader'
import { ScrollProgress } from '@/components/motion/ScrollProgress'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { ScrollSignal } from '@/components/motion/ScrollSignal'
import { SceneBackdrop } from '@/components/three/SceneBackdrop'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { useTheme } from '@/hooks/useTheme'
import { sectionIds } from '@/constants/site'
import { ScrollTrigger } from '@/hooks/useGsap'
import { routes } from '@/routes'

/** Rota değişince sayfayı en üste alır (hash varsa dokunmaz). */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, behavior: 'auto' })
    // Yeni sayfanın yükseklikleri değiştiği için tetikleyicileri tazele.
    ScrollTrigger.refresh()
  }, [pathname, hash])

  return null
}

export default function App() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const activeSection = useActiveSection(sectionIds, isHome)
  const { reduced } = useMotionProfile()
  const { theme, toggleTheme } = useTheme()

  return (
    <TooltipProvider delayDuration={120} skipDelayDuration={300}>
      <Preloader />
      <SmoothScroll />
      {/* `scrollState`'i besleyen tek yazıcı — 3B sahne ve hız efektleri
          bu değerleri okur, kendi dinleyicilerini açmaz. */}
      <ScrollSignal />
      <ScrollToTop />
      <ScrollProgress />
      <SkipLink />

      {/* Sayfanın tamamının arkasında duran, kaydırmayla sürülen 3B katman.
          `z-0`; içerik katmanları `z-10` taşıdığı için her zaman altta kalır. */}
      <SceneBackdrop theme={theme} />

      <Header activeSection={activeSection} theme={theme} onToggleTheme={toggleTheme} />

      <main id="ana-icerik" className="relative z-10">
        {/* Sayfalar arası yumuşak geçiş */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <Suspense fallback={<div className="min-h-svh" aria-hidden="true" />}>
              <Routes location={pathname}>
                {routes.map((route) =>
                  route.index ? (
                    <Route key="index" index element={route.element} />
                  ) : (
                    <Route key={route.path} path={route.path} element={route.element} />
                  ),
                )}
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
      {isHome && <MobileCta />}
    </TooltipProvider>
  )
}
