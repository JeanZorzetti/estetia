import { Card, CardContent } from '@/components/ui/card'
import { UserCheck, BadgeCheck, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  total: number
  comConselho: number
  comFoto: number
}

function KpiCard({
  label, value, icon: Icon, colorClass,
}: { label: string; value: number; icon: React.ElementType; colorClass: string }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{label}</p>
            <p className="text-2xl font-bold tracking-tight tabular-nums">{value}</p>
          </div>
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', colorClass)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProfessionalsKpis({ total, comConselho, comFoto }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KpiCard
        label="Profissionais ativos"
        value={total}
        icon={UserCheck}
        colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
      />
      <KpiCard
        label="Com conselho registrado"
        value={comConselho}
        icon={BadgeCheck}
        colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
      />
      <KpiCard
        label="Com foto cadastrada"
        value={comFoto}
        icon={ImageIcon}
        colorClass="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300"
      />
    </div>
  )
}
