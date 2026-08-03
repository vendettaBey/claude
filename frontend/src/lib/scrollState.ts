/**
 * Sayfa genelinde tek bir kaydırma/işaretçi durumu.
 *
 * Neden global bir nesne?
 * - WebGL sahnesi `useFrame` içinde kaydırma değerini React render'ına
 *   bağlanmadan okumak zorunda; MotionValue abonelikleri her karede React'e
 *   dönmeden bu işi göremezdi.
 * - Onlarca bileşenin ayrı ayrı `scroll` dinleyicisi açması yerine tek bir
 *   yazıcı (bkz. `ScrollSignal`) burayı günceller, herkes okur.
 *
 * Bu nesne **yalnızca** `ScrollSignal` tarafından yazılır. Diğer her yer
 * salt okurdur.
 */
export type ScrollState = {
  /** Ham kaydırma konumu (piksel). */
  y: number
  /** Belge boyunca ilerleme, 0–1. */
  progress: number
  /**
   * Yumuşatılmış kaydırma hızı, kabaca -1…+1 aralığına sıkıştırılmış.
   * Pozitif = aşağı. Skew/blur gibi "hıza tepki veren" efektleri besler.
   */
  velocity: number
  /** İşaretçinin ekran içindeki konumu, -1…+1 (merkez = 0). */
  pointerX: number
  pointerY: number
}

export const scrollState: ScrollState = {
  y: 0,
  progress: 0,
  velocity: 0,
  pointerX: 0,
  pointerY: 0,
}

/** Kaydırılabilir toplam mesafe; 0'a bölmeyi engellemek için en az 1. */
export function scrollableDistance(): number {
  if (typeof document === 'undefined') return 1
  const doc = document.documentElement
  return Math.max(1, doc.scrollHeight - window.innerHeight)
}
