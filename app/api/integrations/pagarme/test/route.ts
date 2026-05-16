import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { getAccount } from '@/lib/integrations/pagarme-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: { pagarmeApiKey: true, pagarmeRecipientId: true },
      },
    },
  })

  const org = user?.organization
  if (!org?.pagarmeApiKey) {
    return NextResponse.json({ error: 'API Key Pagar.me não configurada' }, { status: 400 })
  }

  try {
    const apiKey = decrypt(org.pagarmeApiKey)
    const account = await getAccount({ apiKey, recipientId: org.pagarmeRecipientId ?? undefined })
    return NextResponse.json({ ok: true, account })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao conectar com Pagar.me' },
      { status: 400 }
    )
  }
}
