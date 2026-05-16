import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { getAccount } from '@/lib/integrations/stripe-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: { stripeSecretKey: true },
      },
    },
  })

  const org = user?.organization
  if (!org?.stripeSecretKey) {
    return NextResponse.json({ error: 'Secret Key Stripe não configurada' }, { status: 400 })
  }

  try {
    const secretKey = decrypt(org.stripeSecretKey)
    const account = await getAccount({ secretKey })
    return NextResponse.json({ ok: true, account })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao conectar com Stripe' },
      { status: 400 }
    )
  }
}
