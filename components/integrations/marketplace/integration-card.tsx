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
      <div
        className={cn(
          'relative rounded-2xl p-5 border bg-card/45 backdrop-blur-md flex flex-col justify-between h-[180px] overflow-hidden',
          'transition-all duration-300 ease-out',
          'group-hover:-translate-y-1.5 group-hover:shadow-lg group-hover:border-primary/20',
          configured ? 'border-emerald-500/20 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.05)]' : 'border-border/40',
          isSoon && 'opacity-85'
        )}
        style={{
          boxShadow: isHovered
            ? `0 12px 24px -8px ${integration.cardBgColor}25, 0 4px 12px -6px ${integration.cardBgColor}15`
            : undefined
        }}
      >
        {/* Ambient Corner Glow */}
        <div
          className="absolute -right-16 -bottom-16 w-36 h-36 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: integration.cardBgColor }}
        />

        {/* Top Info: Icon + Status */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 shadow-sm border border-border/20 transition-all duration-300 group-hover:scale-105',
              isLight && 'ring-1 ring-border/50'
            )}
            style={{ backgroundColor: integration.cardBgColor }}
          >
            <IntegrationIcon icon={integration.icon} size="lg" inverted />
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {isSoon ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400">
                Em breve
              </span>
            ) : configured ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                Conectado
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted/80 text-muted-foreground border border-border/30 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                + Conectar
              </span>
            )}

            {/* UPVOTE COUNT for coming soon */}
            {isSoon && upvoteCount !== undefined && upvoteCount > 0 && (
              <span className="text-[9px] text-amber-600 dark:text-amber-400/80 font-bold tracking-tight">
                {upvoteCount} {upvoteCount === 1 ? 'voto' : 'votos'}
              </span>
            )}
          </div>
        </div>

        {/* Middle Info: Name + Short Description */}
        <div className="mt-3 relative z-10 flex-1 flex flex-col justify-start">
          <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
            {integration.name}
            {integration.isBrazilian && (
              <span className="text-xs" title="Integração brasileira">🇧🇷</span>
            )}
          </h3>
          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
            {integration.shortDescription}
          </p>
        </div>

        {/* Bottom Info: Badges & Tags */}
        <div className="mt-3 pt-2.5 border-t border-border/10 flex items-center justify-between gap-2 relative z-10 text-[9px] text-muted-foreground">
          <div className="flex items-center gap-1.5 overflow-hidden">
            {integration.requiresTier && (
              <span className="font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
                {integration.requiresTier}
              </span>
            )}
            {integration.selfHostable && (
              <span className="font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0">
                Self-Hosted
              </span>
            )}
            {integration.costNote && !integration.requiresTier && !integration.selfHostable && (
              <span className="truncate max-w-[130px] font-semibold text-muted-foreground/80" title={integration.costNote}>
                {integration.costNote}
              </span>
            )}
          </div>

          <span className="text-primary font-bold group-hover:translate-x-0.5 transition-transform duration-300 shrink-0 text-[10px]">
            {isSoon ? 'Votar →' : 'Configurar →'}
          </span>
        </div>
      </div>
    </Link>
  )
}
