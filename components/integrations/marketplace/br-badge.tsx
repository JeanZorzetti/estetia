import { cn } from '@/lib/utils'

export function BrBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1 py-0.5 text-[9px] font-semibold leading-none text-emerald-700 dark:text-emerald-400',
        className
      )}
      title="Solução brasileira"
    >
      🇧🇷 BR
    </span>
  )
}
