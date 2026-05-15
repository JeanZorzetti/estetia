import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, Clock, AlertCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  recebidoMes: number
  aReceber: number
  vencidos: number
  glosado: number
}

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

function KpiCard({
  label, value, icon: Icon, colorClass,
}: { label: string; value: string; icon: React.ElementType; colorClass: string }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{label}</p>
            <p className="text-2xl font-bold tracking-tight tabular-nums truncate">{value}</p>
          </div>
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', colorClass)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function FluxoCaixaKpis({ recebidoMes, aReceber, vencidos, glosado }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Recebido (mês)"
        value={formatBRL(recebidoMes)}
        icon={TrendingUp}
        colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
      />
      <KpiCard
        label="A receber"
        value={formatBRL(aReceber)}
        icon={Clock}
        colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
      />
      <KpiCard
        label="Vencidos (60d+)"
        value={formatBRL(vencidos)}
        icon={AlertCircle}
        colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
      />
      <KpiCard
        label="Glosado (mês)"
        value={formatBRL(glosado)}
        icon={XCircle}
        colorClass="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300"
      />
    </div>
  )
}
