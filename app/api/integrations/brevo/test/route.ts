import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createBrevoClient } from '@/lib/integrations/brevo-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: { brevoApiKey: true },
      },
    },
  })

  const org = user?.organization
  if (!org?.brevoApiKey) {
    return NextResponse.json({ error: 'API Key não configurada' }, { status: 400 })
  }

  try {
    const client = createBrevoClient(org.brevoApiKey)
    const account = await client.getAccountInfo()
    return NextResponse.json({ ok: true, account })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao conectar ao Brevo' },
      { status: 400 }
    )
  }
}
