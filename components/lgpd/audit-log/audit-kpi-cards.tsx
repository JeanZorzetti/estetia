import { Card, CardContent } from '@/components/ui/card'
import { Eye, Download, UserX, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  total: number
  exports: number
  anons: number
  topUserName: string
}

function KpiCard({
  label, value, icon: Icon, colorClass,
}: { label: string; value: string | number; icon: React.ElementType; colorClass: string }) {
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

export function AuditKpiCards({ total, exports, anons, topUserName }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Acessos (30d)"
        value={total.toLocaleString('pt-BR')}
        icon={Eye}
        colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
      />
      <KpiCard
        label="Exportações (30d)"
        value={exports}
        icon={Download}
        colorClass="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300"
      />
      <KpiCard
        label="Anonimizações (30d)"
        value={anons}
        icon={UserX}
        colorClass="bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
      />
      <KpiCard
        label="Top usuário"
        value={topUserName}
        icon={User}
        colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
      />
    </div>
  )
}
