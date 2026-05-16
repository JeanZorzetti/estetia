'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { ProcedurePoint } from '@/lib/analytics-clinico/types'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)

interface Props {
  data: ProcedurePoint[]
}

export function TopProceduresChart({ data }: Props) {
  if (!data.length) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-3"><CardTitle className="text-base">Top Procedimentos</CardTitle></CardHeader>
        <CardContent><div className="h-72 flex items-center justify-center text-sm text-muted-foreground">Sem dados no período</div></CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Top Procedimentos por Receita</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
              <XAxis type="number" tickFormatter={formatBRL} tick={{ fontSize: 10 }} className="text-muted-foreground" />
              <YAxis dataKey="nome" type="category" tick={{ fontSize: 10 }} width={100} className="text-muted-foreground" />
              <Tooltip
                formatter={((value: number) => formatBRL(value)) as any}
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13 }}
              />
              <Bar dataKey="receita" name="Receita" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
