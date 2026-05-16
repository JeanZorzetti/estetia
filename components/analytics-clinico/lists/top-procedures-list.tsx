'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ProcedurePoint } from '@/lib/analytics-clinico/types'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

interface Props {
  data: ProcedurePoint[]
}

export function TopProceduresList({ data }: Props) {
  if (!data.length) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-3"><CardTitle className="text-base">Procedimentos</CardTitle></CardHeader>
        <CardContent><div className="py-8 text-center text-sm text-muted-foreground">Sem dados no período</div></CardContent>
      </Card>
    )
  }

  const maxReceita = Math.max(...data.map(d => d.receita), 1)

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Procedimentos por Receita</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((proc) => (
            <div key={proc.nome}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium truncate pr-4">{proc.nome}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-muted-foreground">{proc.count}x</span>
                  <span className="text-sm font-semibold tabular-nums">{formatBRL(proc.receita)}</span>
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(proc.receita / maxReceita) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
