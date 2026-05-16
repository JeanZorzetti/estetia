'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { TopPatient } from '@/lib/analytics-clinico/types'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

interface Props {
  data: TopPatient[]
}

export function TopPatientsList({ data }: Props) {
  if (!data.length) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-3"><CardTitle className="text-base">Top Pacientes por Receita</CardTitle></CardHeader>
        <CardContent><div className="py-8 text-center text-sm text-muted-foreground">Sem dados no período</div></CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Top 10 Pacientes por Receita</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {data.map((patient, i) => (
            <div key={patient.id} className="flex items-center gap-3 px-6 py-3 hover:bg-muted/30 transition-colors">
              <span className="w-6 text-xs font-bold text-muted-foreground tabular-nums">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{patient.nome}</p>
                <p className="text-xs text-muted-foreground">{patient.sessions} sessão(ões)</p>
              </div>
              <span className="text-sm font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                {formatBRL(patient.receita)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
