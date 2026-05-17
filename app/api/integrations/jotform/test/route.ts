import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getJotform } from '@/lib/integrations/jotform-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: { select: { id: true, jotformApiKey: true, jotformFormId: true } },
    },
  })
  const org = user?.organization
  const orgId = org?.id ?? ''
  const { jotformApiKey, jotformFormId } = org ?? {}
  if (!jotformApiKey || !jotformFormId) {
    return NextResponse.json({ error: 'API key e Form ID obrigatórios' }, { status: 400 })
  }

  try {
    const form = await getJotform(jotformApiKey, jotformFormId)
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'JOTFORM',
        action: 'test:connection',
        status: 'SUCCESS',
        request: {} as never,
        response: { ok: true, formTitle: form.title } as never,
      },
    }).catch(() => {})
    return NextResponse.json({ ok: true, result: { formTitle: form.title, status: form.status } })
  } catch (err) {
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'JOTFORM',
        action: 'test:connection',
        status: 'FAILED',
        request: {} as never,
        response: { error: err instanceof Error ? err.message : String(err) } as never,
      },
    }).catch(() => {})
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Falha ao consultar JotForm' },
      { status: 502 }
    )
  }
}
