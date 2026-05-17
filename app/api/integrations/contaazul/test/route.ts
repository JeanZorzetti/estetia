import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  refreshContaAzulToken,
  getContaAzulCompanyInfo,
} from '@/lib/integrations/contaazul-client'

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
          contaazulClientId: true,
          contaazulClientSecret: true,
          contaazulRefreshToken: true,
        },
      },
    },
  })
  const org = user?.organization
  const orgId = org?.id ?? ''
  const { contaazulClientId, contaazulClientSecret, contaazulRefreshToken } = org ?? {}
  if (!contaazulClientId || !contaazulClientSecret || !contaazulRefreshToken) {
    return NextResponse.json(
      { error: 'Client ID, Secret e Refresh Token obrigatórios' },
      { status: 400 }
    )
  }

  try {
    const tokens = await refreshContaAzulToken(
      contaazulClientId,
      contaazulClientSecret,
      contaazulRefreshToken
    )
    const info = await getContaAzulCompanyInfo(tokens.access_token).catch(() => null)
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'CONTAAZUL',
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
        company: info?.business_name ?? 'OAuth válido',
      },
    })
  } catch (err) {
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'CONTAAZUL',
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
