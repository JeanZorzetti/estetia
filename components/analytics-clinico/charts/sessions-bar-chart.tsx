'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { SessionsStatPoint } from '@/lib/analytics-clinico/types'

interface Props {
  data: SessionsStatPoint[]
}

export function SessionsBarChart({ data }: Props) {
  if (!data.length) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-3"><CardTitle className="text-base">Sessões por Mês</CardTitle></CardHeader>
        <CardContent><div className="h-72 flex items-center justify-center text-sm text-muted-foreground">Sem dados no período</div></CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Sessões por Mês</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="agendadas" name="Agendadas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="realizadas" name="Realizadas" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="noShow" name="No-Show" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
