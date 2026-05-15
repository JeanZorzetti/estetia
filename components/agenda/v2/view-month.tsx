'use client'

import { useMemo } from 'react'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { AgendaSession } from './types'

interface Props {
  currentDate: Date
  sessions: AgendaSession[]
  onDayClick: (date: Date) => void
}

export function ViewMonth({ currentDate, sessions, onDayClick }: Props) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = useMemo(() => {
    const out: Date[] = []
    let d = gridStart
    while (d <= gridEnd) {
      out.push(d)
      d = addDays(d, 1)
    }
    return out
  }, [gridStart, gridEnd])

  const sessionsByDay = useMemo(() => {
    const map: Record<string, AgendaSession[]> = {}
    for (const d of days) map[format(d, 'yyyy-MM-dd')] = []
    for (const s of sessions) {
      const key = format(new Date(s.dataAgendada), 'yyyy-MM-dd')
      if (map[key]) map[key].push(s)
    }
    return map
  }, [days, sessions])

  const maxCount = Math.max(1, ...Object.values(sessionsByDay).map(arr => arr.length))

  return (
    <div className="flex flex-col border border-border/60 rounded-xl overflow-hidden bg-card">
      <div className="grid grid-cols-7 bg-muted/20 border-b border-border/60">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(label => (
          <div key={label} className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium py-2 text-center">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-6">
        {days.map(day => {
          const key = format(day, 'yyyy-MM-dd')
          const dayList = sessionsByDay[key] ?? []
          const count = dayList.length
          const intensity = Math.min(1, count / maxCount)
          const inMonth = isSameMonth(day, currentDate)
          const isCurrentDay = isToday(day)

          return (
            <button
              key={key}
              onClick={() => onDayClick(day)}
              className={cn(
                'border border-border/30 p-2 min-h-[88px] text-left flex flex-col gap-1 transition-colors hover:bg-muted/30',
                !inMonth && 'bg-muted/10 text-muted-foreground/50',
                isCurrentDay && 'ring-2 ring-primary ring-inset',
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn(
                  'text-xs font-bold tabular-nums',
                  isCurrentDay && 'text-primary',
                )}>
                  {format(day, 'd')}
                </span>
                {count > 0 && (
                  <span className="text-[9px] font-semibold text-muted-foreground tabular-nums px-1 rounded bg-muted">
                    {count}
                  </span>
                )}
              </div>
              {count > 0 && (
                <div className="flex flex-col gap-0.5 mt-auto">
                  <div
                    className="h-1 rounded-full bg-primary"
                    style={{ opacity: 0.4 + intensity * 0.6 }}
                  />
                  {dayList.slice(0, 2).map(s => (
                    <p key={s.id} className="text-[9px] truncate text-muted-foreground">
                      {format(new Date(s.dataAgendada), 'HH:mm')} {s.treatment.paciente.nome}
                    </p>
                  ))}
                  {count > 2 && (
                    <p className="text-[9px] text-muted-foreground/60">+{count - 2} mais</p>
                  )}
                </div>
              )}
              {isSameDay(day, day) && false && format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}
