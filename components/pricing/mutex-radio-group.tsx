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
    <div className="flex flex-col gap-4">
      {groupLabel && (
        <p className="text-[10px] text-[#489FB5] dark:text-[#489FB5]/90 uppercase tracking-widest font-bold font-sans">
          {groupLabel}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map(opt => {
          const Icon = resolveIcon(opt.iconLucide)
          const selected = selectedSlug === opt.slug
          return (
            <Card
              key={opt.slug}
              onClick={() => onSelect(selected ? null : opt.slug)}
              className={cn(
                'group relative overflow-hidden backdrop-blur-md transition-all duration-300 cursor-pointer rounded-2xl border',
                selected
                  ? 'bg-white/80 dark:bg-slate-900/70 border-[#C5A059]/60 ring-2 ring-[#C5A059] shadow-lg shadow-[#C5A059]/5'
                  : 'bg-white/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-white/5 hover:border-[#489FB5]/30 hover:shadow-xl hover:-translate-y-1',
              )}
            >
              {/* Top soft gradient glow line on hover/active */}
              <div className={cn(
                'absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#489FB5]/40 to-[#C5A059]/40 transition-opacity duration-300 rounded-t-2xl',
                selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )} />

              {selected && (
                <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#C5A059] text-white flex items-center justify-center shadow-md shadow-[#C5A059]/20 animate-scale-in">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className="p-5 relative z-10 flex flex-col h-full justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300',
                      selected ? 'bg-[#C5A059]/10 text-[#C5A059]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500',
                    )}>
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-115" />
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <h3 className="font-serif font-bold text-sm tracking-tight text-[#0A1F3D] dark:text-white leading-snug">
                        {opt.nome}
                      </h3>
                    </div>
                  </div>

                  <p className="text-[11px] font-sans text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium mb-3">
                    {opt.descricao}
                  </p>

                  <ul className="flex flex-col gap-1.5 mb-2 pl-1">
                    {opt.features.slice(0, 3).map(f => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 font-sans font-medium">
                        <Check className="w-3.5 h-3.5 mt-0.5 text-[#489FB5] flex-shrink-0" />
                        <span className="leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-baseline justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="text-[9px] font-bold text-[#489FB5] uppercase tracking-wider">
                    {selected ? 'Adicionado' : 'Opcional'}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold tracking-tight text-[#0A1F3D] dark:text-white font-sans tabular-nums">
                      {formatBRL(opt.priceCents)}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">/mês</span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      {selectedSlug && (
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="text-[11px] font-sans font-bold text-[#489FB5] hover:text-[#C5A059] self-start transition-colors duration-200 flex items-center gap-1.5 bg-slate-100/50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/70 px-3 py-1.5 rounded-full border border-slate-200/50 dark:border-white/5 shadow-sm"
        >
          <span>✕</span> Remover seleção de IA
        </button>
      )}
    </div>
  )
}

