'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from './status-badge'
import { NoShowBadge } from './no-show-badge'
import {
  CheckCircle2, Calendar, Clock, MapPin, User,
  XCircle, AlertOctagon, RotateCcw, Trash2, Loader2,
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
}

const TRANSITIONS: { label: string; status: string; icon: React.ElementType; variant: 'default' | 'outline' | 'destructive' }[] = [
  { label: 'Confirmar', status: 'CONFIRMADA', icon: CheckCircle2, variant: 'default' },
  { label: 'Realizar', status: 'REALIZADA', icon: CheckCircle2, variant: 'outline' },
  { label: 'No-show', status: 'NO_SHOW', icon: AlertOctagon, variant: 'outline' },
  { label: 'Remarcar', status: 'REMARCADA', icon: RotateCcw, variant: 'outline' },
  { label: 'Cancelar', status: 'CANCELADA', icon: XCircle, variant: 'destructive' },
]

export function SessionDrawer({ session, open, onOpenChange, onUpdated, onDeleted }: Props) {
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

  const ACTION_STYLES: Record<string, string> = {
    CONFIRMADA: 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 rounded-xl px-3.5 py-1.5 border-0 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0',
    REALIZADA: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl px-3.5 py-1.5 font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0',
    NO_SHOW: 'bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white rounded-xl px-3.5 py-1.5 font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0',
    REMARCADA: 'bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl px-3.5 py-1.5 font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0',
    CANCELADA: 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white rounded-xl px-3.5 py-1.5 font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0',
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto bg-card/95 backdrop-blur-md border-l border-border/40 shadow-2xl p-6">

        {/* Ambient mesh glow decoration at the top right */}
        <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-gradient-to-bl from-indigo-500/[0.04] via-transparent to-transparent rounded-full blur-3xl pointer-events-none z-0" />

        <SheetHeader className="relative z-10">
          <SheetTitle className="text-left">
            <div className="flex flex-col gap-2">
              <span className="text-xl font-extrabold tracking-tight text-foreground bg-clip-text">
                {session.treatment.paciente.nome}
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <StatusBadge status={session.status} />
                <NoShowBadge score={session.noShowScore} />
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-5 mt-6 relative z-10">
          {/* Unified scheduling capsule grid */}
          <div className="relative z-10 bg-muted/10 border border-border/10 rounded-2xl p-4.5 space-y-3.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 text-xs font-semibold text-foreground/80">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="capitalize">{format(start, "EEEE, d 'de' MMMM yyyy", { locale: ptBR })}</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-foreground/80">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="tabular-nums">
                {format(start, 'HH:mm')} · {session.duracaoMinutos ?? 60} min
              </span>
            </div>

            {session.profissional && (
              <div className="flex items-center gap-3 text-xs font-semibold text-foreground/80">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>{session.profissional.nome}</span>
              </div>
            )}

            {session.sala && (
              <div className="flex items-center gap-3 text-xs font-semibold text-foreground/80">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="flex items-center gap-2">
                  {session.sala.cor && (
                    /* 3D Glossy room color orb with dynamic drop shadow glow */
                    <span 
                      className="relative flex h-3.5 w-3.5 shrink-0 rounded-full bg-gradient-to-tr from-black/20 via-transparent to-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)]" 
                      style={{ 
                        backgroundColor: session.sala.cor,
                        filter: `drop-shadow(0 2px 4px ${session.sala.cor}50)`
                      }} 
                    />
                  )}
                  {session.sala.nome}
                </span>
              </div>
            )}
          </div>

          {session.treatment.procedure && (
            <div className="bg-muted/10 border border-border/10 rounded-2xl p-4.5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 mb-1.5">Procedimento</p>
              <p className="text-xs font-bold text-foreground">{session.treatment.procedure.nome}</p>
            </div>
          )}

          {session.observacoes && (
            <div className="bg-muted/10 border border-border/10 rounded-2xl p-4.5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 mb-1.5">Observações</p>
              <p className="text-xs font-semibold text-foreground/90 whitespace-pre-wrap leading-relaxed">{session.observacoes}</p>
            </div>
          )}

          {!finalizado && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 mb-1">Ações</p>
              <div className="flex flex-wrap gap-2">
                {TRANSITIONS.filter(t => t.status !== session.status).map(t => {
                  const Icon = t.icon
                  const customClass = ACTION_STYLES[t.status] ?? ''
                  return (
                    <Button
                      key={t.status}
                      size="sm"
                      className={cn('text-xs gap-1.5', customClass)}
                      disabled={saving}
                      onClick={() => changeStatus(t.status)}
                    >
                      {saving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                      )}
                      {t.label}
                    </Button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-border/10">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:text-red-600 hover:bg-red-500/5 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold justify-start w-full gap-2 relative z-10" 
              onClick={deleteSession} 
              disabled={saving}
            >
              <Trash2 className="w-4 h-4 shrink-0" />
              Cancelar sessão
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
