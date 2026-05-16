'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { RevenueMonthlyPoint } from '@/lib/analytics-clinico/types'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)

interface Props {
  data: RevenueMonthlyPoint[]
}

export function RevenueMonthlyChart({ data }: Props) {
  if (!data.length) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-3"><CardTitle className="text-base">Receita Mensal (12m)</CardTitle></CardHeader>
        <CardContent><div className="h-72 flex items-center justify-center text-sm text-muted-foreground">Sem dados no período</div></CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Receita Mensal (12m)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis tickFormatter={formatBRL} tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <Tooltip
                formatter={((value: number) => formatBRL(value)) as any}
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="recebido" name="Recebido" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="particular" name="Particular" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="glosado" name="Glosado" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
