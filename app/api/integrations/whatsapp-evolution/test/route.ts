import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { getInstanceStatus } from '@/lib/integrations/evolution-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          id: true,
          evolutionBaseUrl: true,
          evolutionApiKey: true,
          evolutionInstance: true,
        },
      },
    },
  })

  const org = user?.organization
  const orgId = org?.id ?? ''
  if (!org?.evolutionBaseUrl || !org.evolutionApiKey || !org.evolutionInstance) {
    return NextResponse.json({ error: 'Configuração incompleta' }, { status: 400 })
  }

  try {
    const apiKey = decrypt(org.evolutionApiKey)
    const status = await getInstanceStatus({
      baseUrl: org.evolutionBaseUrl,
      apiKey,
      instance: org.evolutionInstance,
    })
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'WHATSAPP_EVOLUTION',
        action: 'test:connection',
        status: 'SUCCESS',
        request: {} as never,
        response: { ok: true } as never,
      },
    }).catch(() => {})
    return NextResponse.json({ ok: true, ...status })
  } catch (err) {
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'WHATSAPP_EVOLUTION',
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
