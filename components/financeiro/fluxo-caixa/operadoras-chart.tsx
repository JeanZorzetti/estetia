'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  operadora: string
  tipo: string
  total: number
  guias: number
  ticketMedio: number
}

interface Props {
  data: DataPoint[]
}

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)

export function OperadorasChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Volume por Operadora</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">Nenhum dado disponível.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Volume por Operadora</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
              <XAxis type="number" tickFormatter={formatBRL} tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis type="category" dataKey="operadora" tick={{ fontSize: 12 }} width={80} className="text-muted-foreground" />
              <Tooltip
                formatter={((value: number, name: string) => name === 'total' ? formatBRL(value) : value) as any}
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13 }}
              />
              <Bar dataKey="total" name="Total" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50 grid gap-2">
          {data.slice(0, 5).map(d => (
            <div key={d.operadora} className="flex items-center justify-between text-sm">
              <span className="font-medium truncate">{d.operadora}</span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
                <span>{d.guias} guia{d.guias !== 1 ? 's' : ''}</span>
                <span>Tkt {formatBRL(d.ticketMedio)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
