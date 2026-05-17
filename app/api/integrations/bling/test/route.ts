import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { refreshBlingToken, getBlingCompany } from '@/lib/integrations/bling-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          id: true,
          blingClientId: true,
          blingClientSecret: true,
          blingRefreshToken: true,
        },
      },
    },
  })
  const org = user?.organization
  const orgId = org?.id ?? ''
  const { blingClientId, blingClientSecret, blingRefreshToken } = org ?? {}
  if (!blingClientId || !blingClientSecret || !blingRefreshToken) {
    return NextResponse.json(
      { error: 'Client ID, Secret e Refresh Token obrigatórios' },
      { status: 400 }
    )
  }

  try {
    const tokens = await refreshBlingToken(
      blingClientId,
      blingClientSecret,
      blingRefreshToken
    )
    const info = await getBlingCompany(tokens.access_token).catch(() => null)
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'BLING',
        action: 'test:connection',
        status: 'SUCCESS',
        request: {} as never,
        response: { ok: true, tokenRefreshed: true } as never,
      },
    }).catch(() => {})
    return NextResponse.json({
      ok: true,
      result: {
        tokenRefreshed: true,
        company: info?.data?.nome ?? 'OAuth válido',
      },
    })
  } catch (err) {
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'BLING',
        action: 'test:connection',
        status: 'FAILED',
        request: {} as never,
        response: { error: err instanceof Error ? err.message : String(err) } as never,
      },
    }).catch(() => {})
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Falha ao validar OAuth' },
      { status: 502 }
    )
  }
}
