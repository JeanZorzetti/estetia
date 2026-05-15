'use client'

import { Card } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { resolveIcon } from './icon-resolver'
import { formatBRL } from '@/lib/pricing/calculator'
import { cn } from '@/lib/utils'

interface RadioModule {
  slug: string
  nome: string
  descricao: string
  features: string[]
  priceCents: number
  iconLucide: string
}

interface Props {
  options: RadioModule[]
  selectedSlug: string | null
  onSelect: (slug: string | null) => void
  groupLabel?: string
}

export function MutexRadioGroup({ options, selectedSlug, onSelect, groupLabel }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {groupLabel && (
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{groupLabel}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {options.map(opt => {
          const Icon = resolveIcon(opt.iconLucide)
          const selected = selectedSlug === opt.slug
          return (
            <Card
              key={opt.slug}
              onClick={() => onSelect(selected ? null : opt.slug)}
              className={cn(
                'p-5 cursor-pointer border-border/60 transition-all duration-200 relative overflow-hidden',
                selected && 'ring-2 ring-primary border-primary shadow-md',
                !selected && 'hover:border-primary/40 hover:shadow-sm hover:-translate-y-0.5',
              )}
            >
              {selected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center mb-3',
                selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm tracking-tight leading-snug">{opt.nome}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed mb-3">{opt.descricao}</p>
              <ul className="flex flex-col gap-1 mb-4">
                {opt.features.slice(0, 3).map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 mt-0.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-baseline justify-end gap-1 pt-3 border-t border-border/40">
                <span className="text-lg font-bold tracking-tight tabular-nums">{formatBRL(opt.priceCents)}</span>
                <span className="text-xs text-muted-foreground">/mês</span>
              </div>
            </Card>
          )
        })}
      </div>
      {selectedSlug && (
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="text-xs text-muted-foreground hover:text-foreground self-start transition-colors"
        >
          ✕ Remover seleção de IA
        </button>
      )}
    </div>
  )
}
