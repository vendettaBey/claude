import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { cn } from '@/lib/cn'

type ScrubTextProps = {
  /** Düz metin — kelimelere bölünerek tek tek canlandırılır. */
  children: string
  className?: string
  as?: 'p' | 'h2' | 'h3' | 'span'
  /** Sönük hâldeki opaklık. Tamamen 0 yapılmaz: metin hep okunabilir kalır. */
  dim?: number
}

/**
 * Kaydırmayla kelime kelime aydınlanan metin.
 *
 * İki bilinçli karar:
 *
 * 1. **Sönük hâl 0 değil.** Kelimeler `dim` (varsayılan 0.18) opaklıkla başlar.
 *    Kaydırma tetikleyicisi herhangi bir nedenle çalışmazsa (yazdırma, tam
 *    sayfa ekran görüntüsü, eklenti) metin görünmez kalmaz, sadece soluk olur.
 * 2. **Boşluk sarmalayıcının dışında.** `inline-block` bir öğenin sonundaki
 *    boşluk kırpılır; boşluk span'ın içinde bırakılsa kelimeler birbirine
 *    yapışırdı ("Fikrinizisadecebir…").
 *
 * Ekran okuyucular için metin normal akışta kaldığı için ek bir önlem gerekmez;
 * span'lar semantik taşımaz.
 */
export function ScrubText({ children, className, as = 'p', dim = 0.18 }: ScrubTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { reduced, allowHeavy } = useMotionProfile()

  const { scrollYProgress } = useScroll({
    target: ref,
    // Metin ekranın alt üçte birine girdiğinde başlar, orta banda gelince biter.
    offset: ['start 88%', 'end 58%'],
  })

  const words = children.split(' ')
  const Tag = as

  if (reduced || !allowHeavy) {
    // Ref sade kolda da bağlanır. Bağlanmazsa `useScroll` hedefini bulamaz ve
    // Framer her mobil/hareket-azaltma render'ında konsola uyarı basar.
    return (
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    )
  }

  const MotionTag = motion[as] as typeof motion.p

  return (
    <MotionTag ref={ref} className={cn(className)}>
      {words.map((word, index) => (
        // Boşluk bilinçli olarak fragment içinde, span'ın dışında.
        <span key={`${word}-${index}`}>
          <ScrubWord progress={scrollYProgress} index={index} total={words.length} dim={dim}>
            {word}
          </ScrubWord>{' '}
        </span>
      ))}
    </MotionTag>
  )
}

function ScrubWord({
  progress,
  index,
  total,
  dim,
  children,
}: {
  progress: MotionValue<number>
  index: number
  total: number
  dim: number
  children: string
}) {
  // Kelimeler ilerlemenin ilk %70'ine yayılır; kalan pay son kelimenin de
  // metin ekrandan çıkmadan önce tam opaklığa ulaşmasını garantiler.
  const start = (index / total) * 0.7
  const end = start + 0.3

  const opacity = useTransform(progress, [start, end], [dim, 1])
  const y = useTransform(progress, [start, end], [8, 0])

  return (
    <motion.span style={{ opacity, y }} className="inline-block will-change-transform">
      {children}
    </motion.span>
  )
}
