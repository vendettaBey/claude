import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { SelectOption } from '@/types'

type SelectFieldProps = {
  id: string
  value: string | undefined
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder: string
  invalid?: boolean
  describedBy?: string
  name?: string
  onBlur?: () => void
}

/**
 * Radix Select üzerine kurulu, tasarım sistemine uygun seçim alanı.
 * Klavye ile gezinme, tip-ahead ve ekran okuyucu davranışı Radix'ten gelir.
 */
export function SelectField({
  id,
  value,
  onValueChange,
  options,
  placeholder,
  invalid,
  describedBy,
  name,
  onBlur,
}: SelectFieldProps) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange} name={name}>
      <SelectPrimitive.Trigger
        id={id}
        onBlur={onBlur}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={cn(
          'interactive-field flex h-12 w-full items-center justify-between gap-3 rounded-xl border px-4 text-left text-[0.95rem]',
          'bg-ink-800/70 transition-colors duration-200',
          'data-[placeholder]:text-fg-dim',
          invalid
            ? 'border-rose-500/60 focus-visible:outline-rose-400'
            : 'focus-visible:border-brand-500/60 border-white/10 hover:border-white/20',
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="text-fg-dim size-4 shrink-0" aria-hidden="true" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={8}
          className={cn(
            'z-[85] max-h-72 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl',
            'bg-ink-850/98 border border-white/12 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.95)] backdrop-blur-xl',
          )}
        >
          <SelectPrimitive.Viewport className="p-1.5">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className={cn(
                  'text-fg-muted relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 pr-9 text-sm',
                  'transition-colors outline-none select-none',
                  'data-[highlighted]:text-fg data-[highlighted]:bg-white/[0.07]',
                  'data-[state=checked]:text-brand-400',
                )}
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute right-3">
                  <Check className="size-4" aria-hidden="true" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
