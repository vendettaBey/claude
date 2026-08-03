import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { Plus } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

/**
 * Radix Accordion üzerine kurulu, Ülkü Yazılım tasarım diline göre
 * özelleştirilmiş akordeon. Klavye ve ekran okuyucu davranışı Radix'ten gelir.
 */
export const Accordion = AccordionPrimitive.Root

export function AccordionItem({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn(
        'card-surface overflow-hidden transition-colors duration-300',
        'data-[state=open]:border-brand-500/30',
        className,
      )}
      {...props}
    />
  )
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'group flex flex-1 items-center justify-between gap-4 px-5 py-5 text-left sm:px-6',
          'font-display text-base font-medium text-fg transition-colors hover:text-brand-400 sm:text-lg',
          className,
        )}
        {...props}
      >
        {children}
        <span
          aria-hidden="true"
          className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-brand-400 transition-transform duration-300 group-data-[state=open]:rotate-45"
        >
          <Plus className="size-4" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

export function AccordionContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        'overflow-hidden',
        // Yükseklik animasyonu Radix'in ölçtüğü değişkenle yapılır; metin
        // animasyon sırasında da okunabilir kalır.
        'data-[state=closed]:animate-[accordion-up_260ms_cubic-bezier(0.4,0,0.2,1)]',
        'data-[state=open]:animate-[accordion-down_300ms_cubic-bezier(0.16,1,0.3,1)]',
      )}
      {...props}
    >
      <div className={cn('px-5 pb-5 text-[0.95rem] leading-relaxed text-fg-muted sm:px-6', className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}
