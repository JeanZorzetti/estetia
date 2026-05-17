'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Sparkles, AlertCircle } from 'lucide-react'
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
  const resolvedCtaLabel = ctaLabel ?? (mode === 'dashboard' ? 'Atualizar assinatura' : 'Começar 7 dias grátis')
  const newTotal = result?.totalCents ?? 0
  const diff = currentTotalCents != null ? newTotal - currentTotalCents : null
  return (
    <Card className="border-border/60 sticky top-6">
      <CardContent className="p-6 flex flex-col gap-5">
        {showAnnualToggle && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/40">
            <div>
              <p className="text-sm font-medium">Pagamento anual</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Economize 15%</p>
            </div>
            <Switch
              checked={billingPeriod === 'ANNUAL'}
              onCheckedChange={(v) => onBillingChange(v ? 'ANNUAL' : 'MONTHLY')}
            />
          </div>
        )}

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            {mode === 'dashboard' ? 'Novo total' : 'Seu Estetia'}
          </p>
          {loading ? (
            <div className="h-12 w-32 bg-muted animate-pulse rounded" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tighter tabular-nums">
                {formatBRL(newTotal)}
              </span>
              <span className="text-sm text-muted-foreground">/mês</span>
            </div>
          )}
          {mode === 'dashboard' && currentTotalCents != null && !loading && diff !== null && diff !== 0 && (
            <p className={cn(
              'text-xs mt-1 font-medium',
              diff > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400',
            )}>
              {diff > 0 ? `+${formatBRL(diff)} vs. plano atual (${formatBRL(currentTotalCents)}/mês)` : `${formatBRL(diff)} vs. plano atual (${formatBRL(currentTotalCents)}/mês)`}
            </p>
          )}
          {mode === 'dashboard' && currentTotalCents != null && !loading && diff === 0 && (
            <p className="text-xs mt-1 text-muted-foreground">Mesmo valor do plano atual</p>
          )}
          {billingPeriod === 'ANNUAL' && result && result.annualDiscountCents > 0 && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              Economia anual: {formatBRL(result.annualDiscountCents * 12)}
            </p>
          )}
        </div>

        {result && result.breakdown.length > 0 && (
          <div className="flex flex-col gap-2 pt-4 border-t border-border/40 max-h-72 overflow-y-auto">
            {result.breakdown.map(b => (
              <div key={b.slug} className="flex items-center justify-between gap-2 text-sm">
                <span className={cn(
                  'truncate',
                  b.category === 'BASE' && 'text-muted-foreground',
                )}>
                  {b.nome}
                </span>
                <span className="text-xs font-medium tabular-nums flex-shrink-0">
                  {formatBRL(b.priceCents)}
                </span>
              </div>
            ))}

            {result.extrasCents > 0 && (
              <div className="flex items-center justify-between gap-2 text-sm pt-2 border-t border-border/30">
                <span className="text-muted-foreground">Recursos extras</span>
                <span className="text-xs font-medium tabular-nums">{formatBRL(result.extrasCents)}</span>
              </div>
            )}

            {result.annualDiscountCents > 0 && (
              <div className="flex items-center justify-between gap-2 text-sm pt-2 border-t border-border/30">
                <span className="text-emerald-600 dark:text-emerald-400">Desconto anual (15%)</span>
                <span className="text-xs font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                  -{formatBRL(result.annualDiscountCents)}
                </span>
              </div>
            )}
          </div>
        )}

        {result && result.warnings.length > 0 && (
          <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
            {result.warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{w}</span>
              </div>
            ))}
          </div>
        )}

        {ctaHref ? (
          <a href={ctaHref} className="w-full">
            <Button className="w-full" disabled={ctaDisabled} size="lg">
              <Sparkles className="w-4 h-4 mr-2" />
              {resolvedCtaLabel}
            </Button>
          </a>
        ) : (
          <Button className="w-full" onClick={onCta} disabled={ctaDisabled} size="lg">
            <Sparkles className="w-4 h-4 mr-2" />
            {resolvedCtaLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
