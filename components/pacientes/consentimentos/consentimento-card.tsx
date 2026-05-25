import { Card, CardContent } from '@/components/ui/card'
import { Shield, ShieldOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CONSENT_LABELS } from '@/lib/clinical/status-labels'
import type { ConsentLogEntry } from '@/lib/clinical/types'

interface Props {
  consent: ConsentLogEntry
}

export function ConsentimentoCard({ consent: c }: Props) {
  const revoked = !!c.revokedAt

  return (
    <Card className="overflow-hidden border-border/40 bg-card/45 backdrop-blur-sm transition-all duration-300 hover:border-teal-500/25 hover:shadow-sm rounded-2xl group relative pl-3">
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b rounded-l-2xl ${revoked ? 'from-red-500 to-red-600' : 'from-navy to-teal'}`} />

      <CardContent className="p-5 flex items-center justify-between text-xs font-semibold gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${revoked ? 'bg-red-500/10 border-red-500/20' : 'bg-teal-500/10 border-teal-500/20'}`}>
            {revoked
              ? <ShieldOff className="w-4 h-4 text-red-500" />
              : <Shield className="w-4 h-4 text-teal-500" />
            }
          </div>
          <div className="space-y-0.5 min-w-0">
            <p className="font-extrabold text-sm text-foreground/90 leading-tight break-words">
              {CONSENT_LABELS[c.tipo] ?? c.tipo}
            </p>
            <p className="text-[10px] text-muted-foreground font-semibold leading-normal">
              Aceito em: {new Date(c.aceitoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              {revoked && ` · Revogado em: ${new Date(c.revokedAt!).toLocaleDateString('pt-BR')}`}
            </p>
          </div>
        </div>

        {revoked ? (
          <Badge className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-sm select-none leading-tight">
            Revogado
          </Badge>
        ) : (
          <Badge className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1.5 rounded-full shrink-0 shadow-sm flex items-center gap-1.5 select-none leading-tight">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            Concedido
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
