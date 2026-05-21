'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Sparkles, AlertCircle, ShieldCheck } from 'lucide-react'
import { formatBRL } from '@/lib/pricing/calculator'
import type { CalculateResult } from '@/lib/pricing/calculator'
import { cn } from '@/lib/utils'

interface Props {
  result: CalculateResult | null
  loading?: boolean
  billingPeriod: 'MONTHLY' | 'ANNUAL'
  onBillingChange: (p: 'MONTHLY' | 'ANNUAL') => void
  ctaLabel?: string
  ctaHref?: string
  onCta?: () => void
  ctaDisabled?: boolean
  showAnnualToggle?: boolean
  mode?: 'signup' | 'dashboard'
  currentTotalCents?: number  // what the org currently pays (dashboard mode)
}

export function PriceSidebar({
  result, loading, billingPeriod, onBillingChange,
  ctaLabel,
  ctaHref, onCta, ctaDisabled, showAnnualToggle = true,
  mode = 'signup', currentTotalCents,
}: Props) {
  const resolvedCtaLabel = ctaLabel ?? (mode === 'dashboard' ? 'Confirmar Upgrade' : 'Ativar Estetia CRM')
  const newTotal = result?.totalCents ?? 0
  const diff = currentTotalCents != null ? newTotal - currentTotalCents : null

  const ctaContent = (
    <Button 
      className={cn(
        "w-full py-6 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#A8853F] text-white font-sans font-bold hover:shadow-xl hover:shadow-[#C5A059]/15 transition-all duration-300 hover:brightness-105 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 border-0 text-sm tracking-wide",
        ctaDisabled && "opacity-50 cursor-not-allowed"
      )}
      disabled={ctaDisabled} 
      onClick={!ctaHref ? onCta : undefined}
      size="lg"
    >
      <Sparkles className="w-4 h-4 text-white fill-white/10 animate-pulse" />
      {resolvedCtaLabel}
    </Button>
  )

  return (
    <Card className="border-slate-200/50 dark:border-white/5 sticky top-28 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
      {/* Top metallic glow border */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#489FB5] via-[#C5A059] to-[#489FB5]" />

      <CardContent className="p-6 relative z-10 flex flex-col gap-6">
        {showAnnualToggle && (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#C5A059]/5 dark:bg-[#C5A059]/5 border border-[#C5A059]/20">
            <div>
              <p className="text-xs font-bold text-[#0A1F3D] dark:text-white font-sans">
                Faturamento Anual
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-bold text-[#C5A059] uppercase tracking-wider bg-[#C5A059]/10 px-1.5 py-0.5 rounded">
                  Economize 15%
                </span>
              </div>
            </div>
            <Switch
              checked={billingPeriod === 'ANNUAL'}
              onCheckedChange={(v) => onBillingChange(v ? 'ANNUAL' : 'MONTHLY')}
              className="data-[state=checked]:bg-[#C5A059] data-[state=unchecked]:bg-slate-200 dark:data-[state=unchecked]:bg-slate-700"
            />
          </div>
        )}

        <div>
          <p className="text-[10px] text-[#489FB5] dark:text-[#489FB5]/90 uppercase tracking-widest font-bold font-sans mb-1.5">
            {mode === 'dashboard' ? 'Nova Assinatura' : 'Investimento Estimado'}
          </p>
          {loading ? (
            <div className="h-12 w-44 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold tracking-tight text-[#0A1F3D] dark:text-white font-sans tabular-nums">
                {formatBRL(newTotal)}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">/mês</span>
            </div>
          )}
          
          {mode === 'dashboard' && currentTotalCents != null && !loading && diff !== null && diff !== 0 && (
            <p className={cn(
              'text-[11px] mt-2 font-medium font-sans px-2.5 py-1 rounded-lg inline-block border',
              diff > 0 
                ? 'text-[#C5A059] bg-[#C5A059]/5 border-[#C5A059]/20' 
                : 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border-emerald-500/10',
            )}>
              {diff > 0 
                ? `+ ${formatBRL(diff)} adicionais sobre plano atual (${formatBRL(currentTotalCents)}/mês)` 
                : `${formatBRL(diff)} de redução sobre plano atual (${formatBRL(currentTotalCents)}/mês)`
              }
            </p>
          )}
          {mode === 'dashboard' && currentTotalCents != null && !loading && diff === 0 && (
            <p className="text-[11px] mt-2 text-slate-400 font-medium font-sans">
              Mesmo valor do seu plano atual
            </p>
          )}
          {billingPeriod === 'ANNUAL' && result && result.annualDiscountCents > 0 && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 font-semibold font-sans">
              Economia anual de {formatBRL(result.annualDiscountCents * 12)} ativa.
            </p>
          )}
        </div>

        {result && result.breakdown.length > 0 && (
          <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-150 dark:border-slate-800/60 max-h-60 overflow-y-auto scrollbar-thin">
            <span className="text-[9px] font-sans font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Resumo da Configuração
            </span>
            {result.breakdown.map(b => (
              <div key={b.slug} className="flex items-center justify-between gap-3 text-xs">
                <span className={cn(
                  'font-sans font-medium truncate',
                  b.category === 'BASE' ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400',
                )}>
                  {b.nome}
                </span>
                <span className="font-sans font-bold text-[#0A1F3D] dark:text-white tabular-nums flex-shrink-0">
                  {formatBRL(b.priceCents)}
                </span>
              </div>
            ))}

            {result.extrasCents > 0 && (
              <div className="flex items-center justify-between gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800/30">
                <span className="text-slate-500 dark:text-slate-400 font-sans font-medium">Capacidades Extras</span>
                <span className="font-sans font-bold text-[#0A1F3D] dark:text-white tabular-nums">{formatBRL(result.extrasCents)}</span>
              </div>
            )}

            {result.annualDiscountCents > 0 && (
              <div className="flex items-center justify-between gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800/30">
                <span className="text-emerald-600 dark:text-emerald-400 font-sans font-medium">Desconto Plano Anual</span>
                <span className="font-sans font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                  -{formatBRL(result.annualDiscountCents)}
                </span>
              </div>
            )}
          </div>
        )}

        {result && result.warnings.length > 0 && (
          <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            {result.warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] text-amber-800 dark:text-amber-200 font-sans font-medium">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
                <span className="leading-relaxed">{w}</span>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2">
          {ctaHref ? (
            <a href={ctaHref} className="w-full block">
              {ctaContent}
            </a>
          ) : (
            ctaContent
          )}
        </div>

        {mode !== 'dashboard' && (
          <div className="flex items-center justify-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/30 text-[10px] text-slate-400 dark:text-slate-500 font-medium font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Cancelamento grátis · Sem fidelidade</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

