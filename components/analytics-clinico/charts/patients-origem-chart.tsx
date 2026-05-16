'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { OrigemPoint } from '@/lib/analytics-clinico/types'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899']

const ORIGEM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  indicacao: 'Indicação',
  google: 'Google',
  walk_in: 'Walk-in',
  outros: 'Outros',
}

interface Props {
  data: OrigemPoint[]
}

export function PatientsOrigemChart({ data }: Props) {
  if (!data.length) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-3"><CardTitle className="text-base">Origem dos Pacientes</CardTitle></CardHeader>
        <CardContent><div className="h-72 flex items-center justify-center text-sm text-muted-foreground">Sem dados no período</div></CardContent>
      </Card>
    )
  }

  const chartData = data.map(d => ({ ...d, origem: ORIGEM_LABELS[d.origem] ?? d.origem }))

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Origem dos Pacientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="origem"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
