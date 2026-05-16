'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { TreatmentFunnelPoint } from '@/lib/analytics-clinico/types'

const STATUS_LABELS: Record<string, string> = {
  AVALIACAO: 'Avaliação',
  ORCAMENTO_ENVIADO: 'Orçamento',
  AGENDADO: 'Agendado',
  EM_ANDAMENTO: 'Em andamento',
  FINALIZADO: 'Finalizado',
  RETORNO: 'Retorno',
  CANCELADO: 'Cancelado',
}

interface Props {
  data: TreatmentFunnelPoint[]
}

export function TreatmentFunnelChart({ data }: Props) {
  if (!data.length) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-3"><CardTitle className="text-base">Funil de Tratamentos</CardTitle></CardHeader>
        <CardContent><div className="h-72 flex items-center justify-center text-sm text-muted-foreground">Sem dados no período</div></CardContent>
      </Card>
    )
  }

  const chartData = data.map(d => ({ ...d, status: STATUS_LABELS[d.status] ?? d.status }))

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Funil de Tratamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis dataKey="status" type="category" tick={{ fontSize: 11 }} width={80} className="text-muted-foreground" />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13 }}
              />
              <Bar dataKey="count" name="Quantidade" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
