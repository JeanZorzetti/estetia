import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { dispatchToZapier } from '@/lib/integrations/zapier-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: { select: { id: true, zapierWebhookUrl: true } },
    },
  })
  const org = user?.organization
  const orgId = org?.id ?? ''
  if (!org?.zapierWebhookUrl) {
    return NextResponse.json({ error: 'Webhook URL não configurado' }, { status: 400 })
  }

  try {
    await dispatchToZapier(org.zapierWebhookUrl, {
      event: 'test.connection',
      occurredAt: new Date().toISOString(),
      organizationId: orgId,
      data: { source: 'Estetia CRM', message: 'Teste de conexão Zapier' },
    })
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'ZAPIER',
        action: 'test:connection',
        status: 'SUCCESS',
        request: {} as never,
        response: { ok: true } as never,
      },
    }).catch(() => {})
    return NextResponse.json({ ok: true, result: { sent: true } })
  } catch (err) {
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'ZAPIER',
        action: 'test:connection',
        status: 'FAILED',
        request: {} as never,
        response: { error: err instanceof Error ? err.message : String(err) } as never,
      },
    }).catch(() => {})
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Falha no dispatch' },
      { status: 502 }
    )
  }
}
