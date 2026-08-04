import type { ProjectVisualKind } from '@/types'
import { cn } from '@/lib/cn'

/**
 * Proje senaryolarının görsel alanı.
 *
 * Stok fotoğraf yerine, her senaryo için o ürünün gerçekten neye benzeyeceğini
 * anlatan minyatür bir arayüz maketi çizilir. Tamamı DOM + CSS olduğu için
 * ölçeklenebilir, ek ağ isteği gerektirmez ve layout shift oluşturmaz.
 */

function Bar({ w, tone = 'muted' }: { w: string; tone?: 'muted' | 'dim' | 'accent' }) {
  return (
    <span
      className={cn(
        'block h-1.5 rounded-full',
        tone === 'accent' && 'bg-current opacity-80',
        tone === 'muted' && 'bg-white/14',
        tone === 'dim' && 'bg-white/8',
      )}
      style={{ width: w }}
    />
  )
}

function WindowChrome({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-white/8 bg-white/[0.03] px-3 py-2">
      <span className="size-1.5 rounded-full bg-white/20" />
      <span className="size-1.5 rounded-full bg-white/20" />
      <span className="size-1.5 rounded-full bg-white/20" />
      <span className="ml-2 truncate font-sans text-[0.55rem] tracking-wide text-fg-dim">
        {label}
      </span>
    </div>
  )
}

function CorporateMock() {
  return (
    <div className="space-y-3 p-4">
      <div className="space-y-1.5">
        <Bar w="45%" tone="accent" />
        <Bar w="72%" />
        <Bar w="58%" tone="dim" />
      </div>
      <div className="flex gap-1.5">
        <span className="h-5 w-16 rounded-full bg-current opacity-70" />
        <span className="h-5 w-12 rounded-full border border-white/12" />
      </div>
      <div className="grid grid-cols-3 gap-1.5 pt-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-1.5 rounded-md border border-white/8 bg-white/[0.02] p-2">
            <span className="block size-4 rounded bg-current opacity-60" />
            <Bar w="100%" tone="dim" />
            <Bar w="70%" tone="dim" />
          </div>
        ))}
      </div>
    </div>
  )
}

function BookingMock() {
  const days = Array.from({ length: 21 })
  return (
    <div className="space-y-2.5 p-4">
      <div className="flex items-center justify-between">
        <Bar w="38%" tone="accent" />
        <div className="flex gap-1">
          <span className="size-3 rounded border border-white/12" />
          <span className="size-3 rounded border border-white/12" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((_, i) => (
          <span
            key={i}
            className={cn(
              'aspect-square rounded-[3px]',
              i === 9 || i === 16
                ? 'bg-current opacity-80'
                : i % 5 === 0
                  ? 'bg-white/12'
                  : 'bg-white/5',
            )}
          />
        ))}
      </div>
      <div className="flex gap-1.5 pt-1">
        {['09:00', '11:30', '14:00'].map((slot, i) => (
          <span
            key={slot}
            className={cn(
              'rounded px-1.5 py-1 font-sans text-[0.5rem]',
              i === 1 ? 'bg-current text-ink-950 opacity-90' : 'border border-white/12 text-fg-dim',
            )}
          >
            {slot}
          </span>
        ))}
      </div>
    </div>
  )
}

function PortalMock() {
  return (
    <div className="flex gap-2.5 p-4">
      <div className="w-1/4 space-y-1.5">
        <span className="block h-4 rounded bg-current opacity-60" />
        {[0, 1, 2, 3].map((i) => (
          <Bar key={i} w="100%" tone={i === 1 ? 'muted' : 'dim'} />
        ))}
      </div>
      <div className="flex-1 space-y-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-md border border-white/8 bg-white/[0.02] p-2"
          >
            <span className="size-3 shrink-0 rounded-full bg-current opacity-50" />
            <span className="flex-1 space-y-1">
              <Bar w="70%" />
              <Bar w="40%" tone="dim" />
            </span>
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 font-sans text-[0.45rem]',
                i === 0 ? 'bg-current text-ink-950 opacity-90' : 'border border-white/12 text-fg-dim',
              )}
            >
              {i === 0 ? 'Açık' : 'Kapalı'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuotesMock() {
  return (
    <div className="space-y-2 p-4">
      <div className="flex items-center justify-between">
        <Bar w="30%" tone="accent" />
        <span className="rounded px-1.5 py-0.5 font-sans text-[0.45rem] text-fg-dim ring-1 ring-white/12 ring-inset">
          Teklif #124
        </span>
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-2 border-b border-white/6 pb-1.5">
          <Bar w="45%" tone={i === 0 ? 'muted' : 'dim'} />
          <span className="ml-auto h-1.5 w-8 rounded-full bg-white/10" />
          <span className="h-1.5 w-10 rounded-full bg-current opacity-50" />
        </div>
      ))}
      <div className="flex items-center justify-between pt-1">
        <span className="font-sans text-[0.5rem] text-fg-dim">Toplam</span>
        <span className="h-2 w-14 rounded-full bg-current opacity-80" />
      </div>
      <div className="flex justify-end gap-1.5 pt-1">
        <span className="h-5 w-14 rounded-full border border-white/12" />
        <span className="h-5 w-16 rounded-full bg-current opacity-75" />
      </div>
    </div>
  )
}

