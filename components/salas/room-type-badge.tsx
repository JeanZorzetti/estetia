import { cn } from '@/lib/utils'

const TYPE_LABELS: Record<string, string> = {
  CONSULTA: 'Consulta',
  PROCEDIMENTO: 'Procedimento',
  LASER: 'Laser',
  PEELING: 'Peeling',
  RECUPERACAO: 'Recuperação',
}

const TYPE_COLORS: Record<string, string> = {
  CONSULTA: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  PROCEDIMENTO: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  LASER: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  PEELING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  RECUPERACAO: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
}

export function RoomTypeBadge({ tipo }: { tipo: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      TYPE_COLORS[tipo] ?? 'bg-muted text-muted-foreground',
    )}>
      {TYPE_LABELS[tipo] ?? tipo}
    </span>
  )
}
