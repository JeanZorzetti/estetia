'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Layers, AlertCircle } from 'lucide-react'
import { formatBRL } from '@/lib/pricing/calculator'
import type { PricingModuleData } from '@/lib/pricing/modules'

interface Props {
  module: PricingModuleData
  isActive?: boolean
}

export function BasePlatformCard({ module, isActive }: Props) {
  return (
    <Card className="relative overflow-hidden backdrop-blur-md bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-white/5 shadow-md rounded-2xl">
      {/* Top line gradient glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#489FB5]/40 to-[#C5A059]/40 opacity-100 rounded-t-2xl" />

      <div className="p-6 md:p-7 relative z-10">
        <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-6">
          {/* Left: icon + headline */}
          <div className="flex items-start gap-4 md:flex-1">
            <div className="w-12 h-12 rounded-xl bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center flex-shrink-0 shadow-inner">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="font-serif font-bold text-lg text-[#0A1F3D] dark:text-white tracking-tight">{module.nome}</h3>
                <Badge variant="secondary" className="text-[9px] uppercase tracking-wider font-bold bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 rounded-md">
                  Obrigatória
                </Badge>
                {isActive && (
                  <Badge variant="secondary" className="text-[9px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-500/10 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20 rounded-md">
                    Ativa
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-medium">
                A infraestrutura compartilhada que sustenta todos os módulos: login, multi-usuário, LGPD e o esqueleto da agenda. Toda assinatura inclui esta base automaticamente.
              </p>
            </div>
          </div>

          {/* Right: price */}
          <div className="flex md:flex-col items-baseline md:items-end justify-between md:justify-start gap-2 md:gap-1.5 md:text-right md:min-w-[150px] md:pl-6 md:border-l border-slate-100 dark:border-slate-800/80">
            <span className="text-[9px] uppercase tracking-wider font-bold text-[#C5A059]">Sempre inclusa</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-[#0A1F3D] dark:text-white font-sans tabular-nums">{formatBRL(module.priceCents)}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">/mês</span>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-5 border-t border-slate-100 dark:border-slate-800/60">
          {module.features.map(f => (
            <div key={f} className="flex items-start gap-2 text-xs sm:text-sm">
              <Check className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
              <span className="text-slate-600 dark:text-slate-300 font-medium font-sans leading-snug">{f}</span>
            </div>
          ))}
        </div>

        {/* Honest disclosure */}
        <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 px-4 py-3">
          <AlertCircle className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
          <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300 font-sans font-medium">
            <span className="font-bold">A Base sozinha não opera uma clínica.</span>{' '}
            Você precisa adicionar pelo menos um módulo clínico (Prontuário, Procedimentos ou Pacotes) para conseguir atender pacientes. O preço final é a Base + os módulos que você escolher abaixo.
          </p>
        </div>
      </div>
    </Card>
  )
}
