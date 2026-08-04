import { motion } from 'framer-motion'
import { MoonStar, Sun } from 'lucide-react'
import type { Theme } from '@/hooks/useTheme'

type ThemeToggleProps = {
  theme: Theme
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark'
  const label = isDark ? 'Açık moda geç' : 'Koyu moda geç'

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      className="group/theme text-fg-dim hover:border-brand-400/45 relative flex h-10 w-[4.35rem] shrink-0 items-center justify-between overflow-hidden rounded-full border border-white/12 bg-white/[0.045] px-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,190,92,0.14),transparent_48%,rgba(99,122,255,0.14))] opacity-70"
      />
      <Sun
        className={`relative z-10 size-3.5 transition-colors ${!isDark ? 'text-amber-500' : 'text-fg-dim'}`}
        aria-hidden="true"
      />
      <MoonStar
        className={`relative z-10 size-3.5 transition-colors ${isDark ? 'text-brand-400' : 'text-fg-dim'}`}
        aria-hidden="true"
      />

      <motion.span
        aria-hidden="true"
        className="bg-ink-800 absolute top-1 left-1 z-20 grid size-8 place-items-center rounded-full border border-white/14 shadow-[0_5px_15px_rgba(15,23,42,0.2)]"
        animate={{ x: isDark ? 28 : 0, rotate: isDark ? 18 : 0 }}
        transition={{ type: 'spring', stiffness: 430, damping: 31 }}
      >
        {isDark ? (
          <MoonStar className="text-brand-400 size-4" />
        ) : (
          <Sun className="size-4 text-amber-500" />
        )}
      </motion.span>
    </button>
  )
}
