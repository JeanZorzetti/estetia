import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { getMe } from '@/lib/integrations/zoom-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: { id: true, zoomAccountId: true, zoomClientId: true, zoomClientSecret: true },
      },
    },
  })

  const org = user?.organization
  const orgId = org?.id ?? ''
  if (!org?.zoomAccountId || !org.zoomClientId || !org.zoomClientSecret) {
    return NextResponse.json({ error: 'Credenciais Zoom incompletas' }, { status: 400 })
  }

  try {
    const clientSecret = decrypt(org.zoomClientSecret)
    const me = await getMe({
      accountId: org.zoomAccountId,
      clientId: org.zoomClientId,
      clientSecret,
    })
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'ZOOM',
        action: 'test:connection',
        status: 'SUCCESS',
        request: {} as never,
        response: { ok: true } as never,
      },
    }).catch(() => {})
    return NextResponse.json({ ok: true, user: me })
  } catch (err) {
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'ZOOM',
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
