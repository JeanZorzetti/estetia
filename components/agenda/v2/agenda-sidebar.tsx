'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Users, DoorOpen, Activity } from 'lucide-react'
import type { AgendaProfissional, AgendaSala, AgendaFilters } from './types'

interface Props {
  profissionais: AgendaProfissional[]
  salas: AgendaSala[]
  filters: AgendaFilters
  onFiltersChange: (f: AgendaFilters) => void
}

const STATUSES = [
  { id: 'AGENDADA', label: 'Agendada' },
  { id: 'CONFIRMADA', label: 'Confirmada' },
  { id: 'REALIZADA', label: 'Realizada' },
  { id: 'NO_SHOW', label: 'No-show' },
  { id: 'REMARCADA', label: 'Remarcada' },
  { id: 'CANCELADA', label: 'Cancelada' },
]

function toggle<T>(set: Set<T>, item: T): Set<T> {
  const next = new Set(set)
  if (next.has(item)) next.delete(item)
  else next.add(item)
  return next
}

export function AgendaSidebar({ profissionais, salas, filters, onFiltersChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Users className="w-3.5 h-3.5" />
            Profissionais
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <ScrollArea className="max-h-40">
            <div className="flex flex-col gap-1.5">
              {profissionais.map(p => (
                <label
                  key={p.id}
                  className="flex items-center gap-2 cursor-pointer text-sm hover:bg-muted/30 rounded-md px-1 py-0.5 transition-colors"
                >
                  <Checkbox
                    checked={filters.profissionalIds.has(p.id)}
                    onCheckedChange={() =>
                      onFiltersChange({ ...filters, profissionalIds: toggle(filters.profissionalIds, p.id) })
                    }
                  />
                  <span className="text-xs truncate">{p.nome}</span>
                </label>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <DoorOpen className="w-3.5 h-3.5" />
            Salas
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <ScrollArea className="max-h-40">
            <div className="flex flex-col gap-1.5">
              {salas.map(s => (
                <label
                  key={s.id}
                  className="flex items-center gap-2 cursor-pointer text-sm hover:bg-muted/30 rounded-md px-1 py-0.5 transition-colors"
                >
                  <Checkbox
                    checked={filters.salaIds.has(s.id)}
                    onCheckedChange={() =>
                      onFiltersChange({ ...filters, salaIds: toggle(filters.salaIds, s.id) })
                    }
                  />
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: s.cor ?? '#94a3b8' }}
                  />
                  <span className="text-xs truncate">{s.nome}</span>
                </label>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" />
            Status
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex flex-col gap-1.5">
            {STATUSES.map(s => (
              <label
                key={s.id}
                className="flex items-center gap-2 cursor-pointer text-sm hover:bg-muted/30 rounded-md px-1 py-0.5 transition-colors"
              >
                <Checkbox
                  checked={filters.statuses.has(s.id)}
                  onCheckedChange={() =>
                    onFiltersChange({ ...filters, statuses: toggle(filters.statuses, s.id) })
                  }
                />
                <span className="text-xs">{s.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
