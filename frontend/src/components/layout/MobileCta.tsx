import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { whatsappUrl } from '@/constants/site'
import { scrollToSection } from '@/lib/scroll'

/**
 * Mobilde alt kenarda duran ince eylem çubuğu.
 * - Yalnızca kullanıcı hero'yu geçtikten sonra görünür,
 * - İletişim bölümü ekrandayken kendini gizler (kullanıcıyı rahatsız etmez),
 * - safe-area desteğiyle çentikli ekranlarda içeriğin üstüne binmez.
 */
export function MobileCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const contact = document.getElementById('iletisim')

    let frame = 0
    const update = () => {
      frame = 0
      const pastHero = window.scrollY > window.innerHeight * 0.85

      // İletişim bölümü görünür alandaysa çubuğu gizle.
      let contactVisible = false
      if (contact) {
        const rect = contact.getBoundingClientRect()
        contactVisible = rect.top < window.innerHeight && rect.bottom > 0
      }

      setVisible(pastHero && !contactVisible)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
        >
          <div className="glass-panel flex items-center gap-2 rounded-2xl p-2 shadow-[0_18px_44px_-20px_rgba(0,0,0,0.95)]">
            <a
              href="#iletisim"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('#iletisim')
              }}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(100deg,#2563eb,#3d9bff,#22d3ee)] text-sm font-medium text-white"
            >
              <Send className="size-4" aria-hidden="true" />
              Teklif Al
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp'tan yazın"
              className="grid size-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-emerald-400"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
