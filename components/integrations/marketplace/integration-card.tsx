import Link from 'next/link'
import { ArrowUpRight, Server, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { IntegrationMeta } from './integration-registry'
import { StatusBadge } from './status-badge'
import { TierGateBadge } from './tier-gate-badge'
import { IntegrationIcon } from './integration-icon'
import { BrBadge } from './br-badge'

interface Props {
  integration: IntegrationMeta
  configured: boolean
  upvoteCount?: number
}

export function IntegrationCard({ integration, configured, upvoteCount }: Props) {
  const isSoon = integration.status === 'soon'

  const status: Parameters<typeof StatusBadge>[0]['status'] = isSoon
    ? 'soon'
    : integration.status === 'maintenance'
      ? 'maintenance'
      : configured
        ? 'connected'
        : 'not_configured'

  return (
    <Link
      href={integration.href}
      className={cn(
        'group relative flex h-full flex-col gap-3 rounded-xl border border-border/60 bg-card p-4',
        'transition-all duration-200 ease-out',
        'hover:border-primary/40 hover:shadow-sm hover:-translate-y-[1px]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isSoon && 'opacity-90'
      )}
    >
      <ArrowUpRight className="absolute right-3 top-3 h-3.5 w-3.5 text-muted-foreground/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="flex items-start gap-3">
        <div className={cn(isSoon && 'grayscale-[40%]')}>
          <IntegrationIcon icon={integration.icon} size="md" />
        </div>
        <div className="min-w-0 flex-1 pr-5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-sm font-semibold tracking-tight text-foreground truncate">
              {integration.name}
            </h3>
            {integration.isBrazilian && <BrBadge />}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground leading-snug line-clamp-2">
            {integration.shortDescription}
          </p>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
        <StatusBadge status={status} />
        {integration.requiresTier && <TierGateBadge tier={integration.requiresTier} />}
        {integration.selfHostable && (
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-500/20 bg-zinc-500/10 px-2 py-0.5 text-[10px] font-medium text-zinc-500 uppercase tracking-wide">
            <Server className="h-2.5 w-2.5" />
            Self-hosted
          </span>
        )}
        {isSoon && upvoteCount !== undefined && upvoteCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
            <Clock className="h-2.5 w-2.5" />
            {upvoteCount} {upvoteCount === 1 ? 'voto' : 'votos'}
          </span>
        )}
      </div>

      {integration.costNote && !isSoon && (
        <p className="text-[10px] text-muted-foreground/70 italic">{integration.costNote}</p>
      )}
    </Link>
  )
}
