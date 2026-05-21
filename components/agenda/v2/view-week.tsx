'use client'

import { useMemo } from 'react'
import { startOfWeek, addDays, format, isSameDay, differenceInMinutes } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TimeSlot } from './time-slot'
import { SessionCard } from './session-card'
import { cn } from '@/lib/utils'
import type { AgendaSession } from './types'

const DAY_START_HOUR = 7
const DAY_END_HOUR = 22
const SLOT_MINUTES = 30
const PX_PER_MINUTE = 0.9 // 27px per 30min slot

const TOTAL_MINUTES = (DAY_END_HOUR - DAY_START_HOUR) * 60
const SLOTS_PER_DAY = TOTAL_MINUTES / SLOT_MINUTES

interface Props {
  currentDate: Date
  sessions: AgendaSession[]
  onSlotClick: (dateTime: Date) => void
  onSessionClick: (session: AgendaSession) => void
}

export function ViewWeek({ currentDate, sessions, onSlotClick, onSessionClick }: Props) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday
  const days = useMemo(() => Array.from({ length: 6 }, (_, i) => addDays(weekStart, i)), [weekStart])

  const sessionsByDay = useMemo(() => {
    const map: Record<string, AgendaSession[]> = {}
    for (const day of days) {
      const key = format(day, 'yyyy-MM-dd')
      map[key] = sessions
        .filter(s => isSameDay(new Date(s.dataAgendada), day))
        .sort((a, b) => new Date(a.dataAgendada).getTime() - new Date(b.dataAgendada).getTime())
    }
    return map
  }, [days, sessions])

  // Hour labels
  const hourLabels = useMemo(() => {
    return Array.from({ length: DAY_END_HOUR - DAY_START_HOUR }, (_, i) => DAY_START_HOUR + i)
  }, [])

  const slotHeightPx = SLOT_MINUTES * PX_PER_MINUTE
  const columnHeightPx = TOTAL_MINUTES * PX_PER_MINUTE

  const today = new Date()

  return (
    <div className="flex flex-col border border-slate-200/50 rounded-2xl overflow-hidden bg-white/40 backdrop-blur-md shadow-sm">
      {/* Header row with day names */}
      <div className="grid grid-cols-[60px_repeat(6,1fr)] border-b border-slate-200/50 bg-slate-50/50">
        <div className="border-r border-slate-200/30" />
        {days.map((day) => {
          const isToday = isSameDay(day, today)
          return (
            <div
              key={day.toISOString()}
              className={cn(
                'flex flex-col items-center justify-center py-3 border-r border-slate-200/30 last:border-r-0 transition-colors',
                isToday && 'bg-[#489FB5]/5 relative',
              )}
            >
              {isToday && (
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#489FB5] to-[#0A1F3D]" />
              )}
              <p className={cn(
                'text-[9px] uppercase tracking-widest font-bold',
                isToday ? 'text-[#489FB5]' : 'text-slate-400'
              )}>
                {format(day, 'EEE', { locale: ptBR })}
              </p>
              <p className={cn(
                'text-lg font-extrabold tracking-tight tabular-nums mt-0.5',
                isToday ? 'text-[#0A1F3D] font-black' : 'text-slate-700',
              )}>
                {format(day, 'd')}
              </p>
            </div>
          )
        })}
      </div>

      {/* Body: time labels + day columns */}
      <div className="grid grid-cols-[60px_repeat(6,1fr)] relative overflow-y-auto" style={{ maxHeight: '70vh' }}>
        {/* Hour labels column */}
        <div className="border-r border-slate-200/30 bg-slate-50/20">
          {hourLabels.map((h, i) => (
            <div
              key={h}
              style={{ height: `${slotHeightPx * 2}px` }}
              className={cn(
                'text-[9px] font-bold text-slate-400 tabular-nums pr-2.5 text-right pt-0.5',
                i === 0 && 'pt-2',
              )}
            >
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>


        {/* Day columns */}
        {days.map((day) => {
          const dayKey = format(day, 'yyyy-MM-dd')
          const daySessions = sessionsByDay[dayKey] ?? []

          return (
            <div
              key={day.toISOString()}
              className="relative border-r border-slate-200/30 last:border-r-0"
              style={{ height: `${columnHeightPx}px` }}
            >
              {/* Slot grid for click + drop */}
              {Array.from({ length: SLOTS_PER_DAY }, (_, i) => {
                const slotStartMinutes = i * SLOT_MINUTES
                const slotDate = new Date(day)
                slotDate.setHours(DAY_START_HOUR + Math.floor(slotStartMinutes / 60), slotStartMinutes % 60, 0, 0)
                const isHourBoundary = (i + 1) % 2 === 0
                return (
                  <TimeSlot
                    key={i}
                    id={`slot:${slotDate.toISOString()}`}
                    height={slotHeightPx}
                    isHourBoundary={isHourBoundary}
                    onClick={() => onSlotClick(slotDate)}
                  />
                )
              })}

              {/* Session cards positioned absolutely */}
              {daySessions.map((session) => {
                const sessionStart = new Date(session.dataAgendada)
                const dayStart = new Date(day)
                dayStart.setHours(DAY_START_HOUR, 0, 0, 0)
                const minutesFromDayStart = differenceInMinutes(sessionStart, dayStart)
                const topPx = minutesFromDayStart * PX_PER_MINUTE
                const heightPx = (session.duracaoMinutos ?? 60) * PX_PER_MINUTE

                // Naive overlap handling: find overlapping siblings at same time
                const overlapping = daySessions.filter(other => {
                  if (other.id === session.id) return false
                  const otherStart = new Date(other.dataAgendada)
                  const otherEnd = new Date(otherStart.getTime() + (other.duracaoMinutos ?? 60) * 60_000)
                  const thisEnd = new Date(sessionStart.getTime() + (session.duracaoMinutos ?? 60) * 60_000)
                  return otherStart < thisEnd && otherEnd > sessionStart
                })
                const overlapCount = overlapping.length + 1
                const indexInGroup = overlapping.filter(o =>
                  new Date(o.dataAgendada).getTime() <= sessionStart.getTime() && o.id < session.id,
                ).length
                const widthPct = 100 / overlapCount
                const leftPct = widthPct * indexInGroup

                return (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onClick={() => onSessionClick(session)}
                    heightPx={heightPx}
                    topPx={topPx}
                    widthPct={widthPct}
                    leftPct={leftPct}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
