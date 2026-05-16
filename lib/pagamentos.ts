/**
 * Payment gateway dispatch hook.
 * Called after a financial transaction is confirmed to trigger configured payment providers.
 * Failures are silenced so the main flow is never interrupted.
 */

import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'

export interface PaymentDispatchParams {
  organizationId: string
  amount: number
  description: string
  customerName: string
  customerEmail: string
  customerDocument?: string
}

export interface PaymentDispatchResult {
  provider: 'pagseguro' | 'pagarme' | 'stripe'
  chargeId?: string
  pixQrCode?: string
  checkoutUrl?: string
  error?: string
}

export async function dispatchPaymentCharge(
  params: PaymentDispatchParams
): Promise<PaymentDispatchResult | null> {
  const org = await prisma.organization.findUnique({
    where: { id: params.organizationId },
    select: {
      pagseguroEnabled: true,
      pagseguroToken: true,
      pagseguroEnvironment: true,
      pagarmeEnabled: true,
      pagarmeApiKey: true,
      pagarmeRecipientId: true,
      stripeEnabled: true,
      stripeSecretKey: true,
    },
  })

  if (!org) return null

  // Priority: PagSeguro → Pagar.me → Stripe
  if (org.pagseguroEnabled && org.pagseguroToken) {
    try {
      const { createPixCharge } = await import('./integrations/pagseguro-client')
      const token = decrypt(org.pagseguroToken)
      const environment = (org.pagseguroEnvironment ?? 'sandbox') as 'sandbox' | 'production'
      const charge = await createPixCharge(
        { token, environment },
        {
          reference_id: `estetia-${Date.now()}`,
          description: params.description,
          amount: { value: params.amount, currency: 'BRL' },
          payment_method: { type: 'PIX' },
          customer: {
            name: params.customerName,
            tax_id: params.customerDocument ?? '00000000000',
            email: params.customerEmail,
          },
        }
      )
      const pixLink = charge.qr_codes?.[0]?.links?.find((l) => l.type === 'text/plain')?.href
      return { provider: 'pagseguro', chargeId: charge.id, pixQrCode: pixLink }
    } catch (err) {
      return {
        provider: 'pagseguro',
        error: err instanceof Error ? err.message : 'Erro PagSeguro',
      }
    }
  }

  if (org.pagarmeEnabled && org.pagarmeApiKey) {
    try {
      const { createPixOrder } = await import('./integrations/pagarme-client')
      const apiKey = decrypt(org.pagarmeApiKey)
      const order = await createPixOrder(
        { apiKey, recipientId: org.pagarmeRecipientId ?? undefined },
        {
          customer: {
            name: params.customerName,
            email: params.customerEmail,
            document: params.customerDocument ?? '00000000000',
            type: 'individual',
          },
          items: [
            {
              amount: params.amount,
              description: params.description,
              quantity: 1,
              code: `estetia-${Date.now()}`,
            },
          ],
          amount: params.amount,
        }
      )
      const qrCode = order.charges?.[0]?.last_transaction?.qr_code_url
      return { provider: 'pagarme', chargeId: order.id, pixQrCode: qrCode }
    } catch (err) {
      return {
        provider: 'pagarme',
        error: err instanceof Error ? err.message : 'Erro Pagar.me',
      }
    }
  }

  if (org.stripeEnabled && org.stripeSecretKey) {
    try {
      const { createCheckoutSession } = await import('./integrations/stripe-client')
      const secretKey = decrypt(org.stripeSecretKey)
      const session = await createCheckoutSession(
        { secretKey },
        {
          amount: params.amount,
          currency: 'brl',
          description: params.description,
          successUrl: 'https://estetiacrm.com.br/dashboard?payment=success',
          cancelUrl: 'https://estetiacrm.com.br/dashboard?payment=cancelled',
          customerEmail: params.customerEmail,
        }
      )
      return { provider: 'stripe', chargeId: session.id, checkoutUrl: session.url ?? undefined }
    } catch (err) {
      return {
        provider: 'stripe',
        error: err instanceof Error ? err.message : 'Erro Stripe',
      }
    }
  }

  return null
}
