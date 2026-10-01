import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'
import { billingRateLimit } from '@/lib/ratelimit'
import { createCheckoutSession } from '@/lib/integrations/stripe-client'
import { FICHAS_BASE_PATH, FICHA_COM_LOGO, fichaPath, getFicha } from '@/config/fichas-anamnese'

// One-off sale of an anamnesis form with the buyer's logo. The price comes from the server
// config, never from the request. Delivery is by hand; the webhook next door reports the sale.
export async function POST(request: NextRequest) {
  const blocked = await billingRateLimit(request)
  if (blocked) return blocked

  const body = await request.json().catch(() => null)
  const ficha = getFicha(String(body?.slug ?? ''))
  if (!ficha) return NextResponse.json({ error: 'Ficha não encontrada.' }, { status: 404 })

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey || secretKey.includes('dummy')) {
    logger.error('[fichas] STRIPE_SECRET_KEY ausente: checkout da ficha com logo indisponível')
    return NextResponse.json({ error: 'Pagamento indisponível no momento.' }, { status: 503 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://estetiacrm.com.br'
  try {
    const session = await createCheckoutSession(
      { secretKey },
      {
        amount: FICHA_COM_LOGO.centavos,
        currency: 'brl',
        description: `${ficha.nome} com a sua logo (PDF)`,
        successUrl: `${appUrl}${FICHAS_BASE_PATH}/obrigado`,
        cancelUrl: `${appUrl}${fichaPath(ficha.slug)}#com-a-sua-logo`,
        extra: {
          locale: 'pt-BR',
          'metadata[produto]': 'ficha-com-logo',
          'metadata[ficha]': ficha.slug,
          // The buyer is reached on WhatsApp to send the logo.
          'phone_number_collection[enabled]': 'true',
        },
      }
    )
    if (!session.url) throw new Error('Stripe returned a session without url')
    return NextResponse.json({ url: session.url })
  } catch (err) {
    logger.error({ err }, '[fichas] falha ao criar a sessão de checkout')
    return NextResponse.json({ error: 'Pagamento indisponível no momento.' }, { status: 502 })
  }
}
