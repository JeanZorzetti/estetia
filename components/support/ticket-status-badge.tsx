import { Badge } from '@/components/ui/badge'
import type { TicketStatus } from '@prisma/client'

const STATUS_CONFIG: Record<TicketStatus, { label: string; className: string }> = {
  OPEN: { label: 'Aberto', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full' },
  IN_PROGRESS: { label: 'Em andamento', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full' },
  WAITING_USER: { label: 'Aguardando você', className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full' },
  RESOLVED: { label: 'Resolvido', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full' },
  CLOSED: { label: 'Fechado', className: 'bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full' },
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
