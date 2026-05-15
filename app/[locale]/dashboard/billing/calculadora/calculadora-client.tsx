'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PricingBuilder, type BuilderState } from '@/components/pricing/pricing-builder'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, Lock, CheckCircle2 } from 'lucide-react'
import { formatBRL } from '@/lib/pricing/calculator'
import type { PricingModuleData } from '@/lib/pricing/modules'

interface Props {
  modules: PricingModuleData[]
  initialSelectedSlugs: string[]
  initialExtras: { users: number; rooms: number; profs: number }
  initialBilling: 'MONTHLY' | 'ANNUAL'
  currentPriceCents: number | null
  lockedPriceCents: number | null
  isAdmin: boolean
}

export function CalculadoraClient({
  modules,
  initialSelectedSlugs,
  initialExtras,
  initialBilling,
  currentPriceCents,
  lockedPriceCents,
  isAdmin,
}: Props) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [preview, setPreview] = useState<{
    deltaCents: number
    prorationCents: number
    newPriceCents: number
  } | null>(null)
  const [success, setSuccess] = useState(false)

  const onCta = async (state: BuilderState) => {
    if (!isAdmin) return
    setSubmitting(true)
    setSuccess(false)
    try {
      const body = {
        modules: state.selectedSlugs,
        extraUsers: state.extraUsers,
        extraRooms: state.extraRooms,
        extraProfs: state.extraProfs,
        billingPeriod: state.billingPeriod,
      }

      // 1. Get preview
      const previewRes = await fetch('/api/billing/preview-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const previewData = await previewRes.json()

      setPreview({
        deltaCents: previewData.deltaCents,
        prorationCents: previewData.prorationCents,
        newPriceCents: previewData.newPriceCents,
      })

      const confirmMsg = previewData.deltaCents === 0
        ? 'Aplicar alterações no plano?'
        : previewData.deltaCents > 0
          ? `Adicionar módulos: +${formatBRL(previewData.deltaCents)}/mês a partir do próximo ciclo. Cobrança proporcional hoje: ${formatBRL(previewData.prorationCents)}. Confirmar?`
          : `Remover módulos: redução de ${formatBRL(Math.abs(previewData.deltaCents))}/mês a partir do próximo ciclo. Confirmar?`

      if (!confirm(confirmMsg)) {
        setSubmitting(false)
        return
      }

      // 2. Checkout
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push('/dashboard/billing'), 1500)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Status banner */}
      {currentPriceCents != null && (
        <Card className="border-border/60 bg-muted/30">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Plano atual</p>
                <p className="font-bold text-lg tabular-nums">
                  {lockedPriceCents != null ? formatBRL(lockedPriceCents) : formatBRL(currentPriceCents)}/mês
                </p>
              </div>
            </div>
            {lockedPriceCents != null && (
              <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                <Lock className="w-3.5 h-3.5" />
                Preço travado (grandfathered)
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isAdmin && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 dark:text-amber-300 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900 dark:text-amber-100">
              Apenas administradores podem alterar o plano. Você está visualizando em modo somente leitura.
            </p>
          </CardContent>
        </Card>
      )}

      <PricingBuilder
        modules={modules}
        initialSelectedSlugs={initialSelectedSlugs}
        initialExtras={initialExtras}
        initialBilling={initialBilling}
        ctaLabel={submitting ? 'Salvando...' : success ? 'Salvo!' : 'Confirmar alteração'}
        onCta={onCta}
        ctaDisabled={!isAdmin || submitting}
      />
    </>
  )
}
