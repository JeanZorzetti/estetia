import { cn } from '@/lib/utils'

const TIPO_LABELS: Record<string, string> = {
  CONVENIO: 'Convênio',
  PARTICULAR: 'Particular',
  CORTESIA: 'Cortesia',
}

const TIPO_COLORS: Record<string, string> = {
  CONVENIO: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  PARTICULAR: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  CORTESIA: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
}

export function TipoBadge({ tipo }: { tipo: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      TIPO_COLORS[tipo] ?? TIPO_COLORS.CONVENIO,
    )}>
      {TIPO_LABELS[tipo] ?? tipo}
    </span>
  )
}
