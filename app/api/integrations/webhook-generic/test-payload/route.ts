import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  await prisma.integrationLog.create({
    data: {
      organizationId: user.organizationId,
      type: 'WEBHOOK_GENERIC',
      action: 'test.simulated',
      status: 'SUCCESS',
      request: { source: 'ui-test-button' } as never,
    },
  }).catch(() => {})

  return NextResponse.json({ ok: true })
}
