'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  INTEGRATIONS,
  CATEGORIES,
  type IntegrationCategory,
} from './integration-registry'
import { IntegrationCard } from './integration-card'
import { CategorySectionHeader } from './category-section-header'

interface OrgStatus {
  configured: Record<string, boolean>
}

interface Props {
  orgStatus: OrgStatus
  upvoteCounts?: Record<string, number>
}

const GRID_COLS = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'

export function IntegrationGrid({ orgStatus, upvoteCounts = {} }: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<IntegrationCategory | 'todas'>('todas')
  const [hideSoon, setHideSoon] = useState(false)

  const q = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    return INTEGRATIONS.filter((i) => {
      if (category !== 'todas' && i.category !== category) return false
      if (hideSoon && i.status === 'soon') return false
      if (!q) return true
      return (
        i.name.toLowerCase().includes(q) ||
        i.shortDescription.toLowerCase().includes(q)
      )
    })
  }, [q, category, hideSoon])

  const totalCount = INTEGRATIONS.length
  const stableCount = INTEGRATIONS.filter((i) => i.status !== 'soon').length

  const showGrouped = category === 'todas' && !q

  return (
    <div className="space-y-6">
      {/* Search + controls */}
      <div className="space-y-4 bg-muted/[0.02] dark:bg-muted/[0.04] p-4 rounded-2xl border border-border/10">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar integração por nome ou descrição..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 shadow-sm"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground cursor-pointer select-none bg-background/30 dark:bg-zinc-900/30 px-3.5 py-2.5 rounded-xl border border-border/30 hover:border-primary/20 hover:text-foreground transition-all duration-200">
            <input
              type="checkbox"
              checked={hideSoon}
              onChange={(e) => setHideSoon(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/30"
            />
            Esconder &quot;Em breve&quot;
          </label>

          <div className="text-xs text-muted-foreground font-semibold tabular-nums ml-auto bg-background/30 dark:bg-zinc-900/30 px-3.5 py-2.5 rounded-xl border border-border/30">
            <span className="text-emerald-500 font-bold">{stableCount}</span> disponíveis · <span className="text-amber-500 font-bold">{totalCount - stableCount}</span> em breve
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              aria-pressed={category === cat.id}
              className={cn(
                'rounded-xl border px-3.5 py-1.5 text-xs font-bold whitespace-nowrap',
                'transition-all duration-250',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                category === cat.id
                  ? 'border-primary/30 bg-primary/10 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                  : 'border-border/40 bg-card/40 backdrop-blur-sm text-muted-foreground hover:border-primary/25 hover:text-foreground hover:bg-card/75 shadow-sm'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid content */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-muted/20 py-12 text-center">
          <Search className="h-8 w-8 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">Nenhuma integração encontrada</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Tente outro termo de busca</p>
        </div>
      ) : showGrouped ? (
        // Grouped by category with section headers
        <div className="space-y-8">
          {CATEGORIES.filter((c) => c.id !== 'todas').map((cat) => {
            const items = filtered.filter((i) => i.category === cat.id)
            if (items.length === 0) return null
            return (
              <section key={cat.id} className="space-y-3">
                <CategorySectionHeader
                  category={cat.id as IntegrationCategory}
                  count={items.length}
                />
                <div className={GRID_COLS}>
                  {items.map((integration) => (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      configured={orgStatus.configured[integration.id] ?? false}
                      upvoteCount={upvoteCounts[integration.id]}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        // Flat grid for specific category filter or search
        <div className={GRID_COLS}>
          {filtered.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              configured={orgStatus.configured[integration.id] ?? false}
              upvoteCount={upvoteCounts[integration.id]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
