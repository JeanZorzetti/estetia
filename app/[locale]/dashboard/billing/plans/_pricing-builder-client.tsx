'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { PricingBuilder, type BuilderState } from '@/components/pricing/pricing-builder'
import type { PricingModuleData } from '@/lib/pricing/modules'
import { formatBRL } from '@/lib/pricing/calculator'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface Props {
  modules: PricingModuleData[]
  initialSlugs: string[]
  initialExtras: { users: number; rooms: number; profs: number }
  initialBilling: 'MONTHLY' | 'YEARLY'
  activeModules: string[]
  currentTotalCents?: number
  hasSubscription: boolean
  orgCnpj?: string | null
}

export default function PricingBuilderClient({
  modules,
  initialSlugs,
  initialExtras,
  initialBilling,
  activeModules,
  currentTotalCents,
  hasSubscription,
  orgCnpj,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [pendingState, setPendingState] = useState<BuilderState | null>(null)
  const [cpfCnpj, setCpfCnpj] = useState(orgCnpj ?? '')

  const submitCheckout = async (state: BuilderState, cpfCnpjValue: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modules: state.selectedSlugs,
          cycle: state.billingPeriod === 'ANNUAL' ? 'YEARLY' : 'MONTHLY',
          cpfCnpj: cpfCnpjValue.replace(/\D/g, '') || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Erro ao processar assinatura')
        return
      }

      setPendingState(null)

      if (data.action === 'updated') {
        const msg = data.prorationR$ > 0
          ? `Plano atualizado! Cobrança proporcional de ${formatBRL(data.prorationR$ * 100)} gerada para hoje.`
          : 'Plano atualizado com sucesso!'
        toast.success(msg)
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

  const handleCta = async (state: BuilderState) => {
    // If org already has CNPJ saved, skip the modal
    if (orgCnpj) {
      await submitCheckout(state, orgCnpj)
    } else {
      setPendingState(state)
    }
  }

  const handleModalConfirm = async () => {
    if (!pendingState) return
    const cleaned = cpfCnpj.replace(/\D/g, '')
    if (cleaned.length !== 11 && cleaned.length !== 14) {
      toast.error('Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido')
      return
    }
    await submitCheckout(pendingState, cpfCnpj)
  }

  return (
    <>
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

      <Dialog open={!!pendingState} onOpenChange={(open) => { if (!open) setPendingState(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Identificação para cobrança</DialogTitle>
            <DialogDescription>
              O Asaas exige CPF ou CNPJ para emitir cobranças. Será salvo na sua organização.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <Label htmlFor="cpfcnpj">CPF ou CNPJ</Label>
            <Input
              id="cpfcnpj"
              placeholder="000.000.000-00 ou 00.000.000/0001-00"
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleModalConfirm() }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingState(null)}>Cancelar</Button>
            <Button onClick={handleModalConfirm} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar assinatura'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
