import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { getStatus } from '@/lib/integrations/zapi-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          zapiInstanceId: true,
          zapiInstanceToken: true,
          zapiClientToken: true,
        },
      },
    },
  })

  const org = user?.organization
  if (!org?.zapiInstanceId || !org.zapiInstanceToken || !org.zapiClientToken) {
    return NextResponse.json({ error: 'Configuração incompleta' }, { status: 400 })
  }

  try {
    const status = await getStatus({
      instanceId: org.zapiInstanceId,
      instanceToken: decrypt(org.zapiInstanceToken),
      clientToken: decrypt(org.zapiClientToken),
    })
    return NextResponse.json({ ok: true, ...status })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao testar' },
      { status: 502 }
    )
  }
}
