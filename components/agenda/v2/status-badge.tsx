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
  AGENDADA: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  CONFIRMADA: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  REALIZADA: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  NO_SHOW: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  REMARCADA: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  CANCELADA: 'bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/20',
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center border font-bold text-[9px] px-2 py-0.5 rounded-full tracking-wide uppercase leading-none shadow-sm',
      STATUS_COLORS[status] ?? STATUS_COLORS.AGENDADA,
      className
    )}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
