'use client'

import { useState } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './status-badge'
import { NoShowBadge } from './no-show-badge'
import {
  CheckCircle2, Calendar, Clock, MapPin, User,
  XCircle, AlertOctagon, RotateCcw, Trash2, Loader2,
  Phone, MessageCircle, TrendingDown, Pencil, DollarSign,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { AgendaSession } from './types'
import { cn } from '@/lib/utils'

interface Props {
  session: AgendaSession | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onUpdated: (session: AgendaSession) => void
  onDeleted: (id: string) => void
  onEdit: (session: AgendaSession) => void
}

const CATEGORIA_CORES: Record<string, string> = {
  facial:   'bg-teal-50 text-teal-600 border-teal/30',
  corporal: 'bg-navy-50 text-navy border-navy/20',
  capilar:  'bg-gold-50 text-gold-600 border-gold/30',
  outros:   'bg-slate-100 text-slate-500 border-slate-200',
}

const CATEGORIA_LABELS: Record<string, string> = {
  facial:   'Facial',
  corporal:  'Corporal',
  capilar:   'Capilar',
  outros:    'Outros',
}

const TRANSITIONS = [
  { label: 'Confirmar', status: 'CONFIRMADA', icon: CheckCircle2 },
  { label: 'Realizar',  status: 'REALIZADA',  icon: CheckCircle2 },
  { label: 'No-show',   status: 'NO_SHOW',    icon: AlertOctagon  },
  { label: 'Remarcar',  status: 'REMARCADA',  icon: RotateCcw     },
  { label: 'Cancelar',  status: 'CANCELADA',  icon: XCircle       },
] as const

const ACTION_STYLES: Record<string, string> = {
  CONFIRMADA: 'bg-navy text-white hover:bg-navy-600 rounded-xl px-4 py-2 font-bold text-xs transition-all duration-200 hover:-translate-y-0.5 border-0',
  REALIZADA:  'bg-gold-50 border border-gold/30 text-gold-600 hover:bg-gold hover:text-navy rounded-xl px-4 py-2 font-bold text-xs transition-all duration-200 hover:-translate-y-0.5',
  NO_SHOW:    'bg-red-50 border border-red-300 text-red-600 hover:bg-red-600 hover:text-white rounded-xl px-4 py-2 font-bold text-xs transition-all duration-200 hover:-translate-y-0.5',
  REMARCADA:  'bg-teal-50 border border-teal/30 text-teal-600 hover:bg-teal hover:text-white rounded-xl px-4 py-2 font-bold text-xs transition-all duration-200 hover:-translate-y-0.5',
  CANCELADA:  'bg-red-50 border border-red-300 text-red-600 hover:bg-red-600 hover:text-white rounded-xl px-4 py-2 font-bold text-xs transition-all duration-200 hover:-translate-y-0.5',
}

function formatBRL(value: number | null | undefined): string | null {
  if (value == null) return null
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function SessionDrawer({ session, open, onOpenChange, onUpdated, onDeleted, onEdit }: Props) {
  const [saving, setSaving] = useState(false)

  if (!session) return null

  const changeStatus = async (newStatus: string) => {
    if (!confirm(`Mudar status para "${newStatus}"?`)) return
    setSaving(true)
    try {
      const res = await fetch(`/api/treatment-sessions/${session.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        const data = await res.json()
        onUpdated(data.session)
      }
    } finally {
      setSaving(false)
    }
  }

  const deleteSession = async () => {
    if (!confirm('Cancelar esta sessão? A sessão será marcada como cancelada.')) return
    setSaving(true)
    try {
      const res = await fetch(`/api/treatment-sessions/${session.id}`, { method: 'DELETE' })
      if (res.ok) {
        onDeleted(session.id)
        onOpenChange(false)
      }
    } finally {
      setSaving(false)
    }
  }

  const start = new Date(session.dataAgendada)
  const finalizado = ['REALIZADA', 'NO_SHOW', 'CANCELADA'].includes(session.status)

  const { paciente, procedure, valorTotal, sessoesPrevistas, sessoesRealizadas } = session.treatment
  const valorExibir = valorTotal ?? procedure?.valorPadrao ?? null
  const progresso = sessoesPrevistas && sessoesPrevistas > 0
    ? Math.round(((sessoesRealizadas ?? 0) / sessoesPrevistas) * 100)
    : null

  const telefone = paciente.telefone?.replace(/\D/g, '') ?? null
  const telefoneFormatado = paciente.telefone ?? null

  const catKey = procedure?.categoria ?? 'outros'
  const catColorClass = CATEGORIA_CORES[catKey] ?? CATEGORIA_CORES.outros
  const catLabel = CATEGORIA_LABELS[catKey] ?? catKey

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto bg-white border-l border-navy/10 shadow-2xl p-0">

        {/* Header navy com textura */}
        <div className="relative bg-navy overflow-hidden px-6 pt-8 pb-6">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, #C5A059 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gold/10 blur-3xl" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-gold text-[10px] font-bold tracking-widest uppercase mb-1">Paciente</p>
              <h2 className="font-serif text-xl font-bold text-white leading-tight truncate">
                {paciente.nome}
              </h2>
              {paciente.email && (
                <p className="text-white/50 text-xs mt-1 truncate">{paciente.email}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5 items-end shrink-0 pt-1">
              <StatusBadge status={session.status} />
              <NoShowBadge score={session.noShowScore} />
            </div>
          </div>

          {/* Contato rápido */}
          {telefone && (
            <div className="relative z-10 flex gap-2 mt-4">
              <a
                href={`https://wa.me/55${telefone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold hover:bg-gold/20 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
              <a
                href={`tel:${paciente.telefone}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                {telefoneFormatado}
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 p-6">

          {/* Cápsula de agendamento */}
          <div className="bg-navy-50 border border-navy/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal/20 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-teal" />
              </div>
              <span className="text-sm font-semibold text-navy capitalize">
                {format(start, "EEEE, d 'de' MMMM yyyy", { locale: ptBR })}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal/20 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-teal" />
              </div>
              <span className="text-sm font-semibold text-navy tabular-nums">
                {format(start, 'HH:mm')} · {session.duracaoMinutos ?? 60} min
              </span>
            </div>

            {session.profissional && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal/20 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-teal" />
                </div>
                <span className="text-sm font-semibold text-navy">{session.profissional.nome}</span>
              </div>
            )}

            {session.sala && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-teal" />
                </div>
                <span className="flex items-center gap-2 text-sm font-semibold text-navy">
                  {session.sala.cor && (
                    <span
                      className="h-3.5 w-3.5 shrink-0 rounded-full shadow-sm"
                      style={{ backgroundColor: session.sala.cor }}
                    />
                  )}
                  {session.sala.nome}
                </span>
              </div>
            )}
          </div>

          {/* Procedimento + categoria */}
          {procedure && (
            <div className="bg-navy-50 border border-navy/10 rounded-2xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Procedimento</p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-navy">{procedure.nome}</p>
                <span className={cn(
                  'text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border',
                  catColorClass
                )}>
                  {catLabel}
                </span>
              </div>
            </div>
          )}

          {/* Valor + progresso de sessões */}
          {(valorExibir !== null || (sessoesPrevistas && sessoesPrevistas > 0)) && (
            <div className="bg-gold-50 border border-gold/20 rounded-2xl p-4">
              {valorExibir !== null && (
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-gold-600" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Valor</span>
                  <span className="ml-auto text-base font-bold text-navy font-serif">
                    {formatBRL(valorExibir)}
                  </span>
                </div>
              )}

              {sessoesPrevistas != null && sessoesPrevistas > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Progresso</span>
                    <span className="text-xs font-bold text-navy">
                      {sessoesRealizadas ?? 0} de {sessoesPrevistas} sessões
                    </span>
                  </div>
                  <div className="h-1.5 bg-gold/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all duration-500"
                      style={{ width: `${progresso ?? 0}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No-show score com contexto */}
          {session.noShowScore != null && session.noShowScore >= 34 && (
            <div className={cn(
              'border rounded-2xl p-4 flex items-start gap-3',
              session.noShowScore >= 67
                ? 'bg-red-50 border-red-200'
                : 'bg-gold-50 border-gold/20'
            )}>
              <TrendingDown className={cn(
                'w-4 h-4 shrink-0 mt-0.5',
                session.noShowScore >= 67 ? 'text-red-500' : 'text-gold-600'
              )} />
              <div>
                <p className={cn(
                  'text-xs font-bold',
                  session.noShowScore >= 67 ? 'text-red-700' : 'text-gold-700'
                )}>
                  Risco de no-show: {session.noShowScore >= 67 ? 'Alto' : 'Médio'}
                </p>
                <p className={cn(
                  'text-[10px] mt-0.5',
                  session.noShowScore >= 67 ? 'text-red-500' : 'text-gold-600'
                )}>
                  Score {session.noShowScore}/100 — considere confirmar por WhatsApp.
                </p>
              </div>
            </div>
          )}

          {/* Observações */}
          {session.observacoes && (
            <div className="bg-navy-50 border border-navy/10 rounded-2xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Observações</p>
              <p className="text-sm text-navy/80 whitespace-pre-wrap leading-relaxed">{session.observacoes}</p>
            </div>
          )}

          {/* Ações de status */}
          {!finalizado && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Ações</p>
              <div className="flex flex-wrap gap-2">
                {TRANSITIONS.filter(t => t.status !== session.status).map(t => {
                  const Icon = t.icon
                  return (
                    <button
                      key={t.status}
                      className={cn(ACTION_STYLES[t.status])}
                      disabled={saving}
                      onClick={() => changeStatus(t.status)}
                    >
                      {saving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1" />
                      ) : (
                        <Icon className="w-3.5 h-3.5 inline mr-1" />
                      )}
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Ações secundárias */}
          <div className="flex gap-2 pt-2 border-t border-navy/10">
            {!finalizado && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-gold/30 text-gold-600 hover:bg-gold-50 rounded-xl font-bold gap-2"
                onClick={() => { onOpenChange(false); onEdit(session) }}
                disabled={saving}
              >
                <Pencil className="w-3.5 h-3.5" />
                Editar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'font-bold gap-2 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50',
                finalizado ? 'w-full' : 'flex-1'
              )}
              onClick={deleteSession}
              disabled={saving}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Cancelar sessão
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
