'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from 'lucide-react'
import { format, addDays, addWeeks, addMonths, startOfWeek, endOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { GoogleSyncIndicator } from './google-sync-indicator'
import { cn } from '@/lib/utils'
import type { AgendaView } from './types'

interface Props {
  currentDate: Date
  view: AgendaView
  onDateChange: (date: Date) => void
  onViewChange: (view: AgendaView) => void
  onNewSession: () => void
}

function formatRange(date: Date, view: AgendaView): string {
  if (view === 'week') {
    const start = startOfWeek(date, { weekStartsOn: 1 })
    const end = addDays(start, 5)
    return `${format(start, 'd MMM', { locale: ptBR })} – ${format(end, 'd MMM yyyy', { locale: ptBR })}`
  }
  if (view === 'day') return format(date, "EEEE, d 'de' MMMM yyyy", { locale: ptBR })
  return format(date, "MMMM 'de' yyyy", { locale: ptBR })
}

export function AgendaToolbar({ currentDate, view, onDateChange, onViewChange, onNewSession }: Props) {
  const goPrev = () => {
    if (view === 'week') onDateChange(addWeeks(currentDate, -1))
    else if (view === 'day') onDateChange(addDays(currentDate, -1))
    else onDateChange(addMonths(currentDate, -1))
  }
  const goNext = () => {
    if (view === 'week') onDateChange(addWeeks(currentDate, 1))
    else if (view === 'day') onDateChange(addDays(currentDate, 1))
    else onDateChange(addMonths(currentDate, 1))
  }

  return (
    <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap bg-white/40 backdrop-blur-md border border-slate-200/50 p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
      {/* Date navigation and controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => onDateChange(new Date())}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl border border-slate-200 bg-white/70 hover:bg-white text-slate-700 text-xs font-bold shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.04)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <CalendarDays className="w-3.5 h-3.5 text-[#489FB5]" />
          Hoje
        </button>

        <div className="inline-flex rounded-xl border border-slate-200 bg-white/70 p-0.5 shadow-sm">
          <button
            onClick={goPrev}
            className="inline-flex items-center justify-center h-8 w-9 rounded-lg hover:bg-slate-100 text-slate-600 transition-all duration-200"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="w-[1px] bg-slate-200 my-1" />
          <button
            onClick={goNext}
            className="inline-flex items-center justify-center h-8 w-9 rounded-lg hover:bg-slate-100 text-slate-600 transition-all duration-200"
            aria-label="Próximo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <h2 className="font-serif font-bold text-slate-800 text-lg md:text-xl tracking-wide ml-2 capitalize">
          {formatRange(currentDate, view)}
        </h2>
      </div>

      {/* View switcher and Create Action */}
      <div className="flex items-center gap-3 flex-wrap">
        <GoogleSyncIndicator />

        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100/50 p-1 shadow-inner backdrop-blur-md">
          {(['week', 'day', 'month'] as AgendaView[]).map(v => (
            <button
              key={v}
              type="button"
              onClick={() => onViewChange(v)}
              className={cn(
                'px-4 py-1 text-xs font-bold rounded-lg transition-all duration-300',
                view === v
                  ? 'bg-white text-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-slate-100/50'
                  : 'text-slate-500 hover:text-slate-800',
              )}
            >
              {v === 'week' ? 'Semana' : v === 'day' ? 'Dia' : 'Mês'}
            </button>
          ))}
        </div>

        <button
          onClick={onNewSession}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-gradient-to-r from-[#489FB5] to-[#0A1F3D] hover:from-[#3f8d9f] hover:to-[#0f294e] text-white text-xs font-bold shadow-[0_4px_15px_rgba(72,159,181,0.25)] hover:shadow-[0_6px_25px_rgba(72,159,181,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Nova Sessão
        </button>
      </div>
    </div>
  )
}

