export type NoShowRisk = 'low' | 'medium' | 'high'

export function categorizeRisk(score: number | null | undefined): NoShowRisk | null {
  if (score == null) return null
  if (score < 34) return 'low'
  if (score < 67) return 'medium'
  return 'high'
}

export const RISK_COLORS: Record<NoShowRisk, string> = {
  low: 'bg-teal-50 text-teal-600 border border-teal/20',
  medium: 'bg-gold-50 text-gold-600 border border-gold/30',
  high: 'bg-red-50 text-red-600 border border-red-300',
}

export const RISK_LABELS: Record<NoShowRisk, string> = {
  low: 'Baixo',
  medium: 'Médio',
  high: 'Alto',
}
