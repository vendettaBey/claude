import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type FieldProps = {
  id: string
  label: string
  children: ReactNode
  error?: string
  hint?: string
  optional?: boolean
  className?: string
}

/**
 * Form alanı sarmalayıcısı.
 * Etiket her zaman görünürdür (placeholder etiket yerine kullanılmaz) ve hata
 * mesajı `role="alert"` ile ekran okuyuculara duyurulur.
 */
export function Field({ id, label, children, error, hint, optional, className }: FieldProps) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="flex items-baseline gap-2 text-sm font-medium text-fg">
        {label}
        {optional && <span className="text-xs font-normal text-fg-dim">(isteğe bağlı)</span>}
      </label>

      {children}

      {hint && !error && (
        <p id={hintId} className="text-xs leading-relaxed text-fg-dim">
          {hint}
        </p>
      )}

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-xs text-rose-300"
          >
            <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
