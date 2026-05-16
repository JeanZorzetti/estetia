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

interface OrgStatus {
  configured: Record<string, boolean>
}

interface Props {
  orgStatus: OrgStatus
  upvoteCounts?: Record<string, number>
}

export function IntegrationGrid({ orgStatus, upvoteCounts = {} }: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<IntegrationCategory | 'todas'>('todas')
  const [hideSoon, setHideSoon] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return INTEGRATIONS.filter((i) => {
      if (category !== 'todas' && i.category !== category) return false
      if (hideSoon && i.status === 'soon') return false
      if (!q) return true
      return (
        i.name.toLowerCase().includes(q) ||
        i.shortDescription.toLowerCase().includes(q)
      )
    })
  }, [query, category, hideSoon])

  const totalCount = INTEGRATIONS.length
  const stableCount = INTEGRATIONS.filter((i) => i.status !== 'soon').length

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar integração..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hideSoon}
              onChange={(e) => setHideSoon(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border"
            />
            Esconder "Em breve"
          </label>

          <div className="text-xs text-muted-foreground tabular-nums">
            {stableCount} disponíveis · {totalCount - stableCount} em breve
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              aria-pressed={category === cat.id}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap',
                'transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                category === cat.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-muted/20 py-12 text-center">
          <Search className="h-8 w-8 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">Nenhuma integração encontrada</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Tente outro termo de busca</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
