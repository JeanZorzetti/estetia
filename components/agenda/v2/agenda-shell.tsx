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
  const [editingSession, setEditingSession] = useState<AgendaSession | null>(null)

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
      <div className="relative min-h-[calc(100vh-4rem)] w-full py-8 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col gap-6">
        {/* Premium Micro-Grain background texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[radial-gradient(#0A1F3D_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Decorative ambient lighting halos */}
        <div className="absolute top-12 -left-64 w-[500px] h-[500px] rounded-full bg-[#489FB5]/5 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-24 -right-64 w-[500px] h-[500px] rounded-full bg-[#0A1F3D]/5 blur-[150px] pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 w-full">
          {/* Header section with classic Serif typography */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/40 pb-6">
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C5A059]/20 bg-[#C5A059]/5 text-[9px] font-bold text-[#8E6D31] tracking-widest uppercase mb-3">
                ☕ Cabine Clínica VIP · Agenda Executiva Inteligente
              </span>
              <h1 className="font-serif font-extrabold text-3xl text-slate-800 tracking-wide">
                Agenda de Elite
              </h1>
              <p className="text-xs font-medium text-slate-400 mt-1 max-w-xl leading-relaxed">
                Gerencie sessões de tratamento, salas e profissionais. Arraste e solte sessões para remarcar dinamicamente.
              </p>
            </div>
          </div>

          <AgendaToolbar
            currentDate={currentDate}
            view={view}
            onDateChange={setCurrentDate}
            onViewChange={setView}
            onNewSession={() => { setNovaInitialDate(new Date()); setNovaInitialProf(undefined); setNovaOpen(true) }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">
            <div className="flex flex-col gap-6">
              <AgendaSidebar
                profissionais={profissionais}
                salas={salas}
                filters={filters}
                onFiltersChange={setFilters}
              />
              <WaitlistPanel />
            </div>

            <div className="relative z-10 rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-xl p-3 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.04)] transition-all duration-500">
              {/* Inside white border for double-border luxury glass look */}
              <div className="absolute inset-0.5 rounded-[14px] border border-white/50 pointer-events-none" />
              
              <div className="relative z-10">
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
          </div>
        </div>

        <NovaSessaoDialog
          open={novaOpen || !!editingSession}
          onOpenChange={(v) => {
            if (!v) { setNovaOpen(false); setEditingSession(null) }
            else setNovaOpen(true)
          }}
          initialDate={novaInitialDate}
          initialProfissionalId={novaInitialProf}
          profissionais={profissionais}
          salas={salas}
          procedures={procedures}
          onCreated={onSessionCreated}
          onUpdated={(s) => { onSessionUpdated(s); toast.success('Sessão atualizada') }}
          session={editingSession}
        />

        <SessionDrawer
          session={drawerSession}
          open={!!drawerSession}
          onOpenChange={(v) => { if (!v) setDrawerSession(null) }}
          onUpdated={onSessionUpdated}
          onDeleted={onSessionDeleted}
          onEdit={(s) => { setDrawerSession(null); setEditingSession(s) }}
        />
      </div>
    </DndContext>
  )
}

