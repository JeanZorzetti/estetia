'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { ProfessionalProductivity } from '@/lib/analytics-clinico/types'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)

interface Props {
  data: ProfessionalProductivity[]
}

export function ProfessionalsProductivityChart({ data }: Props) {
  if (!data.length) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-3"><CardTitle className="text-base">Produtividade por Profissional</CardTitle></CardHeader>
        <CardContent><div className="h-80 flex items-center justify-center text-sm text-muted-foreground">Sem dados no período</div></CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Produtividade por Profissional</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
              <XAxis dataKey="nome" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis yAxisId="left" tickFormatter={formatBRL} tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <Tooltip
                formatter={((value: number, name: string) => name === 'Receita' ? formatBRL(value) : value) as any}
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar yAxisId="left" dataKey="receita" name="Receita" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="sessoes" name="Sessões" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
