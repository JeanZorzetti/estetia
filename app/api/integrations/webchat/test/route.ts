import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { buildEmbedSnippet } from '@/lib/integrations/webchat-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organization: { select: { id: true, webchatWidgetSecret: true } } },
  })

  const org = user?.organization
  const orgId = org?.id ?? ''
  const secret = org?.webchatWidgetSecret
  if (!secret) {
    return NextResponse.json({ error: 'Widget não gerado ainda' }, { status: 400 })
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'https://estetiacrm.com.br'
  const snippet = buildEmbedSnippet(secret, origin)
  await prisma.integrationLog.create({
    data: {
      organizationId: orgId,
      type: 'WEBCHAT',
      action: 'test:connection',
      status: 'SUCCESS',
      request: {} as never,
      response: { ok: true } as never,
    },
  }).catch(() => {})
  return NextResponse.json({ ok: true, snippet })
}
