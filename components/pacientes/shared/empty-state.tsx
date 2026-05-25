import { type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  iconColor?: string
  iconBg?: string
}

export function EmptyState({ icon: Icon, title, description, action, iconColor = 'text-teal-500', iconBg = 'bg-teal-500/10 border-teal-500/20' }: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-card/20 backdrop-blur-sm rounded-3xl border border-border/40 flex flex-col items-center justify-center gap-4">
      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${iconBg}`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-bold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
