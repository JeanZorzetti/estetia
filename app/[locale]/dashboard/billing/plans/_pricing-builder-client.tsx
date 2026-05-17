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

function validarCPF(cpf: string): boolean {
  if (/^(\d)\1{10}$/.test(cpf)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i)
  let r = 11 - (sum % 11); if (r >= 10) r = 0
  if (r !== parseInt(cpf[9])) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i)
  r = 11 - (sum % 11); if (r >= 10) r = 0
  return r === parseInt(cpf[10])
}

function validarCNPJ(cnpj: string): boolean {
  if (/^(\d)\1{13}$/.test(cnpj)) return false
  const calc = (c: string, w: number[]) =>
    w.reduce((s, v, i) => s + parseInt(c[i]) * v, 0)
  const w1 = [5,4,3,2,9,8,7,6,5,4,3,2]
  const w2 = [6,5,4,3,2,9,8,7,6,5,4,3,2]
  const d1 = 11 - (calc(cnpj, w1) % 11); const v1 = d1 >= 10 ? 0 : d1
  const d2 = 11 - (calc(cnpj, w2) % 11); const v2 = d2 >= 10 ? 0 : d2
  return v1 === parseInt(cnpj[12]) && v2 === parseInt(cnpj[13])
}

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
          extras: {
            users: state.extraUsers,
            rooms: state.extraRooms,
            profs: state.extraProfs,
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Erro ao processar assinatura')
        return
      }

      setPendingState(null)

      if (data.invoiceUrl) {
        toast.success('Redirecionando para o pagamento...')
        setTimeout(() => { window.location.href = data.invoiceUrl }, 800)
        return
      }

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
    if (cleaned.length === 11 && !validarCPF(cleaned)) {
      toast.error('CPF inválido — verifique os dígitos')
      return
    }
    if (cleaned.length === 14 && !validarCNPJ(cleaned)) {
      toast.error('CNPJ inválido — verifique os dígitos')
      return
    }
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
