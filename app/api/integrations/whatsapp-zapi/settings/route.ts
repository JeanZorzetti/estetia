import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/encryption'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const body = await req.json()
  const { enabled, instanceId, instanceToken, clientToken } = body as {
    enabled?: boolean
    instanceId?: string
    instanceToken?: string
    clientToken?: string
  }

  const data: Record<string, unknown> = {}
  if (typeof enabled === 'boolean') data.zapiEnabled = enabled
  if (typeof instanceId === 'string') data.zapiInstanceId = instanceId.trim() || null
  if (typeof instanceToken === 'string' && instanceToken && !instanceToken.startsWith('•')) {
    data.zapiInstanceToken = encrypt(instanceToken)
  }
  if (typeof clientToken === 'string' && clientToken && !clientToken.startsWith('•')) {
    data.zapiClientToken = encrypt(clientToken)
  }

  await prisma.organization.update({
    where: { id: user.organizationId },
    data,
  })

  return NextResponse.json({ ok: true })
}
