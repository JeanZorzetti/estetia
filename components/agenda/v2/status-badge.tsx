import { cn } from '@/lib/utils'

const STATUS_LABELS: Record<string, string> = {
  AGENDADA: 'Agendada',
  CONFIRMADA: 'Confirmada',
  REALIZADA: 'Realizada',
  NO_SHOW: 'No-show',
  REMARCADA: 'Remarcada',
  CANCELADA: 'Cancelada',
}

const STATUS_COLORS: Record<string, string> = {
  AGENDADA: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  CONFIRMADA: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  REALIZADA: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  NO_SHOW: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  REMARCADA: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  CANCELADA: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium',
      STATUS_COLORS[status] ?? STATUS_COLORS.AGENDADA,
      className,
    )}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
