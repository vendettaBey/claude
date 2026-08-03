import { useReducedMotion } from 'framer-motion'
import { useHasFinePointer, useIsDesktop, useMediaQuery } from './useMediaQuery'

export type MotionProfile = {
  /** Kullanıcı hareket azaltma istedi mi? Her şeyin önündedir. */
  reduced: boolean
  /** Ağır arka plan efektleri (blur küreleri, parallax) çalışsın mı? */
  allowHeavy: boolean
  /** İşaretçiye tepki veren efektler (magnetic, tilt, spotlight) çalışsın mı? */
  allowPointer: boolean
  /** Three.js sahnesi yüklensin mi? */
  allow3d: boolean
}

/**
 * Animasyon kararlarını tek yerden verir:
 * - `prefers-reduced-motion` her şeyi kapatır,
 * - ağır efektler yalnızca geniş ekran + hassas işaretçide,
 * - 3D sahne yalnızca masaüstünde, yeterli çekirdek/bellek varsa.
 */
export function useMotionProfile(): MotionProfile {
  const reduced = useReducedMotion() ?? false
  const isDesktop = useIsDesktop()
  const finePointer = useHasFinePointer()
  const wideEnough = useMediaQuery('(min-width: 768px)')

  // Düşük çekirdekli cihazlarda WebGL sahnesi açmıyoruz.
  const capableDevice =
    typeof navigator === 'undefined' || (navigator.hardwareConcurrency ?? 4) >= 4

  return {
    reduced,
    allowHeavy: !reduced && isDesktop && wideEnough,
    allowPointer: !reduced && finePointer,
    allow3d: !reduced && isDesktop && finePointer && capableDevice,
  }
}
