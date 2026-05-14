'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Smile, PersonStanding, Scissors } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPIs {
  totalAtivos: number
  faciais: number
  corporais: number
  capilares: number
  outros: number
}

function KpiCard({
  label, value, icon: Icon, colorClass,
}: {
  label: string
  value: number
  icon: React.ElementType
  colorClass: string
}) {
  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          </div>
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', colorClass)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProceduresKpis({ kpis }: { kpis: KPIs }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Total ativos"
        value={kpis.totalAtivos}
        icon={Sparkles}
        colorClass="bg-primary/10 text-primary"
      />
      <KpiCard
        label="Faciais"
        value={kpis.faciais}
        icon={Smile}
        colorClass="bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300"
      />
      <KpiCard
        label="Corporais"
        value={kpis.corporais}
        icon={PersonStanding}
        colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
      />
      <KpiCard
        label="Capilares / Outros"
        value={kpis.capilares + kpis.outros}
        icon={Scissors}
        colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
      />
    </div>
  )
}
