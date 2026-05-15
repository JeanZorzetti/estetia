import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { syncBidirectional } from '@/lib/agenda/google-sync'

async function getUser() {
  const session = await getSession()
  if (!session?.user?.email) return null
  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, orgRole: true },
  })
}

export async function GET() {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await prisma.organization.findUnique({
    where: { id: user.organizationId },
    select: { googleCalendarEnabled: true, googleCalendarEmail: true },
  })

  const pending = await prisma.treatmentSession.count({
    where: {
      organizationId: user.organizationId,
      googleSyncStatus: { in: ['PENDING', 'FAILED'] },
    },
  })

  return NextResponse.json({
    enabled: !!org?.googleCalendarEnabled,
    email: org?.googleCalendarEmail ?? null,
    pendingSessions: pending,
  })
}

export async function POST() {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const result = await syncBidirectional(user.organizationId)
  return NextResponse.json(result)
}
