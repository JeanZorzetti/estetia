'use client'

import { useState, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Clock, User, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AgendaSession {
  id: string
  dataAgendada: string // ISO
  duracaoMinutos: number
  status: 'AGENDADA' | 'CONFIRMADA' | 'REALIZADA' | 'NO_SHOW' | 'REMARCADA' | 'CANCELADA'
  noShowScore: number | null
  profissionalNome: string
  profissionalId: string
  pacienteNome: string
  pacienteTelefone: string
  procedimentoNome: string
}

export interface AgendaProfessional {
  id: string
  nome: string
}

interface Props {
  sessions: AgendaSession[]
  professionals: AgendaProfessional[]
  currentDate: string // ISO date YYYY-MM-DD
}

// ─── Constants ────────────────────────────────────────────────────────────────

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8) // 8..18
const SLOT_HEIGHT = 64 // px per hour

const STATUS_COLORS: Record<AgendaSession['status'], string> = {
  AGENDADA: 'bg-blue-100 border-blue-300 text-blue-800',
  CONFIRMADA: 'bg-green-100 border-green-300 text-green-800',
  REALIZADA: 'bg-gray-100 border-gray-300 text-gray-600',
  NO_SHOW: 'bg-red-100 border-red-300 text-red-800',
  REMARCADA: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  CANCELADA: 'bg-gray-50 border-gray-200 text-gray-400 opacity-50',
}

