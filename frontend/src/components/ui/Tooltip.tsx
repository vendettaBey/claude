import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function TooltipProvider(props: ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider {...props} />
}

type TooltipProps = {
  children: ReactNode
  content: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

/**
 * Radix Tooltip sarmalayıcısı.
 * Dokunmatik cihazlarda da uzun basınca açılır ve klavye odağında görünür;
 * bilgi yalnızca hover'a bağlı değildir.
 */
export function Tooltip({ children, content, side = 'top', className }: TooltipProps) {
  return (
    <TooltipPrimitive.Root delayDuration={120}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={10}
          collisionPadding={16}
          className={cn(
            'z-[75] max-w-64 rounded-xl border border-white/12 bg-ink-800/95 px-3.5 py-2.5',
            'text-xs leading-relaxed text-fg-muted shadow-[0_18px_40px_-20px_rgba(0,0,0,0.95)] backdrop-blur-md',
            'data-[state=delayed-open]:animate-in data-[state=closed]:animate-out',
            className,
          )}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-ink-800" width={12} height={6} />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
