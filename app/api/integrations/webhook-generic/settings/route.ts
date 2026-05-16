import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const { enabled } = await req.json()
  if (typeof enabled !== 'boolean') {
    return NextResponse.json({ error: 'enabled é obrigatório' }, { status: 400 })
  }

  await prisma.organization.update({
    where: { id: user.organizationId },
    data: { webhookEnabled: enabled },
  })

  return NextResponse.json({ ok: true })
}
