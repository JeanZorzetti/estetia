import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateSecret } from '@/lib/integrations/webhook-validator'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const secret = generateSecret()

  await prisma.organization.update({
    where: { id: user.organizationId },
    data: { webhookSecret: secret, webhookEnabled: true },
  })

  return NextResponse.json({ ok: true, secret })
}
