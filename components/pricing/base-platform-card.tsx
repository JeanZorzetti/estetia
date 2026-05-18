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
    <Card className="border-primary/30 bg-gradient-to-br from-primary/[0.03] to-transparent overflow-hidden">
      <div className="p-6 md:p-7">
        <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-6">
          {/* Left: icon + headline */}
          <div className="flex items-start gap-4 md:flex-1">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h3 className="font-semibold text-lg tracking-tight">{module.nome}</h3>
                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-semibold bg-primary/10 text-primary border-primary/20">
                  Obrigatória
                </Badge>
                {isActive && (
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                    Ativa
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A infraestrutura compartilhada que sustenta todos os módulos: login, multi-usuário, LGPD e o esqueleto da agenda. Toda assinatura inclui esta base automaticamente.
              </p>
            </div>
          </div>

          {/* Right: price */}
          <div className="flex md:flex-col items-baseline md:items-end justify-between md:justify-start gap-2 md:gap-1 md:text-right md:min-w-[140px] md:pl-6 md:border-l border-border/40">
            <span className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Sempre inclusa</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight tabular-nums">{formatBRL(module.priceCents)}</span>
              <span className="text-xs text-muted-foreground">/mês</span>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-5 border-t border-border/40">
          {module.features.map(f => (
            <div key={f} className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <span className="text-foreground/80 leading-snug">{f}</span>
            </div>
          ))}
        </div>

        {/* Honest disclosure */}
        <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 px-4 py-3">
          <AlertCircle className="w-4 h-4 mt-0.5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
          <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200">
            <span className="font-semibold">A Base sozinha não opera uma clínica.</span>{' '}
            Você precisa adicionar pelo menos um módulo clínico (Prontuário, Procedimentos ou Pacotes) para conseguir atender pacientes. O preço final é a Base + os módulos que você escolher abaixo.
          </p>
        </div>
      </div>
    </Card>
  )
}
