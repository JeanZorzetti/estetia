'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { DemographicsData } from '@/lib/analytics-clinico/types'

interface Props {
  data: DemographicsData
}

export function DemographicsChart({ data }: Props) {
  const hasSexo = data.sexo.length > 0
  const hasFaixa = data.faixaEtaria.length > 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Distribuição por Sexo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            {!hasSexo ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">Sem dados no período</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.sexo} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13 }}
                  />
                  <Bar dataKey="count" name="Pacientes" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Faixa Etária</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            {!hasFaixa ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">Sem dados no período</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.faixaEtaria} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 13 }}
                  />
                  <Bar dataKey="count" name="Pacientes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
