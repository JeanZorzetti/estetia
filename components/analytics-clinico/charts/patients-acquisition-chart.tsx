'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { AcquisitionPoint } from '@/lib/analytics-clinico/types'

interface Props {
  data: AcquisitionPoint[]
}

export function PatientsAcquisitionChart({ data }: Props) {
  if (!data.length) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-3"><CardTitle className="text-base">Novos Pacientes</CardTitle></CardHeader>
        <CardContent><div className="h-72 flex items-center justify-center text-sm text-muted-foreground">Sem dados no período</div></CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Novos Pacientes por Mês</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13 }}
              />
              <Line type="monotone" dataKey="count" name="Novos pacientes" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
