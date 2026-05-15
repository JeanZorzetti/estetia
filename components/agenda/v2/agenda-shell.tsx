'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { startOfWeek, addDays, startOfMonth, endOfMonth, format } from 'date-fns'
import { toast } from 'sonner'
import { AgendaToolbar } from './agenda-toolbar'
import { AgendaSidebar } from './agenda-sidebar'
import { WaitlistPanel } from './waitlist-panel'
import { ViewWeek } from './view-week'
import { ViewDay } from './view-day'
import { ViewMonth } from './view-month'
import { NovaSessaoDialog } from './nova-sessao-dialog'
import { SessionDrawer } from './session-drawer'
import type { AgendaSession, AgendaProfissional, AgendaSala, AgendaProcedure, AgendaView, AgendaFilters } from './types'

interface Props {
  initialSessions: AgendaSession[]
  profissionais: AgendaProfissional[]
  salas: AgendaSala[]
  procedures: AgendaProcedure[]
}

export function AgendaShell({ initialSessions, profissionais, salas, procedures }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<AgendaView>('week')
  const [sessions, setSessions] = useState<AgendaSession[]>(initialSessions)
  const [filters, setFilters] = useState<AgendaFilters>(() => ({
    profissionalIds: new Set(profissionais.map(p => p.id)),
    salaIds: new Set(salas.map(s => s.id)),
    statuses: new Set(['AGENDADA', 'CONFIRMADA', 'REMARCADA']),
  }))
  const [novaOpen, setNovaOpen] = useState(false)
  const [novaInitialDate, setNovaInitialDate] = useState<Date | null>(null)
  const [novaInitialProf, setNovaInitialProf] = useState<string | undefined>()
  const [drawerSession, setDrawerSession] = useState<AgendaSession | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  // Range based on view
  const range = useMemo(() => {
    if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 })
      return { from: start, to: addDays(start, 6) }
    }
    if (view === 'day') {
      const start = new Date(currentDate); start.setHours(0, 0, 0, 0)
      const end = new Date(currentDate); end.setHours(23, 59, 59, 999)
      return { from: start, to: end }
    }
    return { from: startOfMonth(currentDate), to: endOfMonth(currentDate) }
  }, [currentDate, view])

  // Fetch sessions when range/filters change
  const fetchSessions = useCallback(async () => {
    const params = new URLSearchParams()
    params.set('from', range.from.toISOString())
    params.set('to', range.to.toISOString())
    for (const pid of filters.profissionalIds) params.append('profissionalId', pid)
    for (const sid of filters.salaIds) params.append('salaId', sid)
    for (const st of filters.statuses) params.append('status', st)
    try {
      const res = await fetch(`/api/agenda/feed?${params}`)
      const data = await res.json()
      setSessions(data.sessions ?? [])
    } catch { /* ignore */ }
  }, [range, filters])

  useEffect(() => { fetchSessions() }, [fetchSessions])

  // Filtered sessions (client-side as defense)
  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      if (filters.statuses.size > 0 && !filters.statuses.has(s.status)) return false
      if (s.profissional && filters.profissionalIds.size > 0 && !filters.profissionalIds.has(s.profissional.id)) return false
      if (s.sala && filters.salaIds.size > 0 && !filters.salaIds.has(s.sala.id)) return false
      return true
    })
  }, [sessions, filters])

  // Drag-and-drop
  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const sessionId = String(active.id)
    const overId = String(over.id)
    // Slot format: slot:<isoDate>[:<profId>]
    const m = overId.match(/^slot:([^:]+)(?::(.+))?$/)
    if (!m) return
    const novaData = m[1]
    const novoProfId = m[2] && m[2] !== '__no_prof__' ? m[2] : undefined

    const sess = sessions.find(s => s.id === sessionId)
    if (!sess) return

    try {
      const res = await fetch(`/api/treatment-sessions/${sessionId}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          novaData,
          novoProfissionalId: novoProfId !== undefined ? novoProfId : null,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setSessions(prev => prev.map(s => s.id === sessionId ? data.session : s))
        toast.success('Sessão remarcada')
      } else {
        const data = await res.json()
        if (data.conflicts?.length) {
          toast.error(`Conflito: ${data.conflicts[0].pacienteNome}`)
        } else {
          toast.error(data.error ?? 'Falha ao mover sessão')
        }
      }
    } catch (err) {
      toast.error('Erro ao mover sessão')
    }
  }

  const onSlotClick = (date: Date, profId?: string) => {
    setNovaInitialDate(date)
    setNovaInitialProf(profId)
    setNovaOpen(true)
  }

  const onSessionCreated = (s: AgendaSession) => {
    setSessions(prev => [...prev, s])
    toast.success('Sessão criada')
  }

  const onSessionUpdated = (s: AgendaSession) => {
    setSessions(prev => prev.map(x => x.id === s.id ? s : x))
    if (drawerSession?.id === s.id) setDrawerSession(s)
  }

  const onSessionDeleted = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'CANCELADA' } : s))
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="flex flex-col gap-4 p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie sessões, salas e profissionais — drag-and-drop para remarcar
          </p>
        </div>

        <AgendaToolbar
          currentDate={currentDate}
          view={view}
          onDateChange={setCurrentDate}
          onViewChange={setView}
          onNewSession={() => { setNovaInitialDate(new Date()); setNovaInitialProf(undefined); setNovaOpen(true) }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
          <div className="flex flex-col gap-4">
            <AgendaSidebar
              profissionais={profissionais}
              salas={salas}
              filters={filters}
              onFiltersChange={setFilters}
            />
            <WaitlistPanel />
          </div>

          <div>
            {view === 'week' && (
              <ViewWeek
                currentDate={currentDate}
                sessions={filteredSessions}
                onSlotClick={onSlotClick}
                onSessionClick={(s) => setDrawerSession(s)}
              />
            )}
            {view === 'day' && (
              <ViewDay
                currentDate={currentDate}
                sessions={filteredSessions}
                profissionais={profissionais}
                onSlotClick={(date, profId) => onSlotClick(date, profId)}
                onSessionClick={(s) => setDrawerSession(s)}
              />
            )}
            {view === 'month' && (
              <ViewMonth
                currentDate={currentDate}
                sessions={filteredSessions}
                onDayClick={(d) => { setCurrentDate(d); setView('day') }}
              />
            )}
          </div>
        </div>

        <NovaSessaoDialog
          open={novaOpen}
          onOpenChange={setNovaOpen}
          initialDate={novaInitialDate}
          initialProfissionalId={novaInitialProf}
          profissionais={profissionais}
          salas={salas}
          procedures={procedures}
          onCreated={onSessionCreated}
        />

        <SessionDrawer
          session={drawerSession}
          open={!!drawerSession}
          onOpenChange={(v) => { if (!v) setDrawerSession(null) }}
          onUpdated={onSessionUpdated}
          onDeleted={onSessionDeleted}
        />
      </div>
    </DndContext>
  )
}
