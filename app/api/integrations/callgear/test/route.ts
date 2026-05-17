import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { ping } from '@/lib/integrations/callgear-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organization: { select: { id: true, callgearApiKey: true } } },
  })
  const org = user?.organization
  const orgId = org?.id ?? ''
  const enc = org?.callgearApiKey
  if (!enc) return NextResponse.json({ error: 'API key não configurada' }, { status: 400 })
  try {
    const result = await ping({ apiKey: decrypt(enc) })
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'CALLGEAR',
        action: 'test:connection',
        status: 'SUCCESS',
        request: {} as never,
        response: { ok: true } as never,
      },
    }).catch(() => {})
    return NextResponse.json({ ok: true, result })
  } catch (err) {
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'CALLGEAR',
        action: 'test:connection',
        status: 'FAILED',
        request: {} as never,
        response: { error: err instanceof Error ? err.message : String(err) } as never,
      },
    }).catch(() => {})
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro' }, { status: 502 })
  }
}
