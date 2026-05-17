import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createMailchimpClient } from '@/lib/integrations/mailchimp-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: { mailchimpApiKey: true, mailchimpServer: true },
      },
    },
  })

  const org = user?.organization
  if (!org?.mailchimpApiKey || !org?.mailchimpServer) {
    return NextResponse.json({ error: 'API Key e servidor não configurados' }, { status: 400 })
  }

  try {
    const client = createMailchimpClient(org.mailchimpApiKey, org.mailchimpServer)
    const account = await client.getAccountInfo()
    return NextResponse.json({ ok: true, account })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao conectar ao Mailchimp' },
      { status: 400 }
    )
  }
}
