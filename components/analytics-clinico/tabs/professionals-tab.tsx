'use client'

import { KpiGrid } from '../kpi-grid'
import { ProfessionalsProductivityChart } from '../charts/professionals-productivity-chart'
import { Users, DollarSign, Calendar, Percent } from 'lucide-react'
import type { ProfessionalProductivity } from '@/lib/analytics-clinico/types'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)

interface Props {
  data: ProfessionalProductivity[]
}

export function ProfessionalsTab({ data }: Props) {
  const totalSessoes = data.reduce((s, p) => s + p.sessoes, 0)
  const totalReceita = data.reduce((s, p) => s + p.receita, 0)
  const avgOcupacao = data.length > 0 ? data.reduce((s, p) => s + p.ocupacaoPct, 0) / data.length : 0
  const topProfissional = data[0]?.nome ?? '—'

  const kpiItems = [
    {
      label: 'Profissionais ativos',
      value: String(data.length),
      icon: Users,
      colorClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    },
    {
      label: 'Total de sessões',
      value: String(totalSessoes),
      icon: Calendar,
      colorClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
    },
    {
      label: 'Receita total',
      value: formatBRL(totalReceita),
      icon: DollarSign,
      colorClass: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
    },
    {
      label: 'Ocupação média',
      value: `${avgOcupacao.toFixed(0)}%`,
      icon: Percent,
      colorClass: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
    },
  ]

  return (
    <div className="space-y-6">
      <KpiGrid items={kpiItems} />
      <ProfessionalsProductivityChart data={data} />

      {data.length > 0 && (
        <div className="rounded-lg border border-border/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Profissional</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Sessões</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Receita</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ocupação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {data.map((p) => (
                <tr key={p.nome} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{p.nome}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{p.sessoes}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-emerald-600 dark:text-emerald-400">{formatBRL(p.receita)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{p.ocupacaoPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