const STATUS_LABELS: Record<AgendaSession['status'], string> = {
  AGENDADA: 'Agendada',
  CONFIRMADA: 'Confirmada',
  REALIZADA: 'Realizada',
  NO_SHOW: 'No-show',
  REMARCADA: 'Remarcada',
  CANCELADA: 'Cancelada',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseISOLocal(iso: string) {
  return new Date(iso)
}

function getWeekDates(anchor: Date): Date[] {
  const day = anchor.getDay() // 0=Sun
  const monday = new Date(anchor)
  monday.setDate(anchor.getDate() - ((day + 6) % 7))
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function toDateStr(d: Date) {
  return d.toISOString().split('T')[0]
}

function sessionTopPercent(session: AgendaSession): number {
  const d = parseISOLocal(session.dataAgendada)
  const hour = d.getHours() + d.getMinutes() / 60
  return ((hour - 8) / 11) * 100
}

function sessionHeightPercent(session: AgendaSession): number {
  return (session.duracaoMinutos / 60 / 11) * 100
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AgendaClinica({ sessions, professionals, currentDate }: Props) {
  const [anchor, setAnchor] = useState(() => new Date(currentDate + 'T12:00:00'))
  const [filterProfId, setFilterProfId] = useState<string>('all')
  const [selectedSession, setSelectedSession] = useState<AgendaSession | null>(null)

  const weekDates = getWeekDates(anchor)

  const prevWeek = () => {
    const d = new Date(anchor)
    d.setDate(d.getDate() - 7)
    setAnchor(d)
  }

  const nextWeek = () => {
    const d = new Date(anchor)
    d.setDate(d.getDate() + 7)
    setAnchor(d)
  }

  const goToday = () => setAnchor(new Date())

  const filteredSessions = sessions.filter(s => {
    if (filterProfId !== 'all' && s.profissionalId !== filterProfId) return false
    return true
  })

  const sessionsByDate = useCallback(
    (dateStr: string) =>
      filteredSessions.filter(
        s =>
          parseISOLocal(s.dataAgendada).toISOString().split('T')[0] === dateStr &&
          s.status !== 'CANCELADA'
      ),
    [filteredSessions]
  )

  const today = toDateStr(new Date())

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToday}>
            Hoje
          </Button>
          <Button variant="outline" size="sm" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            {weekDates[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            {' – '}
            {weekDates[5].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>

        <Select value={filterProfId} onValueChange={setFilterProfId}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todos os profissionais" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os profissionais</SelectItem>
            {professionals.map(p => (
              <SelectItem key={p.id} value={p.id}>
                {p.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4 overflow-hidden">
        {/* Week grid */}
        <div className="flex-1 overflow-auto">
          {/* Day headers */}
          <div className="grid" style={{ gridTemplateColumns: '48px repeat(6, 1fr)' }}>
            <div />
            {weekDates.map(d => {
              const ds = toDateStr(d)
              const isToday = ds === today
              return (
                <div
                  key={ds}
                  className={cn(
                    'py-2 text-center text-xs font-medium',
                    isToday ? 'text-rose-600' : 'text-muted-foreground'
                  )}
                >
                  <div>{d.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}</div>
                  <div
                    className={cn(
                      'mx-auto mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm',
                      isToday && 'bg-rose-500 font-semibold text-white'
                    )}
                  >
                    {d.getDate()}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Time grid */}
          <div
            className="relative grid border-t"
            style={{
              gridTemplateColumns: '48px repeat(6, 1fr)',
              height: `${SLOT_HEIGHT * HOURS.length}px`,
            }}
          >
            {/* Hour labels */}
            <div className="relative">
              {HOURS.map(h => (
                <div
                  key={h}
                  className="absolute right-2 text-xs text-muted-foreground"
                  style={{ top: `${((h - 8) / 11) * 100}%`, transform: 'translateY(-50%)' }}
                >
                  {String(h).padStart(2, '0')}h
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDates.map(d => {
              const ds = toDateStr(d)
              const daySessions = sessionsByDate(ds)
              const isToday = ds === today

              return (
                <div
                  key={ds}
                  className={cn(
                    'relative border-l',
                    isToday && 'bg-rose-50/30'
                  )}
                >
                  {/* Hour lines */}
                  {HOURS.map(h => (
                    <div
                      key={h}
                      className="absolute left-0 right-0 border-t border-gray-100"
                      style={{ top: `${((h - 8) / 11) * 100}%` }}
                    />
                  ))}

                  {/* Sessions */}
                  {daySessions.map((s: AgendaSession) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSession(s)}
                      className={cn(
                        'absolute left-1 right-1 overflow-hidden rounded border px-1 py-0.5 text-left text-xs transition-opacity hover:opacity-80',
                        STATUS_COLORS[s.status]
                      )}
                      style={{
                        top: `${sessionTopPercent(s)}%`,
                        height: `${Math.max(sessionHeightPercent(s), 3)}%`,
                      }}
                    >
                      <div className="flex items-center gap-1 truncate font-medium">
                        {s.noShowScore !== null && s.noShowScore >= 65 && (
                          <AlertTriangle className="h-2.5 w-2.5 shrink-0 text-orange-500" />
                        )}
                        {s.pacienteNome.split(' ')[0]}
                      </div>
                      <div className="truncate opacity-75">{s.procedimentoNome}</div>
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {/* Session detail panel */}
        {selectedSession && (
          <Card className="w-72 shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                <span>Sessão</span>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">{selectedSession.pacienteNome}</p>
                <p className="text-muted-foreground">{selectedSession.pacienteTelefone}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {parseISOLocal(selectedSession.dataAgendada).toLocaleString('pt-BR', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'America/Sao_Paulo',
                  })}
                  {' · '}
                  {selectedSession.duracaoMinutos} min
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  {selectedSession.profissionalNome}
                </div>
              </div>

              <div>
                <p className="font-medium">{selectedSession.procedimentoNome}</p>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  className={STATUS_COLORS[selectedSession.status]}
                >
                  {STATUS_LABELS[selectedSession.status]}
                </Badge>

                {selectedSession.noShowScore !== null && (
                  <span
                    className={cn(
                      'text-xs font-semibold',
                      selectedSession.noShowScore >= 65
                        ? 'text-red-600'
                        : selectedSession.noShowScore >= 35
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    )}
                  >
                    Risco {selectedSession.noShowScore >= 65 ? 'ALTO' : selectedSession.noShowScore >= 35 ? 'MÉDIO' : 'BAIXO'} ({selectedSession.noShowScore})
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
