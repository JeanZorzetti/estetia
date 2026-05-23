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
  label,
  value,
  icon: Icon,
  colorClass,
  gradientClass,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  colorClass: string
  gradientClass: string
}) {
  return (
    <Card className={cn(
      "border-border/60 relative overflow-hidden group",
      "bg-gradient-to-br from-card to-background/50",
      "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20",
      "transition-all duration-300 ease-out"
    )}>
      {/* Decorative radial gradient background glow on hover */}
      <div className={cn(
        "absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
        gradientClass
      )} />

      {/* Watermark Icon */}
      <Icon className="absolute -right-3 -bottom-3 w-20 h-20 opacity-[0.03] dark:opacity-[0.05] rotate-12 transition-transform duration-500 ease-out group-hover:rotate-6 group-hover:scale-110 pointer-events-none" />

      <CardContent className="p-5 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
            <p className="text-3xl font-extrabold tracking-tight tabular-nums text-foreground truncate">{value}</p>
          </div>
          <div className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-300 ease-out group-hover:scale-110',
            colorClass
          )}>
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
        colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/10"
        gradientClass="bg-emerald-500/10"
      />
      <KpiCard
        label="Tipo predominante"
        value={tipoMaisComum}
        icon={Sparkles}
        colorClass="bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 border border-violet-500/10"
        gradientClass="bg-violet-500/10"
      />
      <KpiCard
        label="Com equipamentos"
        value={comEquipamentos}
        icon={Wrench}
        colorClass="bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-500/10"
        gradientClass="bg-blue-500/10"
      />
      <KpiCard
        label="Com horário definido"
        value={comHorario}
        icon={Clock}
        colorClass="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-500/10"
        gradientClass="bg-amber-500/10"
      />
    </div>
  )
}
