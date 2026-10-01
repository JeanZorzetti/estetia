import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'
import { validateStripeSignature } from '@/lib/integrations/webhook-validator'
import { sendLeadToRoihub } from '@/lib/roihub-crm'

// Stripe webhook for the "form with your logo" sale. Delivery is by hand, so "fulfilment" here
// means putting the paid order in front of the owner (roihub CRM) with the buyer's contact:
// the success page alone would lose every buyer who closes the tab before it loads.
// Events to subscribe: checkout.session.completed, checkout.session.async_payment_succeeded.
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    logger.error('[fichas] STRIPE_WEBHOOK_SECRET ausente: venda não será registrada')
    return NextResponse.json({ error: 'not configured' }, { status: 503 })
  }

  const payload = await request.text()
  if (!validateStripeSignature(payload, request.headers.get('stripe-signature'), secret)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(payload)
  const session = event?.data?.object
  const pago =
    (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') &&
    session?.payment_status === 'paid' &&
    session?.metadata?.produto === 'ficha-com-logo'

  const email = session?.customer_details?.email
  if (pago && email) {
    sendLeadToRoihub({
      nome: session.customer_details?.name || email,
      email,
      telefone: session.customer_details?.phone,
      origem: 'estetiacrm:ficha-com-logo',
      metadata: { ficha: session.metadata.ficha, stripeSession: session.id, valorCentavos: session.amount_total },
    })
  }

  return NextResponse.json({ received: true })
}
