'use client'

import { KpiGrid } from '../kpi-grid'
import { AdsSpendChart } from '../charts/ads-spend-chart'
import { LoyaltyTrendChart } from '../charts/loyalty-trend-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Target, Users, TrendingUp } from 'lucide-react'
import type { AdsSpendPoint, MarketingROI, ReferralBreakdown, LoyaltyTrendPoint } from '@/lib/analytics-clinico/types'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)

const REFERRAL_LABELS: Record<string, string> = {
  PENDENTE: 'Pendente',
  CONVERTIDO: 'Convertido',
  RECOMPENSADO: 'Recompensado',
  CANCELADO: 'Cancelado',
}

interface Props {
  adsSpend: AdsSpendPoint[]
  roi: MarketingROI
  referrals: ReferralBreakdown[]
  loyalty: LoyaltyTrendPoint[]
}

export function MarketingTab({ adsSpend, roi, referrals, loyalty }: Props) {
  const kpiItems = [
    {
      label: 'Investimento em Ads',
      value: formatBRL(roi.spend),
      icon: DollarSign,
      colorClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    },
    {
      label: 'CAC estimado',
      value: formatBRL(roi.cac),
      icon: Target,
      colorClass: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
    },
    {
      label: 'Indicações',
      value: String(referrals.reduce((s, r) => s + r.count, 0)),
      icon: Users,
      colorClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
    },
    {
      label: 'ROI estimado',
      value: `${roi.roi.toFixed(0)}%`,
      icon: TrendingUp,
      colorClass: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
    },
  ]

  return (
    <div className="space-y-6">
      <KpiGrid items={kpiItems} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdsSpendChart data={adsSpend} />
        <LoyaltyTrendChart data={loyalty} />
      </div>

      {referrals.length > 0 && (
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Indicações por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {referrals.map((r) => (
                <div key={r.status} className="text-center p-4 rounded-lg bg-muted/30 border border-border/40">
                  <p className="text-2xl font-bold tabular-nums">{r.count}</p>
                  <p className="text-xs text-muted-foreground mt-1">{REFERRAL_LABELS[r.status] ?? r.status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
