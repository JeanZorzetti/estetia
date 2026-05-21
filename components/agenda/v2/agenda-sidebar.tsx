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
    <div className="flex flex-col gap-5 relative z-10 w-full">
      {/* Profissionais Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-md p-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)] transition-all duration-300">
        <div className="absolute inset-0.5 rounded-[14px] border border-white/50 pointer-events-none" />
        <div className="relative z-10">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#0A1F3D] mb-3 flex items-center gap-2">
            <span className="p-1 rounded-lg bg-slate-100/60 border border-slate-200/50">
              <Users className="w-3 h-3 text-[#489FB5]" />
            </span>
            Profissionais
          </h3>
          <ScrollArea className="max-h-44 pr-1">
            <div className="flex flex-col gap-2">
              {profissionais.map(p => (
                <label
                  key={p.id}
                  className="group flex items-center gap-2.5 cursor-pointer rounded-xl hover:bg-slate-100/50 border border-transparent hover:border-slate-200/30 p-1.5 transition-all duration-200"
                >
                  <Checkbox
                    className="border-slate-300/80 data-[state=checked]:bg-[#489FB5] data-[state=checked]:border-[#489FB5] transition-all"
                    checked={filters.profissionalIds.has(p.id)}
                    onCheckedChange={() =>
                      onFiltersChange({ ...filters, profissionalIds: toggle(filters.profissionalIds, p.id) })
                    }
                  />
                  <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors truncate">
                    {p.nome}
                  </span>
                </label>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Salas Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-md p-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)] transition-all duration-300">
        <div className="absolute inset-0.5 rounded-[14px] border border-white/50 pointer-events-none" />
        <div className="relative z-10">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#0A1F3D] mb-3 flex items-center gap-2">
            <span className="p-1 rounded-lg bg-slate-100/60 border border-slate-200/50">
              <DoorOpen className="w-3 h-3 text-[#489FB5]" />
            </span>
            Salas
          </h3>
          <ScrollArea className="max-h-44 pr-1">
            <div className="flex flex-col gap-2">
              {salas.map(s => {
                const color = s.cor ?? '#94a3b8'
                return (
                  <label
                    key={s.id}
                    className="group flex items-center gap-2.5 cursor-pointer rounded-xl hover:bg-slate-100/50 border border-transparent hover:border-slate-200/30 p-1.5 transition-all duration-200"
                  >
                    <Checkbox
                      className="border-slate-300/80 data-[state=checked]:bg-[#489FB5] data-[state=checked]:border-[#489FB5] transition-all"
                      checked={filters.salaIds.has(s.id)}
                      onCheckedChange={() =>
                        onFiltersChange({ ...filters, salaIds: toggle(filters.salaIds, s.id) })
                      }
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.1)] transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 0 10px ${color}40`,
                      }}
                    />
                    <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors truncate">
                      {s.nome}
                    </span>
                  </label>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Status Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-md p-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)] transition-all duration-300">
        <div className="absolute inset-0.5 rounded-[14px] border border-white/50 pointer-events-none" />
        <div className="relative z-10">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#0A1F3D] mb-3 flex items-center gap-2">
            <span className="p-1 rounded-lg bg-slate-100/60 border border-slate-200/50">
              <Activity className="w-3 h-3 text-[#489FB5]" />
            </span>
            Status
          </h3>
          <div className="flex flex-col gap-2">
            {STATUSES.map(s => (
              <label
                key={s.id}
                className="group flex items-center gap-2.5 cursor-pointer rounded-xl hover:bg-slate-100/50 border border-transparent hover:border-slate-200/30 p-1.5 transition-all duration-200"
              >
                <Checkbox
                  className="border-slate-300/80 data-[state=checked]:bg-[#489FB5] data-[state=checked]:border-[#489FB5] transition-all"
                  checked={filters.statuses.has(s.id)}
                  onCheckedChange={() =>
                    onFiltersChange({ ...filters, statuses: toggle(filters.statuses, s.id) })
                  }
                />
                <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                  {s.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
