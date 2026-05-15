import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

interface Anomalia {
  paciente: { id: string; nome: string } | null
  count: number
}

export function AnomaliesCard({ anomalias }: { anomalias: Anomalia[] }) {
  if (anomalias.length === 0) {
    return (
      <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-900">
        <CardHeader className="pb-3 flex flex-row items-center gap-2 space-y-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <CardTitle className="text-base text-emerald-900 dark:text-emerald-100">Nenhuma anomalia detectada</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            Padrão de acesso a dados sensíveis está dentro do esperado nos últimos 7 dias.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900">
      <CardHeader className="pb-3 flex flex-row items-center gap-2 space-y-0">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <CardTitle className="text-base text-amber-900 dark:text-amber-100">
          Anomalias detectadas ({anomalias.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
          Pacientes acessados mais de 50 vezes nos últimos 7 dias. Revise se há justificativa clínica.
        </p>
        <div className="flex flex-col gap-2">
          {anomalias.map((a, i) => (
            <div key={a.paciente?.id ?? i} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white/50 dark:bg-amber-900/20">
              {a.paciente ? (
                <Link
                  href={`/dashboard/lgpd/audit-log/paciente/${a.paciente.id}`}
                  className="text-sm font-medium text-amber-900 dark:text-amber-100 hover:underline truncate"
                >
                  {a.paciente.nome}
                </Link>
              ) : (
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">—</p>
              )}
              <span className="text-sm tabular-nums font-bold text-amber-700 dark:text-amber-300 flex-shrink-0">
                {a.count} acessos
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
