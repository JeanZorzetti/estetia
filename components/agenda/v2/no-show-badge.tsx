import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { categorizeRisk, RISK_COLORS, RISK_LABELS } from '@/lib/agenda/no-show-score'

export function NoShowBadge({ score, className }: { score: number | null | undefined; className?: string }) {
  const risk = categorizeRisk(score)
  if (!risk || risk === 'low') return null

  return (
    <span
      title={`Risco de no-show: ${RISK_LABELS[risk]} (${score}/100)`}
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium',
        RISK_COLORS[risk],
        className,
      )}
    >
      <AlertTriangle className="w-2.5 h-2.5" />
      {RISK_LABELS[risk]}
    </span>
  )
}
