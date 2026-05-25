import { Badge } from '@/components/ui/badge'
import type { TicketPriority } from '@prisma/client'

const PRIORITY_CONFIG: Record<TicketPriority, { label: string; className: string }> = {
  LOW: { label: 'Baixa', className: 'bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full' },
  NORMAL: { label: 'Normal', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full' },
  HIGH: { label: 'Alta', className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full' },
  URGENT: { label: 'Urgente', className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full' },
}

export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  const config = PRIORITY_CONFIG[priority]
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
