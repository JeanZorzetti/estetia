'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { IntegrationMeta } from './integration-registry'
import { IntegrationIcon } from './integration-icon'

interface Props {
  integration: IntegrationMeta
  configured: boolean
  upvoteCount?: number
}

function isWhiteCard(hex: string): boolean {
  const h = hex.replace('#', '').toLowerCase()
  if (h === 'ffffff' || h === 'fff') return true
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.9
}

export function IntegrationCard({ integration, configured, upvoteCount }: Props) {
  const [isHovered, setIsHovered] = useState(false)
  const isSoon = integration.status === 'soon'
  const isLight = isWhiteCard(integration.cardBgColor)

  return (
    <Link
      href={integration.href}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
      aria-label={`${integration.name}${configured ? ' — Instalado' : isSoon ? ' — Em breve' : ' — Instalar'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Square colored card */}
      <div
        className={cn(
          'aspect-square rounded-2xl flex items-center justify-center relative overflow-hidden',
          'transition-all duration-300 ease-out',
          'group-hover:-translate-y-1.5 group-hover:scale-[1.02] group-focus-visible:-translate-y-1.5',
          isSoon && 'opacity-60 grayscale-[10%]',
          isLight && 'ring-1 ring-border'
        )}
        style={{ 
          backgroundColor: integration.cardBgColor,
          boxShadow: isHovered 
            ? `0 14px 28px -6px ${integration.cardBgColor}65, 0 6px 16px -4px ${integration.cardBgColor}45` 
            : '0 2px 6px -1px rgba(0, 0, 0, 0.04), 0 1px 4px -2px rgba(0, 0, 0, 0.02)'
        }}
      >
        <div className="transition-transform duration-300 ease-out group-hover:scale-110">
          <IntegrationIcon icon={integration.icon} size="xl" inverted />
        </div>

        {/* Em breve badge — top right */}
        {isSoon && (
          <span className="absolute top-2 right-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[8px] font-bold text-white uppercase tracking-wider leading-none">
            Em breve
          </span>
        )}

        {/* BR flag badge — top left */}
        {integration.isBrazilian && (
          <span className="absolute top-2 left-2 text-[10px] leading-none filter drop-shadow-sm" aria-label="Integração brasileira">
            🇧🇷
          </span>
        )}
      </div>

      {/* Name below card */}
      <h3 className="mt-2.5 text-[11px] font-semibold text-foreground text-center truncate px-1 group-hover:text-primary transition-colors">
        {integration.name}
      </h3>

      {/* Status text */}
      <div className="mt-1 text-center">
        {isSoon ? (
          <span className="text-[10px] text-muted-foreground/80 font-medium">
            {upvoteCount && upvoteCount > 0 ? `${upvoteCount} votos` : 'Em breve'}
          </span>
        ) : configured ? (
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-500/15 dark:bg-emerald-950/40 dark:text-emerald-400">
            ✓ Instalado
          </span>
        ) : (
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-muted/60 text-muted-foreground border border-border/30 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all duration-200">
            + Instalar
          </span>
        )}
      </div>
    </Link>
  )
}
