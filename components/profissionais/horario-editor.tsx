'use client'

import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import type { CargaHorariaInput } from '@/lib/profissionais/schema'
import { DEFAULT_HORARIO } from '@/lib/profissionais/schema'

const DAYS: { key: keyof CargaHorariaInput; label: string }[] = [
  { key: 'seg', label: 'Segunda' },
  { key: 'ter', label: 'Terça' },
  { key: 'qua', label: 'Quarta' },
  { key: 'qui', label: 'Quinta' },
  { key: 'sex', label: 'Sexta' },
  { key: 'sab', label: 'Sábado' },
  { key: 'dom', label: 'Domingo' },
]

interface Props {
  value: CargaHorariaInput | null
  onChange: (v: CargaHorariaInput) => void
}

export function HorarioEditor({ value, onChange }: Props) {
  const horario = value ?? DEFAULT_HORARIO

  const updateDay = (key: keyof CargaHorariaInput, patch: Partial<CargaHorariaInput[typeof key]>) => {
    const next = { ...horario, [key]: { ...horario[key], ...patch } }
    // Default times when enabling
    if (patch.atende === true && !next[key].inicio) {
      next[key] = { atende: true, inicio: '08:00', fim: '18:00' }
    }
    onChange(next)
  }

  const applyToWeekdays = () => {
    const seg = horario.seg
    if (!seg.atende) return
    const next = { ...horario }
    for (const k of ['ter', 'qua', 'qui', 'sex'] as const) {
      next[k] = { atende: true, inicio: seg.inicio, fim: seg.fim }
    }
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Carga horária semanal</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={applyToWeekdays}
          disabled={!horario.seg.atende}
          className="text-xs h-7"
        >
          <Copy className="w-3 h-3 mr-1" />
          Replicar Seg → Ter-Sex
        </Button>
      </div>

      <div className="flex flex-col gap-2 border border-border/60 rounded-xl p-3">
        {DAYS.map(({ key, label }) => {
          const day = horario[key]
          return (
            <div key={key} className="grid grid-cols-[140px_1fr_1fr] items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={day.atende}
                  onCheckedChange={(checked) => updateDay(key, { atende: !!checked })}
                />
                <span className="text-sm font-medium">{label}</span>
              </label>
              <Input
                type="time"
                value={day.inicio ?? ''}
                disabled={!day.atende}
                onChange={e => updateDay(key, { inicio: e.target.value || null })}
                className="h-8"
              />
              <Input
                type="time"
                value={day.fim ?? ''}
                disabled={!day.atende}
                onChange={e => updateDay(key, { fim: e.target.value || null })}
                className="h-8"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
