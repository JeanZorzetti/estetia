'use client'

import { KpiGrid } from '../kpi-grid'
import { PatientsAcquisitionChart } from '../charts/patients-acquisition-chart'
import { PatientsOrigemChart } from '../charts/patients-origem-chart'
import { DemographicsChart } from '../charts/demographics-chart'
import { TopPatientsList } from '../lists/top-patients-list'
import { Users, UserCheck, MapPin, Heart } from 'lucide-react'
import type { AcquisitionPoint, OrigemPoint, DemographicsData, TopPatient } from '@/lib/analytics-clinico/types'

interface Props {
  acquisition: AcquisitionPoint[]
  origem: OrigemPoint[]
  demographics: DemographicsData
  topPatients: TopPatient[]
}

export function PatientsTab({ acquisition, origem, demographics, topPatients }: Props) {
  const totalPacientes = acquisition.reduce((s, a) => s + a.count, 0)
  const lastMonth = acquisition[acquisition.length - 1]?.count ?? 0
  const prevMonth = acquisition[acquisition.length - 2]?.count ?? null

  const kpiItems = [
    {
      label: 'Total (12m)',
      value: String(totalPacientes),
      icon: Users,
      colorClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
    },
    {
      label: 'Último mês',
      value: String(lastMonth),
      delta: prevMonth !== null ? { value: lastMonth, previousValue: prevMonth, deltaPct: prevMonth > 0 ? ((lastMonth - prevMonth) / prevMonth) * 100 : null } : undefined,
      icon: UserCheck,
      colorClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    },
    {
      label: 'Origens distintas',
      value: String(origem.length),
      icon: MapPin,
      colorClass: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
    },
    {
      label: 'Top origem',
      value: origem[0]?.origem ?? '—',
      icon: Heart,
      colorClass: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300',
    },
  ]

  return (
    <div className="space-y-6">
      <KpiGrid items={kpiItems} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatientsAcquisitionChart data={acquisition} />
        <PatientsOrigemChart data={origem} />
      </div>
      <DemographicsChart data={demographics} />
      <TopPatientsList data={topPatients} />
    </div>
  )
}
