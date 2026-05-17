import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { getAccountInfo } from '@/lib/integrations/viber-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organization: { select: { id: true, viberAuthToken: true } } },
  })

  const org = user?.organization
  const orgId = org?.id ?? ''
  if (!org?.viberAuthToken) {
    return NextResponse.json({ error: 'Token Viber não configurado' }, { status: 400 })
  }

  try {
    const authToken = decrypt(org.viberAuthToken)
    const account = await getAccountInfo({ authToken })
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'VIBER',
        action: 'test:connection',
        status: 'SUCCESS',
        request: {} as never,
        response: { ok: true } as never,
      },
    }).catch(() => {})
    return NextResponse.json({ ok: true, account })
  } catch (err) {
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'VIBER',
        action: 'test:connection',
        status: 'FAILED',
        request: {} as never,
        response: { error: err instanceof Error ? err.message : String(err) } as never,
      },
    }).catch(() => {})
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao testar' },
      { status: 502 }
    )
  }
}
