'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  dia: string
  VIEW: number
  CREATE: number
  UPDATE: number
  EXPORT: number
  DELETE: number
  ANONYMIZE: number
}

interface Props {
  data: DataPoint[]
}

export function AuditLineChart({ data }: Props) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Acessos por Dia (30 dias)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
              <XAxis dataKey="dia" tick={{ fontSize: 11 }} interval={4} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="VIEW" name="Visualização" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="CREATE" name="Criação" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="UPDATE" name="Edição" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="EXPORT" name="Exportação" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="DELETE" name="Exclusão" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="ANONYMIZE" name="Anonim." stroke="#71717a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
