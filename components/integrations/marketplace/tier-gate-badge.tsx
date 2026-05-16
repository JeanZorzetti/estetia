import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

const STYLES: Record<string, string> = {
  BUSINESS: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  PRO: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
}

export function TierGateBadge({ tier }: { tier: 'BUSINESS' | 'PRO' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide',
        STYLES[tier]
      )}
    >
      <Sparkles className="h-2.5 w-2.5" />
      {tier}
    </span>
  )
}
