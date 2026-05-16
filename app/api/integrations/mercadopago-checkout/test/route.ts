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
      organization: { select: { mpPaymentAccessToken: true } },
    },
  })

  const org = user?.organization
  if (!org?.mpPaymentAccessToken) {
    return NextResponse.json({ error: 'Access token não configurado' }, { status: 400 })
  }

  try {
    const accessToken = decrypt(org.mpPaymentAccessToken)
    const info = await getUserInfo({ accessToken })
    return NextResponse.json({ ok: true, user: info })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao testar' },
      { status: 502 }
    )
  }
}
