import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useMotionProfile } from '@/hooks/useMotionProfile'

const STORAGE_KEY = 'uy:visited'
/** Açılış animasyonu kısa tutulur — kullanıcı boş ekranla bekletilmez. */
const DURATION_MS = 850

/**
 * Kısa açılış animasyonu.
 * - Aynı oturumda ikinci kez gösterilmez.
 * - Hareket azaltma tercihinde hiç çalışmaz.
 * - Arkadaki içerik zaten hazırdır; bu katman yalnızca üstte durur.
 */
/** Bu oturumda açılış animasyonu daha önce gösterildi mi? */
function alreadySeen(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    // Gizli sekmede sessionStorage engellenebilir; animasyonu atlamak yeterli.
    return true
  }
}

export function Preloader() {
  const { reduced } = useMotionProfile()

  // Karar ilk render'da verilir; etki içinde ek bir setState zinciri oluşmaz.
  const [visible, setVisible] = useState(() => !reduced && !alreadySeen())

  useEffect(() => {
    if (!visible) return

    const timer = window.setTimeout(() => {
      setVisible(false)
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {
        /* yoksay */
      }
    }, DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
          role="status"
          aria-live="polite"
          aria-label="Sayfa yükleniyor"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              className="relative flex size-16 items-center justify-center"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,#2563eb,#22d3ee)] opacity-25 blur-lg" />
              <span className="relative flex size-14 items-center justify-center rounded-2xl border border-white/12 bg-ink-900 font-display text-xl font-semibold text-gradient">
                Ü
              </span>
            </motion.div>

            <div className="h-px w-40 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full w-full origin-left bg-[linear-gradient(90deg,#2563eb,#22d3ee)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: DURATION_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
