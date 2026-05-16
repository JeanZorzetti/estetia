'use client'

import { KpiGrid } from '../kpi-grid'
import { SessionsBarChart } from '../charts/sessions-bar-chart'
import { TopPatientsList } from '../lists/top-patients-list'
import { RevenueMonthlyChart } from '../charts/revenue-monthly-chart'
import { Users, DollarSign, CalendarX, TrendingUp } from 'lucide-react'
import type { OverviewKpis, SessionsStatPoint, TopPatient, RevenueMonthlyPoint } from '@/lib/analytics-clinico/types'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)

interface Props {
  kpis: OverviewKpis
  sessions: SessionsStatPoint[]
  topPatients: TopPatient[]
  revenue: RevenueMonthlyPoint[]
}

export function OverviewTab({ kpis, sessions, topPatients, revenue }: Props) {
  const kpiItems = [
    {
      label: 'Novos Pacientes',
      value: String(kpis.pacientesAtivos.value),
      delta: kpis.pacientesAtivos,
      icon: Users,
      colorClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
    },
    {
      label: 'Receita Realizada',
      value: formatBRL(kpis.receitaRealizada.value),
      delta: kpis.receitaRealizada,
      icon: DollarSign,
      colorClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    },
    {
      label: 'Taxa No-Show',
      value: `${kpis.taxaNoShow.value.toFixed(1)}%`,
      delta: kpis.taxaNoShow,
      icon: CalendarX,
      colorClass: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300',
    },
    {
      label: 'Ticket Médio',
      value: formatBRL(kpis.ticketMedio.value),
      delta: kpis.ticketMedio,
      icon: TrendingUp,
      colorClass: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
    },
  ]

  return (
    <div className="space-y-6">
      <KpiGrid items={kpiItems} />
      <RevenueMonthlyChart data={revenue} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SessionsBarChart data={sessions} />
        <TopPatientsList data={topPatients} />
      </div>
    </div>
  )
}
