import { cn } from '@/lib/utils'
import { treatmentStatusBadge, TREATMENT_STATUS_LABELS } from '@/lib/clinical/status-labels'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function TreatmentStatusBadge({ status, className }: StatusBadgeProps) {
  const knownStatus = status as Parameters<typeof treatmentStatusBadge>[0]['status']
  return (
    <span className={cn(treatmentStatusBadge({ status: knownStatus }), className)}>
      {TREATMENT_STATUS_LABELS[status] ?? status}
    </span>
  )
}

interface SessionBadgeProps {
  status: 'REALIZADA' | 'NO_SHOW' | 'AGENDADA' | 'CONFIRMADA' | 'CANCELADA' | string
  label: string
  className?: string
}

export function SessionStatusBadge({ status, label, className }: SessionBadgeProps) {
  const colorMap: Record<string, string> = {
    REALIZADA: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    NO_SHOW: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400',
    AGENDADA: 'bg-zinc-500/10 border-zinc-500/20 text-zinc-600 dark:text-zinc-400',
    CONFIRMADA: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
    CANCELADA: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400',
  }
  return (
    <span className={cn('text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm border select-none leading-tight', colorMap[status] ?? 'bg-zinc-500/10 border-zinc-500/20 text-zinc-600 dark:text-zinc-400', className)}>
      {label}
    </span>
  )
}
