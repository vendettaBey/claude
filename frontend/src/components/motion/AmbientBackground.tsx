import { useMotionProfile } from '@/hooks/useMotionProfile'
import { cn } from '@/lib/cn'

type AmbientBackgroundProps = {
  className?: string
  grid?: boolean
  orbs?: boolean
  intensity?: 'soft' | 'strong'
  /** Alt kenarda zemine geçiş maskesi. */
  fadeBottom?: boolean
}

/**
 * Bölümlerin arkasındaki dekoratif katman: aurora küreleri + ince grid.
 * Tamamen `aria-hidden` ve `pointer-events-none`; okunabilirliği etkilemez.
 * Ağır blur yalnızca masaüstünde hareket eder.
 */
export function AmbientBackground({
  className,
  grid = true,
  orbs = true,
  intensity = 'soft',
  fadeBottom = true,
}: AmbientBackgroundProps) {
  const { allowHeavy, allow3d } = useMotionProfile()

  // 3B sahne devredeyken aurora küreleri sahnenin ışığını yıkıyor: iki katman
  // da aynı işi (renkli hacim hissi) yaptığı için üst üste binince ikisi de
  // bulanık bir lekeye dönüşüyor. Sahne varken küreler belirgin biçimde
  // geri çekilir; sahne yoksa eski güçlerinde kalıp derinliği tek başına taşır.
  const strong = intensity === 'strong' && !allow3d
  const orbOpacity = allow3d ? 'opacity-[0.45]' : ''

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}
    >
      {grid && (
        // Pafta ızgarası: 24px yardımcı + 96px ana bölme. Düz tek katmanlı
        // grid yerine gerçek çizim kâğıdı hissi verir.
        <div className="bg-blueprint absolute inset-0 opacity-[0.6] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,#000_20%,transparent_75%)]" />
      )}

      {orbs && (
        <div className={cn('absolute inset-0', orbOpacity)}>
          {/* Ana aurora: konik gradient sayesinde üç vurgu rengini tek katmanda
              taşır ve yavaş dönüşüyle radial kürelerden çok daha canlı durur. */}
          <div
            className={cn(
              'aurora-orb absolute -top-40 -left-32',
              strong
                ? 'size-[40rem] opacity-30 blur-[90px]'
                : 'size-[30rem] opacity-20 blur-[80px]',
              allowHeavy && 'animate-aurora-spin',
            )}
          />
          <div
            className={cn(
              'aurora-orb absolute top-1/4 -right-40',
              strong
                ? 'size-[36rem] opacity-26 blur-[100px]'
                : 'size-[26rem] opacity-18 blur-[90px]',
              allowHeavy && 'animate-aurora-spin [animation-delay:-9s] [animation-direction:reverse]',
            )}
          />
          {/* Alt katman yumuşak bir radial ile dengelenir; her yer konik olursa
              desen fark edilir hâle gelip dikkat dağıtıyor. */}
          <div
            className={cn(
              'absolute bottom-0 left-1/3 rounded-full',
              strong
                ? 'size-[30rem] opacity-30 blur-[130px]'
                : 'size-[22rem] opacity-20 blur-[110px]',
              'bg-[radial-gradient(circle,#22d3ee_0%,transparent_70%)]',
              allowHeavy && 'animate-float-slow [animation-delay:-14s]',
            )}
          />
        </div>
      )}

      {fadeBottom && (
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
      )}
    </div>
  )
}
