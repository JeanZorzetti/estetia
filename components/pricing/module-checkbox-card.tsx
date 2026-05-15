'use client'

import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Check } from 'lucide-react'
import { resolveIcon } from './icon-resolver'
import { formatBRL } from '@/lib/pricing/calculator'
import { cn } from '@/lib/utils'

interface ModuleCardProps {
  slug: string
  nome: string
  descricao: string
  features: string[]
  priceCents: number
  iconLucide: string
  selected: boolean
  required?: boolean
  onToggle: () => void
}

export function ModuleCheckboxCard({
  slug, nome, descricao, features, priceCents, iconLucide,
  selected, required, onToggle,
}: ModuleCardProps) {
  const Icon = resolveIcon(iconLucide)

  return (
    <Card
      onClick={() => !required && onToggle()}
      className={cn(
        'border-border/60 transition-all duration-200 cursor-pointer overflow-hidden',
        selected && 'ring-2 ring-primary border-primary shadow-md',
        required && 'cursor-not-allowed bg-muted/30',
        !selected && !required && 'hover:border-primary/40 hover:shadow-sm hover:-translate-y-0.5',
      )}
    >
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm tracking-tight leading-snug">{nome}</h3>
              <Checkbox
                checked={selected || required}
                disabled={required}
                onCheckedChange={onToggle}
                onClick={(e) => e.stopPropagation()}
                className="mt-0.5 flex-shrink-0"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{descricao}</p>
          </div>
        </div>

        <ul className="flex flex-col gap-1 mb-4 pl-1">
          {features.slice(0, 4).map(f => (
            <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
              <Check className="w-3 h-3 mt-0.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-baseline justify-between pt-3 border-t border-border/40">
          {required ? (
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Incluso</span>
          ) : (
            <span className="text-xs text-muted-foreground">a partir de</span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold tracking-tight tabular-nums">{formatBRL(priceCents)}</span>
            <span className="text-xs text-muted-foreground">/mês</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