function MultiBranchMock() {
  const branches = [
    { name: 'Merkez', value: 88 },
    { name: 'Şube 2', value: 64 },
    { name: 'Şube 3', value: 47 },
    { name: 'Şube 4', value: 72 },
  ]
  return (
    <div className="space-y-2.5 p-4">
      <div className="flex items-center justify-between">
        <Bar w="34%" tone="accent" />
        <span className="font-sans text-[0.45rem] text-fg-dim">Bu ay</span>
      </div>
      <div className="space-y-2">
        {branches.map((branch) => (
          <div key={branch.name} className="flex items-center gap-2">
            <span className="w-10 shrink-0 font-sans text-[0.48rem] text-fg-dim">
              {branch.name}
            </span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/8">
              <span
                className="block h-full rounded-full bg-current opacity-75"
                style={{ width: `${branch.value}%` }}
              />
            </span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1.5 pt-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-md border border-white/8 bg-white/[0.02] p-1.5">
            <Bar w="60%" tone="dim" />
            <span className="mt-1 block h-2 w-8 rounded-full bg-current opacity-60" />
          </div>
        ))}
      </div>
    </div>
  )
}

function EcommerceMock() {
  return (
    <div className="space-y-2.5 p-4">
      <div className="flex items-center justify-between">
        <Bar w="34%" tone="accent" />
        {/* Sepet rozeti — gerçek ikon yerine geometrik biçimlerle: diğer
            maketlerdeki gibi hiçbir mockup lucide ikonu taşımıyor. */}
        <span className="flex items-center gap-1 rounded-full border border-white/12 px-2 py-1">
          <span className="size-2.5 rounded-full bg-current opacity-70" />
          <span className="font-sans text-[0.5rem] text-fg-dim">3</span>
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-1.5 rounded-md border border-white/8 bg-white/[0.02] p-1.5">
            <div className="aspect-square rounded bg-current opacity-15" />
            <Bar w="80%" tone="dim" />
            <span className="block h-2 w-8 rounded-full bg-current opacity-70" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-md border border-white/8 bg-white/[0.02] p-2">
        <Bar w="28%" tone="dim" />
        <span className="rounded-full bg-current px-2.5 py-1 font-sans text-[0.48rem] text-ink-950 opacity-90">
          Sepete Ekle
        </span>
      </div>
    </div>
  )
}

function MembershipMock() {
  return (
    <div className="space-y-2.5 p-4">
      <Bar w="36%" tone="accent" />
      <div className="grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'space-y-1.5 rounded-md p-2',
              i === 1
                ? 'border border-current bg-current/10'
                : 'border border-white/8 bg-white/[0.02]',
            )}
          >
            <Bar w="70%" tone="dim" />
            <span className="block h-3 w-9 rounded bg-current opacity-70" />
            <div className="space-y-1 pt-0.5">
              <Bar w="100%" tone="dim" />
              <Bar w="80%" tone="dim" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 rounded-md border border-white/8 bg-white/[0.02] p-2">
        <span className="size-3 rounded-full bg-current opacity-60" />
        <Bar w="45%" tone="dim" />
        <span className="ml-auto h-4 w-12 rounded-full bg-current opacity-75" />
      </div>
    </div>
  )
}

function ErpMock() {
  const modules = [
    { name: 'CRM', value: 76 },
    { name: 'Stok', value: 54 },
    { name: 'Muhasebe', value: 62 },
    { name: 'İK', value: 38 },
  ]
  return (
    <div className="space-y-2.5 p-4">
      <div className="flex items-center justify-between">
        <Bar w="32%" tone="accent" />
        <span className="font-sans text-[0.45rem] text-fg-dim">Genel bakış</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {modules.map((module) => (
          <div key={module.name} className="space-y-1 rounded-md border border-white/8 bg-white/[0.02] p-1.5">
            <span className="block font-sans text-[0.48rem] text-fg-dim">{module.name}</span>
            <span className="block h-1.5 overflow-hidden rounded-full bg-white/8">
              <span
                className="block h-full rounded-full bg-current opacity-75"
                style={{ width: `${module.value}%` }}
              />
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-md border border-white/8 bg-white/[0.02] p-2">
        <span className="size-3 shrink-0 rounded-full bg-current opacity-60" />
        <span className="flex-1 space-y-1">
          <Bar w="65%" />
          <Bar w="35%" tone="dim" />
        </span>
        <span className="rounded-full bg-current px-1.5 py-0.5 font-sans text-[0.45rem] text-ink-950 opacity-90">
          Onaylı
        </span>
      </div>
    </div>
  )
}

const MOCKS: Record<ProjectVisualKind, { label: string; body: () => React.ReactElement }> = {
  corporate: { label: 'kurumsal-site.tr', body: CorporateMock },
  booking: { label: 'randevu paneli', body: BookingMock },
  portal: { label: 'müşteri portalı', body: PortalMock },
  quotes: { label: 'teklif yönetimi', body: QuotesMock },
  multibranch: { label: 'şube raporları', body: MultiBranchMock },
  membership: { label: 'üyelik platformu', body: MembershipMock },
  ecommerce: { label: 'e-ticaret sitesi', body: EcommerceMock },
  erp: { label: 'işletme paneli', body: ErpMock },
}

type ProjectVisualProps = {
  kind: ProjectVisualKind
  accent: string
  className?: string
}

export function ProjectVisual({ kind, accent, className }: ProjectVisualProps) {
  const mock = MOCKS[kind]
  const Body = mock.body

  return (
    <div
      aria-hidden="true"
      className={cn('relative overflow-hidden', className)}
      style={{ color: accent }}
    >
      {/* Yumuşak renk zemini */}
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(120% 90% at 50% 0%, ${accent}1f, transparent 70%)` }}
      />
      {/* Pencere — hover'da hafifçe yakınlaşır */}
      <div className="relative flex h-full items-center justify-center p-5">
        <div className="w-full origin-center overflow-hidden rounded-lg border border-white/10 bg-ink-950/70 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.9)] transition-transform duration-500 ease-out group-hover:scale-[1.04]">
          <WindowChrome label={mock.label} />
          <Body />
        </div>
      </div>
    </div>
  )
}
