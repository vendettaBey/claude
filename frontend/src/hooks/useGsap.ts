import { useLayoutEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

/**
 * GSAP animasyonlarını bir kapsam (scope) içinde çalıştırır ve bileşen
 * kaldırıldığında tüm tween/ScrollTrigger kayıtlarını otomatik temizler.
 *
 * `enabled` false ise hiçbir animasyon kurulmaz — hareket azaltma tercihinde
 * veya mobilde ağır sahneleri kapatmak için kullanılır.
 */
export function useGsapContext(
  setup: (context: gsap.Context) => void,
  scope: RefObject<HTMLElement | null>,
  enabled = true,
  deps: unknown[] = [],
): void {
  const setupRef = useRef(setup)

  // Ref'i render sırasında değil, commit sonrasında güncelliyoruz. Bu etki
  // bağımlılık listesi taşımadığı için her commit'te ve aşağıdaki asıl
  // etkiden önce çalışır; dolayısıyla setup her zaman günceldir.
  useLayoutEffect(() => {
    setupRef.current = setup
  })

  useLayoutEffect(() => {
    if (!enabled || !scope.current) return

    const ctx = gsap.context((self) => setupRef.current(self), scope.current)
    return () => ctx.revert()
    // scope bir ref olduğu için bağımlılık listesinde yer almasına gerek yok.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps])
}
