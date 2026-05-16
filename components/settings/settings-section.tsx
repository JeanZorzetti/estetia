import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  label: string
  description?: string
  children: ReactNode
}

export function SettingsSection({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  description,
  children,
}: Props) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1 ring-border/40',
            iconBg,
            iconColor
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            {label}
          </h2>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  )
}
