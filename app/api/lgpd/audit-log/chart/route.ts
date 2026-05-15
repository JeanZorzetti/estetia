import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function getOrgId() {
  const session = await getSession()
  if (!session?.user?.email) return null
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  return user?.organizationId ?? null
}

export async function GET() {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setHours(0, 0, 0, 0)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)

  const logs = await prisma.medicalAccessLog.findMany({
    where: { organizationId: orgId, createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true, action: true },
  })

  // Build 30-day buckets
  const buckets: Record<string, Record<string, number>> = {}
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo)
    d.setDate(d.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    buckets[key] = { VIEW: 0, CREATE: 0, UPDATE: 0, EXPORT: 0, DELETE: 0, ANONYMIZE: 0 }
  }

  for (const log of logs) {
    const key = log.createdAt.toISOString().slice(0, 10)
    if (!buckets[key]) continue
    buckets[key][log.action] = (buckets[key][log.action] ?? 0) + 1
  }

  const data = Object.entries(buckets).map(([date, counts]) => {
    const d = new Date(date)
    return {
      dia: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`,
      ...counts,
    }
  })

  return NextResponse.json({ data })
}
