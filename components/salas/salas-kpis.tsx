import { Card, CardContent } from '@/components/ui/card'
import { DoorOpen, Wrench, Clock, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  total: number
  comEquipamentos: number
  comHorario: number
  tipoMaisComum: string
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

export function SalasKpis({ total, comEquipamentos, comHorario, tipoMaisComum }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Salas ativas"
        value={total}
        icon={DoorOpen}
        colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
      />
      <KpiCard
        label="Tipo predominante"
        value={tipoMaisComum}
        icon={Sparkles}
        colorClass="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300"
      />
      <KpiCard
        label="Com equipamentos"
        value={comEquipamentos}
        icon={Wrench}
        colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
      />
      <KpiCard
        label="Com horário definido"
        value={comHorario}
        icon={Clock}
        colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
      />
    </div>
  )
}
