import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { IntegrationMeta } from './integration-registry'
import { IntegrationIcon } from './integration-icon'

interface Props {
  integration: IntegrationMeta
  configured: boolean
  upvoteCount?: number
}

export function IntegrationCard({ integration, configured, upvoteCount }: Props) {
  const isSoon = integration.status === 'soon'

  return (
    <Link
      href={integration.href}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
      aria-label={`${integration.name}${configured ? ' — Instalado' : isSoon ? ' — Em breve' : ' — Instalar'}`}
    >
      {/* Square colored card */}
      <div
        className={cn(
          'aspect-square rounded-xl flex items-center justify-center relative overflow-hidden',
          'transition-transform duration-200 ease-out',
          'group-hover:scale-[1.03] group-hover:shadow-lg group-focus-visible:scale-[1.03]',
          isSoon && 'opacity-70 grayscale-[30%]'
        )}
        style={{ backgroundColor: integration.cardBgColor }}
      >
        <IntegrationIcon icon={integration.icon} size="xl" inverted />

        {/* Em breve badge — top right */}
        {isSoon && (
          <span className="absolute top-2 right-2 rounded-full bg-white/20 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-semibold text-white leading-none">
            Em breve
          </span>
        )}

        {/* BR flag badge — top left */}
        {integration.isBrazilian && (
          <span className="absolute top-2 left-2 text-[11px] leading-none" aria-label="Integração brasileira">
            🇧🇷
          </span>
        )}
      </div>

      {/* Name below card */}
      <h3 className="mt-2 text-[11px] font-medium text-foreground text-center truncate px-1">
        {integration.name}
      </h3>

      {/* Status text */}
      <div className="mt-0.5 text-center">
        {isSoon ? (
          <span className="text-[10px] text-muted-foreground">
            {upvoteCount && upvoteCount > 0 ? `${upvoteCount} votos` : 'Em breve'}
          </span>
        ) : configured ? (
          <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
            ✓ Instalado
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground">+ Instalar</span>
        )}
      </div>
    </Link>
  )
}
