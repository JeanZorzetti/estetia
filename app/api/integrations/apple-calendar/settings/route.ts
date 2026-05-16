import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, organization: { select: { appleCalendarFeedSecret: true } } },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const { enabled, regenerate } = await req.json()
  const data: Record<string, unknown> = {}
  if (typeof enabled === 'boolean') data.appleCalendarEnabled = enabled
  if (regenerate === true || !user.organization?.appleCalendarFeedSecret) {
    data.appleCalendarFeedSecret = crypto.randomBytes(16).toString('hex')
  }
  const updated = await prisma.organization.update({
    where: { id: user.organizationId },
    data,
    select: { appleCalendarFeedSecret: true },
  })
  return NextResponse.json({ ok: true, feedSecret: updated.appleCalendarFeedSecret })
}
