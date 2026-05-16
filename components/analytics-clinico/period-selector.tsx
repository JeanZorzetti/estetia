'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const PRESETS = [
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: '90d', label: '90 dias' },
  { value: '12m', label: '12 meses' },
] as const

interface PeriodSelectorProps {
  currentPreset?: string
}

export function PeriodSelector({ currentPreset = '30d' }: PeriodSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handlePreset(preset: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('preset', preset)
    params.delete('from')
    params.delete('to')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border/60 p-1 bg-muted/30">
      {PRESETS.map((p) => (
        <Button
          key={p.value}
          variant="ghost"
          size="sm"
          onClick={() => handlePreset(p.value)}
          className={cn(
            'h-7 px-3 text-xs font-medium transition-all',
            currentPreset === p.value
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {p.label}
        </Button>
      ))}
    </div>
  )
}
