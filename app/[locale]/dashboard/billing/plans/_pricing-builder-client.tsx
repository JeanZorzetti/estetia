'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { PricingBuilder, type BuilderState } from '@/components/pricing/pricing-builder'
import type { PricingModuleData } from '@/lib/pricing/modules'
import { formatBRL } from '@/lib/pricing/calculator'

interface Props {
  modules: PricingModuleData[]
  initialSlugs: string[]
  initialExtras: { users: number; rooms: number; profs: number }
  initialBilling: 'MONTHLY' | 'YEARLY'
  activeModules: string[]
  currentTotalCents?: number
  hasSubscription: boolean
}

export default function PricingBuilderClient({
  modules,
  initialSlugs,
  initialExtras,
  initialBilling,
  activeModules,
  currentTotalCents,
  hasSubscription,
}: Props) {
  const [loading, setLoading] = useState(false)

  const handleCta = async (state: BuilderState) => {
    setLoading(true)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modules: state.selectedSlugs,
          cycle: state.billingPeriod === 'ANNUAL' ? 'YEARLY' : 'MONTHLY',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Erro ao processar assinatura')
        return
      }

      if (data.action === 'updated') {
        const msg = data.prorationR$ > 0
          ? `Plano atualizado! Cobrança proporcional de ${formatBRL(data.prorationR$ * 100)} gerada para hoje.`
          : 'Plano atualizado com sucesso!'
        toast.success(msg)
        // Reload to reflect new state
        setTimeout(() => window.location.reload(), 1500)
      } else {
        toast.success(`Assinatura criada! Total: ${formatBRL((data.monthlyTotal ?? 0) * 100)}/mês`)
        setTimeout(() => window.location.reload(), 1500)
      }
    } catch {
      toast.error('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PricingBuilder
      modules={modules}
      initialSelectedSlugs={initialSlugs}
      initialExtras={initialExtras}
      initialBilling={initialBilling === 'YEARLY' ? 'ANNUAL' : 'MONTHLY'}
      onCta={handleCta}
      ctaDisabled={loading}
      mode="dashboard"
      activeModules={activeModules}
      currentTotalCents={currentTotalCents}
    />
  )
}
