import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { dispatchToMake } from '@/lib/integrations/make-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: { select: { id: true, makeWebhookUrl: true } },
    },
  })
  const org = user?.organization
  if (!org?.makeWebhookUrl) {
    return NextResponse.json({ error: 'Webhook URL não configurado' }, { status: 400 })
  }

  try {
    await dispatchToMake(org.makeWebhookUrl, {
      event: 'test.connection',
      occurredAt: new Date().toISOString(),
      organizationId: org.id,
      data: { source: 'Estetia CRM', message: 'Teste de conexão Make' },
    })
    return NextResponse.json({ ok: true, result: { sent: true } })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Falha no dispatch' },
      { status: 502 }
    )
  }
}
