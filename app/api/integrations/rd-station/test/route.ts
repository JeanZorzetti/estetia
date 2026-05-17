import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createRDStationClient } from '@/lib/integrations/rd-station-client'

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
          rdStationClientId: true,
          rdStationClientSecret: true,
          rdStationRefreshToken: true,
        },
      },
    },
  })

  const org = user?.organization
  if (!org?.rdStationClientId || !org?.rdStationClientSecret || !org?.rdStationRefreshToken) {
    return NextResponse.json({ error: 'Credenciais OAuth incompletas' }, { status: 400 })
  }

  try {
    const client = createRDStationClient(
      org.rdStationClientId,
      org.rdStationClientSecret,
      org.rdStationRefreshToken
    )
    const account = await client.getAccountInfo()
    return NextResponse.json({ ok: true, account })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao conectar ao RD Station' },
      { status: 400 }
    )
  }
}
