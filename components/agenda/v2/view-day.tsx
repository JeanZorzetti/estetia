'use client'

import { useMemo } from 'react'
import { isSameDay, differenceInMinutes, format } from 'date-fns'
import { TimeSlot } from './time-slot'
import { SessionCard } from './session-card'
import type { AgendaSession, AgendaProfissional } from './types'

const DAY_START_HOUR = 7
const DAY_END_HOUR = 22
const SLOT_MINUTES = 15
const PX_PER_MINUTE = 1.1

const TOTAL_MINUTES = (DAY_END_HOUR - DAY_START_HOUR) * 60
const SLOTS_PER_DAY = TOTAL_MINUTES / SLOT_MINUTES

interface Props {
  currentDate: Date
  sessions: AgendaSession[]
  profissionais: AgendaProfissional[]
  onSlotClick: (dateTime: Date, profissionalId?: string) => void
  onSessionClick: (session: AgendaSession) => void
}

export function ViewDay({ currentDate, sessions, profissionais, onSlotClick, onSessionClick }: Props) {
  const daySessions = useMemo(
    () => sessions.filter(s => isSameDay(new Date(s.dataAgendada), currentDate)),
    [sessions, currentDate],
  )

  const sessionsByProf = useMemo(() => {
    const map: Record<string, AgendaSession[]> = {}
    map['__no_prof__'] = []
    for (const p of profissionais) map[p.id] = []
    for (const s of daySessions) {
      const k = s.profissional?.id ?? '__no_prof__'
      if (!map[k]) map[k] = []
      map[k].push(s)
    }
    return map
  }, [daySessions, profissionais])

  const slotHeightPx = SLOT_MINUTES * PX_PER_MINUTE
  const columnHeightPx = TOTAL_MINUTES * PX_PER_MINUTE
  const hourLabels = Array.from({ length: DAY_END_HOUR - DAY_START_HOUR }, (_, i) => DAY_START_HOUR + i)

  const cols = [...profissionais]
  const showUnassigned = sessionsByProf['__no_prof__'].length > 0

  return (
    <div className="flex flex-col border border-border/60 rounded-xl overflow-hidden bg-card">
      <div className="grid border-b border-border/60 bg-muted/20" style={{ gridTemplateColumns: `60px repeat(${cols.length + (showUnassigned ? 1 : 0)}, minmax(180px, 1fr))` }}>
        <div className="border-r border-border/40" />
        {cols.map(p => (
          <div key={p.id} className="flex items-center justify-center py-3 border-r border-border/40 last:border-r-0">
            <p className="text-sm font-semibold tracking-tight truncate">{p.nome}</p>
          </div>
        ))}
        {showUnassigned && (
          <div className="flex items-center justify-center py-3 border-r border-border/40">
            <p className="text-sm font-medium text-muted-foreground italic">Sem profissional</p>
          </div>
        )}
      </div>

      <div className="grid relative overflow-auto" style={{ maxHeight: '70vh', gridTemplateColumns: `60px repeat(${cols.length + (showUnassigned ? 1 : 0)}, minmax(180px, 1fr))` }}>
        <div className="border-r border-border/40 bg-muted/10">
          {hourLabels.map((h, i) => (
            <div
              key={h}
              style={{ height: `${slotHeightPx * 4}px` }}
              className="text-[10px] text-muted-foreground tabular-nums pr-2 text-right pt-0.5"
            >
              {String(h).padStart(2, '0')}:00
              {i}
            </div>
          ))}
        </div>

        {[...cols.map(p => p.id), ...(showUnassigned ? ['__no_prof__'] : [])].map((profId, colIdx) => (
          <div
            key={profId}
            className="relative border-r border-border/40 last:border-r-0"
            style={{ height: `${columnHeightPx}px` }}
          >
            {Array.from({ length: SLOTS_PER_DAY }, (_, i) => {
              const slotDate = new Date(currentDate)
              const totalMin = i * SLOT_MINUTES
              slotDate.setHours(DAY_START_HOUR + Math.floor(totalMin / 60), totalMin % 60, 0, 0)
              return (
                <TimeSlot
                  key={i}
                  id={`slot:${slotDate.toISOString()}:${profId}`}
                  height={slotHeightPx}
                  isHourBoundary={(i + 1) % 4 === 0}
                  onClick={() => onSlotClick(slotDate, profId === '__no_prof__' ? undefined : profId)}
                />
              )
            })}

            {(sessionsByProf[profId] ?? []).map(session => {
              const sessionStart = new Date(session.dataAgendada)
              const dayStart = new Date(currentDate)
              dayStart.setHours(DAY_START_HOUR, 0, 0, 0)
              const topPx = differenceInMinutes(sessionStart, dayStart) * PX_PER_MINUTE
              const heightPx = (session.duracaoMinutos ?? 60) * PX_PER_MINUTE
              return (
                <SessionCard
                  key={session.id}
                  session={session}
                  onClick={() => onSessionClick(session)}
                  heightPx={heightPx}
                  topPx={topPx}
                  widthPct={100}
                  leftPct={0}
                />
              )
            })}
            {colIdx === -1 && format(currentDate, 'yyyy')}
          </div>
        ))}
      </div>
    </div>
  )
}
