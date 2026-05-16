import { CheckCircle2, Circle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Status = 'connected' | 'not_configured' | 'maintenance' | 'soon'

const CONFIG: Record<Status, { icon: typeof CheckCircle2; label: string; className: string }> = {
  connected: {
    icon: CheckCircle2,
    label: 'Conectado',
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  not_configured: {
    icon: Circle,
    label: 'Não configurado',
    className: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
  },
  maintenance: {
    icon: AlertTriangle,
    label: 'Manutenção',
    className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  soon: {
    icon: Circle,
    label: 'Em breve',
    className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
}

export function StatusBadge({ status }: { status: Status }) {
  const cfg = CONFIG[status]
  const Icon = cfg.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
        cfg.className
      )}
    >
      <Icon className="h-2.5 w-2.5" />
      {cfg.label}
    </span>
  )
}
