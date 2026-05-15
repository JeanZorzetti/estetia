'use client'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const PRESET_COLORS = [
  '#64748b', // slate
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#eab308', // yellow
  '#84cc16', // lime
  '#22c55e', // green
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
]

interface Props {
  value: string | null
  onChange: (v: string | null) => void
}

export function ColorPicker({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Cor (agenda)</Label>
        {value && (
          <Button type="button" variant="ghost" size="sm" className="h-6 text-xs" onClick={() => onChange(null)}>
            <X className="w-3 h-3 mr-1" />
            Limpar
          </Button>
        )}
      </div>
      <div className="grid grid-cols-6 gap-2">
        {PRESET_COLORS.map(c => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={cn(
              'w-9 h-9 rounded-lg flex items-center justify-center transition-all border-2',
              value === c ? 'border-foreground scale-110 shadow-md' : 'border-transparent hover:scale-105',
            )}
            style={{ backgroundColor: c }}
            aria-label={`Cor ${c}`}
          >
            {value === c && <Check className="w-4 h-4 text-white drop-shadow" />}
          </button>
        ))}
      </div>
    </div>
  )
}
