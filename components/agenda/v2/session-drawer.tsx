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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span>{session.treatment.paciente.nome}</span>
              <StatusBadge status={session.status} />
              <NoShowBadge score={session.noShowScore} />
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-5 mt-6">
          {/* Info grid */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="capitalize">{format(start, "EEEE, d 'de' MMMM yyyy", { locale: ptBR })}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="tabular-nums">
                {format(start, 'HH:mm')} · {session.duracaoMinutos ?? 60} min
              </span>
            </div>
            {session.profissional && (
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>{session.profissional.nome}</span>
              </div>
            )}
            {session.sala && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="flex items-center gap-2">
                  {session.sala.cor && (
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: session.sala.cor }} />
                  )}
                  {session.sala.nome}
                </span>
              </div>
            )}
          </div>

          {session.treatment.procedure && (
            <>
              <Separator />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Procedimento</p>
                <p className="text-sm font-medium">{session.treatment.procedure.nome}</p>
              </div>
            </>
          )}

          {session.observacoes && (
            <>
              <Separator />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Observações</p>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{session.observacoes}</p>
              </div>
            </>
          )}

          {!finalizado && (
            <>
              <Separator />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Ações</p>
                <div className="flex flex-wrap gap-2">
                  {TRANSITIONS.filter(t => t.status !== session.status).map(t => {
                    const Icon = t.icon
                    return (
                      <Button
                        key={t.status}
                        size="sm"
                        variant={t.variant}
                        disabled={saving}
                        onClick={() => changeStatus(t.status)}
                      >
                        {saving ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Icon className="w-3.5 h-3.5 mr-1.5" />}
                        {t.label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          <Separator />
          <Button variant="ghost" size="sm" className="text-destructive justify-start" onClick={deleteSession} disabled={saving}>
            <Trash2 className="w-3.5 h-3.5 mr-2" />
            Cancelar sessão
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
