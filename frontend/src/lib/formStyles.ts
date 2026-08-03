import { cn } from './cn'

/** Input ve textarea alanlarının ortak stili — tekrarı önlemek için tek yerde. */
export const inputClass = (invalid?: boolean): string =>
  cn(
    'w-full rounded-xl border bg-ink-800/70 px-4 py-3 text-[0.95rem] text-fg',
    'placeholder:text-fg-dim/70 transition-colors duration-200',
    invalid
      ? 'border-rose-500/60 focus-visible:outline-rose-400'
      : 'border-white/10 hover:border-white/20 focus-visible:border-brand-500/60',
  )
