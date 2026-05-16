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
          contaazulClientId: true,
          contaazulClientSecret: true,
          contaazulRefreshToken: true,
        },
      },
    },
  })
  const { contaazulClientId, contaazulClientSecret, contaazulRefreshToken } =
    user?.organization ?? {}
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
    return NextResponse.json({
      ok: true,
      result: {
        tokenRefreshed: true,
        company: info?.business_name ?? 'OAuth válido',
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Falha ao validar OAuth' },
      { status: 502 }
    )
  }
}
