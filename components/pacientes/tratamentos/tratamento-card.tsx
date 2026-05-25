import { Card, CardContent } from '@/components/ui/card'
import { Clock, Calendar } from 'lucide-react'
import { TreatmentStatusBadge, SessionStatusBadge } from '@/components/pacientes/shared/status-badge'
import { SESSION_STATUS_LABELS } from '@/lib/clinical/status-labels'
import type { TreatmentEntry } from '@/lib/clinical/types'

interface Props {
  treatment: TreatmentEntry
}

export function TratamentoCard({ treatment: t }: Props) {
  const percent = t.sessoesPrevistas > 0
    ? Math.min(100, Math.round((t.sessoesRealizadas / t.sessoesPrevistas) * 100))
    : 0

  return (
    <Card className="overflow-hidden border-border/40 bg-card/45 backdrop-blur-sm transition-all duration-300 hover:border-gold-500/25 hover:shadow-md rounded-2xl group relative pl-3">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold to-gold-600 rounded-l-2xl" />

      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span className="font-extrabold text-sm text-foreground/90 leading-tight">
            {t.descricaoCustomizada ?? t.tipoTratamento}
          </span>
          <TreatmentStatusBadge status={t.status} />
        </div>

        <div className="flex items-center gap-3 text-[10px] md:text-xs text-muted-foreground font-semibold flex-wrap">
          <span className="flex items-center gap-1.5 bg-muted/60 dark:bg-zinc-900/60 border border-border/15 px-2.5 py-1 rounded-lg leading-tight">
            <Clock className="h-3.5 w-3.5 text-gold shrink-0" />
            Sessões: {t.sessoesRealizadas}/{t.sessoesPrevistas} realizadas
          </span>
          <span className="flex items-center gap-1.5 bg-muted/60 dark:bg-zinc-900/60 border border-border/15 px-2.5 py-1 rounded-lg leading-tight">
            <Calendar className="h-3.5 w-3.5 text-gold shrink-0" />
            Início: {new Date(t.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[10px] md:text-xs text-muted-foreground font-bold">
            <span>Progresso do Tratamento</span>
            <span className="font-extrabold text-foreground">{percent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted/50 dark:bg-zinc-800/40 overflow-hidden border border-border/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-navy to-gold shadow-sm shadow-gold-500/20 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {t.sessions.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-border/10">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">Histórico de Sessões Recentes</p>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {t.sessions.map(s => (
                <SessionStatusBadge
                  key={s.id}
                  status={s.status}
                  label={`${new Date(s.dataAgendada).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} · ${SESSION_STATUS_LABELS[s.status] ?? s.status}`}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
