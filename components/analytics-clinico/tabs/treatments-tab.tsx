'use client'

import { KpiGrid } from '../kpi-grid'
import { TreatmentFunnelChart } from '../charts/treatment-funnel-chart'
import { TopProceduresChart } from '../charts/top-procedures-chart'
import { CategoriaPieChart } from '../charts/categoria-pie-chart'
import { TopProceduresList } from '../lists/top-procedures-list'
import { Activity, CheckCircle, XCircle, LayoutList } from 'lucide-react'
import type { TreatmentFunnelPoint, ProcedurePoint } from '@/lib/analytics-clinico/types'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)

interface Props {
  funnel: TreatmentFunnelPoint[]
  procedures: ProcedurePoint[]
}

export function TreatmentsTab({ funnel, procedures }: Props) {
  const total = funnel.reduce((s, f) => s + f.count, 0)
  const finalizados = funnel.find(f => f.status === 'FINALIZADO')?.count ?? 0
  const cancelados = funnel.find(f => f.status === 'CANCELADO')?.count ?? 0
  const receitaTotal = funnel.reduce((s, f) => s + f.value, 0)

  const kpiItems = [
    {
      label: 'Total de tratamentos',
      value: String(total),
      icon: Activity,
      colorClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    },
    {
      label: 'Finalizados',
      value: String(finalizados),
      icon: CheckCircle,
      colorClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
    },
    {
      label: 'Cancelados',
      value: String(cancelados),
      icon: XCircle,
      colorClass: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300',
    },
    {
      label: 'Receita total',
      value: formatBRL(receitaTotal),
      icon: LayoutList,
      colorClass: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
    },
  ]

  return (
    <div className="space-y-6">
      <KpiGrid items={kpiItems} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TreatmentFunnelChart data={funnel} />
        <CategoriaPieChart data={procedures} title="Top Procedimentos (volume)" />
      </div>
      <TopProceduresChart data={procedures} />
      <TopProceduresList data={procedures} />
    </div>
  )
}
