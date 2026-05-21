'use client'

import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
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
  isActive?: boolean  // already contracted (dashboard mode)
  onToggle: () => void
}

export function ModuleCheckboxCard({
  slug, nome, descricao, features, priceCents, iconLucide,
  selected, required, isActive, onToggle,
}: ModuleCardProps) {
  const Icon = resolveIcon(iconLucide)

  return (
    <Card
      onClick={() => !required && onToggle()}
      className={cn(
        'relative overflow-hidden backdrop-blur-md transition-all duration-300 cursor-pointer rounded-2xl border',
        selected 
          ? 'bg-white/80 dark:bg-slate-900/70 border-[#C5A059]/60 ring-2 ring-[#C5A059] shadow-lg shadow-[#C5A059]/5' 
          : 'bg-white/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-white/5 hover:border-[#489FB5]/30 hover:shadow-xl hover:-translate-y-1',
        required && 'cursor-not-allowed bg-slate-100/30 dark:bg-slate-900/20 border-slate-200/20 dark:border-white/5 opacity-80',
      )}
    >
      {/* Top soft gradient glow line on hover/active */}
      <div className={cn(
        'absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#489FB5]/40 to-[#C5A059]/40 transition-opacity duration-300 rounded-t-2xl',
        selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      )} />

      <div className="p-5 relative z-10 flex flex-col h-full justify-between gap-4">
        <div>
          <div className="flex items-start gap-3.5 mb-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300',
              selected ? 'bg-[#C5A059]/10 text-[#C5A059]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500',
            )}>
              <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="font-serif font-bold text-sm tracking-tight text-[#0A1F3D] dark:text-white truncate leading-snug">
                    {nome}
                  </h3>
                  {isActive && (
                    <Badge variant="secondary" className="text-[8px] px-1.5 py-0.5 font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20 flex-shrink-0 rounded-md">
                      Ativo
                    </Badge>
                  )}
                </div>
                <Checkbox
                  checked={selected || required}
                  disabled={required}
                  onCheckedChange={onToggle}
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    "mt-0.5 flex-shrink-0 rounded border-slate-200 text-[#C5A059] focus:ring-[#C5A059]/30",
                    selected && "border-[#C5A059] bg-[#C5A059]"
                  )}
                />
              </div>
              <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                {descricao}
              </p>
            </div>
          </div>

          <ul className="flex flex-col gap-1.5 mb-2 pl-1">
            {features.slice(0, 4).map(f => (
              <li key={f} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 font-sans font-medium">
                <Check className="w-3.5 h-3.5 mt-0.5 text-emerald-500 flex-shrink-0" />
                <span className="leading-snug">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-baseline justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60">
          {required ? (
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Incluso</span>
          ) : (
            <span className="text-[9px] font-bold text-[#489FB5] uppercase tracking-wider">a partir de</span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold tracking-tight text-[#0A1F3D] dark:text-white font-sans tabular-nums">
              {formatBRL(priceCents)}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">/mês</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
