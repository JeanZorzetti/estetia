'use client'

import { ComplianceKpis } from '@/lib/equipe-clinica/compliance'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CheckCircle2, AlertCircle, XCircle, HelpCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CfmValidateAllButton } from './cfm-validate-all-button'

interface Props {
  kpis: ComplianceKpis
  orgId: string
  canValidate: boolean
}

interface KpiCardProps {
  icon: React.ReactNode
  label: string
  value: number
  total: number
  colorClass: string
  bgClass: string
}

function KpiCard({ icon, label, value, total, colorClass, bgClass }: KpiCardProps) {
  return (
    <div className={cn('flex flex-col gap-1 rounded-xl border border-border/50 p-4', bgClass)}>
      <div className={cn('flex items-center gap-1.5 text-xs font-medium', colorClass)}>
        {icon}
        {label}
      </div>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">de {total} profissionais</p>
    </div>
  )
}

export function ComplianceKpisCard({ kpis, orgId, canValidate }: Props) {
  const ultimaStr = kpis.ultimaValidacao
    ? formatDistanceToNow(new Date(kpis.ultimaValidacao), { addSuffix: true, locale: ptBR })
    : 'Nunca validado'

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Compliance CFM</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <RefreshCw className="h-3 w-3" />
            Última validação: {ultimaStr}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {kpis.taxaOk}%
            </p>
            <p className="text-xs text-muted-foreground">taxa OK</p>
          </div>
          {canValidate && <CfmValidateAllButton orgId={orgId} />}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          label="Ativos"
          value={kpis.ativos}
          total={kpis.total}
          colorClass="text-emerald-600 dark:text-emerald-400"
          bgClass="dark:bg-emerald-950/20"
        />
        <KpiCard
          icon={<AlertCircle className="h-3.5 w-3.5" />}
          label="Pendentes"
          value={kpis.pendentes}
          total={kpis.total}
          colorClass="text-amber-600 dark:text-amber-400"
          bgClass="dark:bg-amber-950/20"
        />
        <KpiCard
          icon={<XCircle className="h-3.5 w-3.5" />}
          label="Inativos"
          value={kpis.inativos}
          total={kpis.total}
          colorClass="text-red-600 dark:text-red-400"
          bgClass="dark:bg-red-950/20"
        />
        <KpiCard
          icon={<HelpCircle className="h-3.5 w-3.5" />}
          label="Sem CFM"
          value={kpis.semCfm}
          total={kpis.total}
          colorClass="text-zinc-500"
          bgClass=""
        />
      </div>
    </div>
  )
}
