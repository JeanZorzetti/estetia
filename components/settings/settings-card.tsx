import Link from 'next/link'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface Props {
  href?: string
  onClick?: () => void
  icon: LucideIcon
  iconColor: string
  iconBg: string
  title: string
  description?: string
  badge?: ReactNode
  external?: boolean
}

export function SettingsCard({
  href,
  onClick,
  icon: Icon,
  iconColor,
  iconBg,
  title,
  description,
  badge,
  external,
}: Props) {
  const inner = (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 h-full',
        'transition-all duration-200 ease-out',
        'hover:border-primary/40 hover:shadow-sm hover:-translate-y-[1px]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ring-border/40',
          iconBg,
          iconColor
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold tracking-tight text-foreground truncate">
            {title}
          </h3>
          {badge}
        </div>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground leading-snug line-clamp-2">
            {description}
          </p>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-200" />
    </div>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="text-left">
        {inner}
      </button>
    )
  }

  if (!href) return inner

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {inner}
      </a>
    )
  }

  return <Link href={href}>{inner}</Link>
}
