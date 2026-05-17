import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { getUserInfo } from '@/lib/integrations/mercadopago-checkout-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: { select: { id: true, mpPaymentAccessToken: true } },
    },
  })

  const org = user?.organization
  const orgId = org?.id ?? ''
  if (!org?.mpPaymentAccessToken) {
    return NextResponse.json({ error: 'Access token não configurado' }, { status: 400 })
  }

  try {
    const accessToken = decrypt(org.mpPaymentAccessToken)
    const info = await getUserInfo({ accessToken })
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'MERCADOPAGO_CHECKOUT',
        action: 'test:connection',
        status: 'SUCCESS',
        request: {} as never,
        response: { ok: true } as never,
      },
    }).catch(() => {})
    return NextResponse.json({ ok: true, user: info })
  } catch (err) {
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'MERCADOPAGO_CHECKOUT',
        action: 'test:connection',
        status: 'FAILED',
        request: {} as never,
        response: { error: err instanceof Error ? err.message : String(err) } as never,
      },
    }).catch(() => {})
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao testar' },
      { status: 502 }
    )
  }
}
