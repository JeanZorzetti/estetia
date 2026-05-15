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
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onDateChange(new Date())} className="h-8 text-xs">
          <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
          Hoje
        </Button>
        <div className="flex">
          <Button variant="outline" size="icon" onClick={goPrev} className="h-8 w-8 rounded-r-none border-r-0">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goNext} className="h-8 w-8 rounded-l-none">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <h2 className="text-base font-semibold tracking-tight ml-2 capitalize">
          {formatRange(currentDate, view)}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <GoogleSyncIndicator />

        <div className="inline-flex rounded-lg border border-border/60 bg-muted/20 p-0.5">
          {(['week', 'day', 'month'] as AgendaView[]).map(v => (
            <button
              key={v}
              type="button"
              onClick={() => onViewChange(v)}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                view === v ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {v === 'week' ? 'Semana' : v === 'day' ? 'Dia' : 'Mês'}
            </button>
          ))}
        </div>

        <Button size="sm" onClick={onNewSession} className="h-8">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Nova sessão
        </Button>
      </div>
    </div>
  )
}
