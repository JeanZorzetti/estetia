import { cn } from '@/lib/utils'

const TYPE_LABELS: Record<string, string> = {
  CONSULTA: 'Consulta',
  PROCEDIMENTO: 'Procedimento',
  LASER: 'Laser',
  PEELING: 'Peeling',
  RECUPERACAO: 'Recuperação',
}

const TYPE_COLORS: Record<string, string> = {
  CONSULTA: 'bg-cyan-50/70 text-cyan-700 border-cyan-500/25 dark:bg-cyan-950/30 dark:text-cyan-300 dark:border-cyan-500/20',
  PROCEDIMENTO: 'bg-violet-50/70 text-violet-700 border-violet-500/25 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-500/20',
  LASER: 'bg-red-50/70 text-red-700 border-red-500/25 dark:bg-red-950/30 dark:text-red-300 dark:border-red-500/20',
  PEELING: 'bg-amber-50/70 text-amber-700 border-amber-500/25 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-500/20',
  RECUPERACAO: 'bg-emerald-50/70 text-emerald-700 border-emerald-500/25 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-500/20',
}

export function RoomTypeBadge({ tipo }: { tipo: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
      TYPE_COLORS[tipo] ?? 'bg-muted text-muted-foreground border-border',
    )}>
      {TYPE_LABELS[tipo] ?? tipo}
    </span>
  )
}
