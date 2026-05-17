import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createMailerLiteClient } from '@/lib/integrations/mailerlite-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: { mailerliteApiKey: true },
      },
    },
  })

  const org = user?.organization
  if (!org?.mailerliteApiKey) {
    return NextResponse.json({ error: 'API Key não configurada' }, { status: 400 })
  }

  try {
    const client = createMailerLiteClient(org.mailerliteApiKey)
    const account = await client.getAccountInfo()
    return NextResponse.json({ ok: true, account })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao conectar ao MailerLite' },
      { status: 400 }
    )
  }
}
