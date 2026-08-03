import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Reveal } from '@/components/motion/Reveal'
import { ScrubText } from '@/components/motion/ScrubText'
import { AnimatedHeading, type HeadingSegment } from '@/components/motion/AnimatedHeading'

type SectionProps = {
  id: string
  children: ReactNode
  className?: string
  /** Bölüm başlığının id'si — ekran okuyucuya bölümün adını bağlar. */
  labelledBy?: string
}

export function Section({ id, children, className, labelledBy }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      // Dikey ritim bilinçli olarak sıkılaştırıldı: bölümler nefes almaya devam
      // ederken toplam sayfa boyu belirgin biçimde kısalıyor.
      className={cn('relative scroll-mt-24 py-14 sm:py-18 lg:py-24', className)}
    >
      {children}
    </section>
  )
}

/**
 * Pafta başlığı: bölüm numarası + ölçü çizgisi + bölüm adı.
 *
 * "Mavi Baskı" konseptinin en görünür parçası. Teknik çizimlerdeki
 * `┌ 02 ──────── HİZMETLER` bandının karşılığı; bölümü bir pafta gibi
 * numaralandırır ve okuyucuya nerede olduğunu söyler.
 */
export function SheetLabel({
  index,
  children,
  align = 'center',
  className,
}: {
  /** Pafta numarası (01, 02, …). */
  index?: string
  children: ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <span
      className={cn(
        'flex w-full items-center gap-3',
        align === 'center' ? 'justify-center' : 'justify-start',
        className,
      )}
    >
      {index && (
        <span className="annotation shrink-0 text-brand-400 tabular-nums">{index}</span>
      )}
      <span aria-hidden="true" className="dimension-rule w-10 shrink-0 sm:w-16" />
      <span className="annotation shrink-0 text-fg-muted">{children}</span>
      <span
        aria-hidden="true"
        className="dimension-rule hidden w-10 shrink-0 rotate-180 sm:block sm:w-16"
      />
    </span>
  )
}

type SectionHeadingProps = {
  /** Başlık elementine verilecek id (Section'ın labelledBy değeriyle eşleşir). */
  id?: string
  eyebrow?: string
  /** Pafta numarası — "Mavi Baskı" konseptindeki bölüm indeksi. */
  index?: string
  segments: HeadingSegment[]
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
  as?: 'h2' | 'h3'
}

export function SectionHeading({
  id,
  eyebrow,
  index,
  segments,
  description,
  align = 'center',
  className,
  as = 'h2',
}: SectionHeadingProps) {
  const centered = align === 'center'
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        centered ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow && (
        <Reveal className="w-full">
          <SheetLabel index={index} align={align}>
            {eyebrow}
          </SheetLabel>
        </Reveal>
      )}
      <AnimatedHeading
        as={as}
        id={id}
        segments={segments}
        className="max-w-3xl text-3xl leading-[1.12] font-semibold text-balance sm:text-4xl lg:text-[2.9rem]"
      />
      {description &&
        // Düz metin açıklamalar kaydırmayla kelime kelime aydınlanır; bu tek
        // değişiklik `SectionHeading` kullanan tüm bölümlere aynı anda yansır.
        // Metin ReactNode ise (bağlantı, vurgu vb. içeriyorsa) kelimelere
        // bölünemeyeceği için eski davranışa düşülür.
        (typeof description === 'string' ? (
          <ScrubText
            className={cn(
              'max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg',
              centered && 'mx-auto',
            )}
          >
            {description}
          </ScrubText>
        ) : (
          <Reveal delay={0.1}>
            <p
              className={cn(
                'max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg',
                centered && 'mx-auto',
              )}
            >
              {description}
            </p>
          </Reveal>
        ))}
    </div>
  )
}
