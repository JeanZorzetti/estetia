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
    <div className="flex flex-col border border-slate-200/50 rounded-2xl overflow-hidden bg-white/40 backdrop-blur-md shadow-sm">
      <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-200/50">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(label => (
          <div key={label} className="text-[9px] uppercase tracking-widest text-[#0A1F3D] font-bold py-2.5 text-center">
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
                'relative border border-slate-200/30 p-2 min-h-[96px] text-left flex flex-col gap-1 transition-all duration-300',
                !inMonth && 'bg-slate-50/[0.05] text-slate-300',
                inMonth && 'hover:bg-slate-100/50',
                isCurrentDay && 'bg-[#489FB5]/5 ring-1 ring-[#489FB5]/30 overflow-hidden',
              )}
            >
              {isCurrentDay && (
                <div className="absolute top-0 inset-x-0 h-0.5 bg-[#489FB5]" />
              )}
              <div className="relative z-10 flex items-center justify-between w-full">
                <span className={cn(
                  'text-[10px] font-extrabold tabular-nums',
                  isCurrentDay && 'text-[#489FB5]',
                  !inMonth && 'text-slate-300',
                  inMonth && !isCurrentDay && 'text-slate-600',
                )}>
                  {format(day, 'd')}
                </span>
                {count > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[#0A1F3D]/5 border border-slate-200 text-[#0A1F3D] tabular-nums scale-90">
                    {count}
                  </span>
                )}
              </div>
              {count > 0 && (
                <div className="relative z-10 flex flex-col gap-0.5 mt-auto w-full">
                  <div
                    className="h-1 rounded-full bg-[#489FB5]/80 shadow-[0_0_6px_rgba(72,159,181,0.2)]"
                    style={{ opacity: 0.4 + intensity * 0.6 }}
                  />
                  {dayList.slice(0, 2).map(s => (
                    <p key={s.id} className="text-[9px] font-semibold truncate text-slate-500">
                      {format(new Date(s.dataAgendada), 'HH:mm')} {s.treatment.paciente.nome}
                    </p>
                  ))}
                  {count > 2 && (
                    <p className="text-[9px] font-semibold text-slate-400">+{count - 2} mais</p>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

