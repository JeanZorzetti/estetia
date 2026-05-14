'use client'

import { cn } from '@/lib/utils'

const STATUS_LABELS: Record<string, string> = {
  PENDENTE: 'Pendente',
  CONVERTIDO: 'Convertido',
  RECOMPENSADO: 'Recompensado',
  CANCELADO: 'Cancelado',
}

const STATUS_COLORS: Record<string, string> = {
  PENDENTE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  CONVERTIDO: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  RECOMPENSADO: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  CANCELADO: 'bg-muted text-muted-foreground',
}

export function ReferralStatusBadge({ status }: { status: string }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[status] ?? STATUS_COLORS.PENDENTE)}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
