import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendSlackMessage } from '@/lib/integrations/slack-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organization: { select: { id: true, slackWebhookUrl: true } } },
  })
  const url = user?.organization?.slackWebhookUrl
  const orgId = user?.organization?.id ?? ''
  if (!url) return NextResponse.json({ error: 'Webhook URL não configurado' }, { status: 400 })

  try {
    await sendSlackMessage(url, {
      text: '🔔 Estetia CRM — teste de conexão Slack',
      blocks: [
        { type: 'header', text: { type: 'plain_text', text: 'Estetia CRM' } },
        { type: 'section', text: { type: 'mrkdwn', text: 'Conexão estabelecida com sucesso ✅' } },
      ],
    })
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'SLACK',
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
        type: 'SLACK',
        action: 'test:connection',
        status: 'FAILED',
        request: {} as never,
        response: { error: err instanceof Error ? err.message : String(err) } as never,
      },
    }).catch(() => {})
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Falha ao enviar' },
      { status: 502 }
    )
  }
}
