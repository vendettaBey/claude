import { Suspense, lazy } from 'react'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { usePageVisibility } from '@/hooks/usePageVisibility'
import type { Theme } from '@/hooks/useTheme'

// Three.js ve sahne ayrı bir chunk'ta; yalnızca gerçekten kullanılacaksa indirilir.
const SiteScene = lazy(() => import('./SiteScene'))

/**
 * Sayfa boyunca sabit duran dekoratif 3B katman.
 *
 * ### Yığın düzeni
 * Katman `z-index: 0` ile sabitlenir; `main` ve `footer` ise `z-index: 10`
 * taşır (bkz. `App.tsx`). Negatif z-index kullanılmadı: negatif değer, üst
 * öğelerden herhangi biri yığın bağlamı oluşturduğu anda (bir `transform`
 * yeterli) katmanı zeminin altına gömüp görünmez yapıyordu. Açık ve pozitif
 * bir sıra bu kırılganlığı ortadan kaldırır.
 *
 * ### Okunabilirlik
 * Sahnenin üzerine iki katman perde konur: üstte metin bloklarının bulunduğu
 * orta bant için dikey bir karartma, altta kenarları zemine bağlayan bir
 * vinyet. Sahne bu sayede metnin arkasında kalır, metinle yarışmaz.
 *
 * Sahne yüklenmediğinde (mobil, dokunmatik, düşük çekirdek, hareket azaltma)
 * bu bileşen hiçbir şey render etmez; bölümlerin kendi `AmbientBackground`
 * katmanı zaten görsel derinliği tek başına taşır.
 */
export function SceneBackdrop({ theme }: { theme: Theme }) {
  const { allow3d } = useMotionProfile()
  const visible = usePageVisibility()

  if (!allow3d) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      // `contain` tarayıcıya bu alanın dışarıyı etkilemediğini söyler:
      // sabit katmanın her karede tüm sayfayı yeniden boyamasını engeller.
      style={{ contain: 'strict' }}
    >
      <Suspense fallback={null}>
        <SiteScene key={theme} active={visible} theme={theme} />
      </Suspense>

      {/* Metin bandı perdesi — sahne kenarlarda canlı, ortada sakin kalır. */}
      <div className="scene-text-veil absolute inset-0" />
      {/* Vinyet — üst ve alt kenarı zemine bağlar. */}
      <div className="scene-vignette absolute inset-0" />
    </div>
  )
}
