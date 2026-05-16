/**
 * Financial operations hook layer.
 *
 * Call confirmPayment() when a payment is confirmed in the system.
 * It dispatches NFS-e emission to whichever provider is enabled for the org.
 * Integration failures are silent — they never break the main payment flow.
 */

import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'

export interface PaymentConfirmedInput {
  organizationId: string
  tomadorNome: string
  tomadorCpfCnpj?: string
  tomadorEmail?: string
  discriminacao: string
  valorServicos: number
  codigoServico?: string
  aliquotaIss?: number
  issRetido?: boolean
}

export async function onPaymentConfirmed(input: PaymentConfirmedInput): Promise<void> {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: input.organizationId },
      select: {
        cnpj: true,
        inscricaoMunicipal: true,
        enotasEnabled: true,
        enotasApiKey: true,
        enotasCompanyId: true,
        nfeioEnabled: true,
        nfeioApiKey: true,
        nfeioCompanyId: true,
        plugnotasEnabled: true,
        plugnotasApiKey: true,
        plugnotasCnpj: true,
      },
    })

    if (!org) return

    const codigoServico = input.codigoServico ?? '14.01'
    const aliquotaIss = input.aliquotaIss ?? 0.05

    if (org.enotasEnabled && org.enotasApiKey && org.enotasCompanyId) {
      try {
        const { emitirNfse } = await import('@/lib/integrations/enotas-client')
        const apiKey = decrypt(org.enotasApiKey)
        await emitirNfse({ apiKey }, {
          companyId: org.enotasCompanyId,
          tomadorNome: input.tomadorNome,
          tomadorCpfCnpj: input.tomadorCpfCnpj,
          tomadorEmail: input.tomadorEmail,
          discriminacao: input.discriminacao,
          valorServicos: input.valorServicos,
          codigoServico,
          aliquotaIss,
          issRetido: input.issRetido,
        })
      } catch {
        // silent — NFS-e failure must not block payment confirmation
      }
      return
    }

    if (org.nfeioEnabled && org.nfeioApiKey && org.nfeioCompanyId) {
      try {
        const { emitirNfse } = await import('@/lib/integrations/nfeio-client')
        const apiKey = decrypt(org.nfeioApiKey)
        await emitirNfse({ apiKey, companyId: org.nfeioCompanyId }, {
          tomadorNome: input.tomadorNome,
          tomadorCpfCnpj: input.tomadorCpfCnpj,
          tomadorEmail: input.tomadorEmail,
          discriminacao: input.discriminacao,
          valorServicos: input.valorServicos,
          codigoServico,
          aliquotaIss,
          issRetido: input.issRetido,
        })
      } catch {
        // silent
      }
      return
    }

    if (org.plugnotasEnabled && org.plugnotasApiKey && org.plugnotasCnpj) {
      try {
        const { emitirNfse } = await import('@/lib/integrations/plugnotas-client')
        const apiKey = decrypt(org.plugnotasApiKey)
        await emitirNfse({ apiKey }, {
          cnpjPrestador: org.plugnotasCnpj,
          tomadorNome: input.tomadorNome,
          tomadorCpfCnpj: input.tomadorCpfCnpj,
          tomadorEmail: input.tomadorEmail,
          discriminacao: input.discriminacao,
          valorServicos: input.valorServicos,
          codigoServico,
          aliquotaIss,
          issRetido: input.issRetido,
        })
      } catch {
        // silent
      }
    }
  } catch {
    // silent — financial hook must never throw
  }
}
