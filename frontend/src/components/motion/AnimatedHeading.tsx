import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { useMotionProfile } from '@/hooks/useMotionProfile'
import { useInViewOnce } from '@/hooks/useInViewOnce'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div'

export type HeadingSegment = {
  text: string
  /** Bu parça gradient ile vurgulansın mı? */
  highlight?: boolean
}

type AnimatedHeadingProps = {
  segments: HeadingSegment[]
  as?: HeadingTag
  id?: string
  className?: string
  delay?: number
  /** Ekran okuyucuya verilecek düz metin (varsayılan: parçaların birleşimi). */
  srText?: string
}

/**
 * Başlığı kelime bazında canlandırır.
 * Kelimeler ayrı span'lere bölünür, fakat aria-label sayesinde ekran okuyucular
 * başlığı tek ve doğal bir cümle olarak okur.
 */
export function AnimatedHeading({
  segments,
  as = 'h2',
  id,
  className,
  delay = 0,
  srText,
}: AnimatedHeadingProps) {
  const { reduced } = useMotionProfile()
  // Başlık da Reveal ile aynı güvenceli tetikleyiciyi kullanır: gözlemci
  // çalışmazsa kelimeler yine de yerine oturur, başlık gizli kalmaz.
  const [ref, visible] = useInViewOnce<HTMLHeadingElement>({ enabled: !reduced })
  // Union'ı somut bir etikete daraltmak JSX prop çözümlemesini basitleştirir.
  const Tag = as as 'h2'
  const fullText = srText ?? segments.map((s) => s.text).join(' ')

  if (reduced) {
    return (
      <Tag id={id} className={className}>
        {segments.map((segment, i) => (
          <span key={i} className={segment.highlight ? 'text-gradient' : undefined}>
            {segment.text}
            {i < segments.length - 1 ? ' ' : ''}
          </span>
        ))}
      </Tag>
    )
  }

  let wordIndex = 0

  return (
    <Tag id={id} ref={ref} className={className} aria-label={fullText}>
      <span aria-hidden="true">
        {segments.map((segment, segmentIndex) => {
          const words = segment.text.split(' ')
          return (
            <span key={segmentIndex}>
              {words.map((word, i) => {
                const index = wordIndex++
                // Gradient'i, metni gerçekten taşıyan öğeye veriyoruz.
                // Üst öğeye verilip alt öğe `transform` aldığında Chromium
                // `background-clip: text` alanını yeniden boyamıyor ve başlık
                // görünmez kalıyordu. Konumu kelime sırasına göre kaydırınca
                // renk geçişi cümle boyunca kesintisiz akmaya devam ediyor.
                const gradientPosition =
                  words.length > 1 ? `${(i / (words.length - 1)) * 100}% center` : '50% center'

                return (
                  // Kelimeler arasındaki boşluk sarmalayıcının DIŞINDA durmalı:
                  // `inline-block` bir kutunun sonundaki boşluk CSS tarafından
                  // kırpılır ve kelimeler birbirine yapışır.
                  <Fragment key={`${segmentIndex}-${i}`}>
                    <span className="inline-block align-bottom">
                      <motion.span
                        className={segment.highlight ? 'text-gradient inline-block' : 'inline-block'}
                        style={
                          segment.highlight ? { backgroundPosition: gradientPosition } : undefined
                        }
                        initial={{ y: '38%', opacity: 0 }}
                        animate={visible ? { y: '0%', opacity: 1 } : { y: '38%', opacity: 0 }}
                        transition={{
                          duration: 0.72,
                          delay: delay + index * 0.05,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        {word}
                      </motion.span>
                    </span>
                    {i < words.length - 1 ? ' ' : null}
                  </Fragment>
                )
              })}
              {segmentIndex < segments.length - 1 ? ' ' : ''}
            </span>
          )
        })}
      </span>
    </Tag>
  )
}
