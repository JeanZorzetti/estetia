export type NoShowRisk = 'low' | 'medium' | 'high'

export function categorizeRisk(score: number | null | undefined): NoShowRisk | null {
  if (score == null) return null
  if (score < 34) return 'low'
  if (score < 67) return 'medium'
  return 'high'
}

export const RISK_COLORS: Record<NoShowRisk, string> = {
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

export const RISK_LABELS: Record<NoShowRisk, string> = {
  low: 'Baixo',
  medium: 'Médio',
  high: 'Alto',
}
