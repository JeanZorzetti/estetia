import { cn } from '@/lib/utils'

const STATUS_LABELS: Record<string, string> = {
  RASCUNHO: 'Rascunho',
  ENVIADA: 'Enviada',
  AUTORIZADA: 'Autorizada',
  NEGADA: 'Negada',
  GLOSADA: 'Glosada',
  PAGA: 'Paga',
  CANCELADA: 'Cancelada',
}

const STATUS_COLORS: Record<string, string> = {
  RASCUNHO: 'bg-muted text-muted-foreground',
  ENVIADA: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  AUTORIZADA: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  NEGADA: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  GLOSADA: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  PAGA: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  CANCELADA: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      STATUS_COLORS[status] ?? STATUS_COLORS.RASCUNHO,
    )}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
