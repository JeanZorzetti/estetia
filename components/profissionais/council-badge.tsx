import { cn } from '@/lib/utils'

const COUNCIL_COLORS: Record<string, string> = {
  CRM: 'bg-blue-50/70 text-blue-700 border-blue-500/25 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-500/20',
  CRO: 'bg-emerald-50/70 text-emerald-700 border-emerald-500/25 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-500/20',
  CRBM: 'bg-teal-50/70 text-teal-700 border-teal-500/25 dark:bg-teal-950/30 dark:text-teal-300 dark:border-teal-500/20',
  CRF: 'bg-orange-50/70 text-orange-700 border-orange-500/25 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-500/20',
  COREN: 'bg-pink-50/70 text-pink-700 border-pink-500/25 dark:bg-pink-950/30 dark:text-pink-300 dark:border-pink-500/20',
  CFBM: 'bg-purple-50/70 text-purple-700 border-purple-500/25 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-500/20',
  CREFITO: 'bg-violet-50/70 text-violet-700 border-violet-500/25 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-500/20',
  CRP: 'bg-amber-50/70 text-amber-700 border-amber-500/25 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-500/20',
}

interface Props {
  conselho?: string | null
  numero?: string | null
  uf?: string | null
}

export function CouncilBadge({ conselho, numero, uf }: Props) {
  if (!conselho) return <span className="text-muted-foreground text-sm">—</span>

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tabular-nums shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
      COUNCIL_COLORS[conselho] ?? 'bg-muted text-muted-foreground border-border',
    )}>
      {conselho}
      {numero && <span className="ml-1 text-[11px] opacity-90">{numero}</span>}
      {uf && <span className="ml-0.5 opacity-80">/{uf}</span>}
    </span>
  )
}
