import { cn } from '@/lib/utils'

const COUNCIL_COLORS: Record<string, string> = {
  CRM: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  CRO: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  CRBM: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  CRF: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  COREN: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  CFBM: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  CREFITO: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  CRP: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
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
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium tabular-nums',
      COUNCIL_COLORS[conselho] ?? 'bg-muted text-muted-foreground',
    )}>
      {conselho}
      {numero && <span className="ml-1">{numero}</span>}
      {uf && <span className="ml-0.5">/{uf}</span>}
    </span>
  )
}
