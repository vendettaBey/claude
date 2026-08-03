import { useEffect, useState } from 'react'

/**
 * Sekme görünür mü? Görünmeyen sekmede süregelen animasyonları (3D sahne,
 * marquee vb.) durdurup CPU/GPU tüketimini sıfırlamak için kullanılır.
 */
export function usePageVisibility(): boolean {
  const [visible, setVisible] = useState(
    typeof document === 'undefined' ? true : !document.hidden,
  )

  useEffect(() => {
    const onChange = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  return visible
}
