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

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [total, exports, anons, topUsers, topPacientes, anomalias] = await Promise.all([
    prisma.medicalAccessLog.count({ where: { organizationId: orgId, createdAt: { gte: thirtyDaysAgo } } }),
    prisma.medicalAccessLog.count({ where: { organizationId: orgId, action: 'EXPORT', createdAt: { gte: thirtyDaysAgo } } }),
    prisma.medicalAccessLog.count({ where: { organizationId: orgId, action: 'ANONYMIZE', createdAt: { gte: thirtyDaysAgo } } }),
    prisma.medicalAccessLog.groupBy({
      by: ['userId'],
      where: { organizationId: orgId, createdAt: { gte: thirtyDaysAgo }, userId: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    }),
    prisma.medicalAccessLog.groupBy({
      by: ['pacienteId'],
      where: { organizationId: orgId, createdAt: { gte: thirtyDaysAgo } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    }),
    prisma.medicalAccessLog.groupBy({
      by: ['pacienteId'],
      where: { organizationId: orgId, createdAt: { gte: sevenDaysAgo } },
      _count: { id: true },
      having: { id: { _count: { gt: 50 } } },
    }),
  ])

  const userIds = topUsers.map(u => u.userId).filter(Boolean) as string[]
  const pacIds = [...new Set([...topPacientes.map(p => p.pacienteId), ...anomalias.map(a => a.pacienteId)])]
  const [users, pacientes] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true } }),
    prisma.patient.findMany({ where: { id: { in: pacIds } }, select: { id: true, nome: true } }),
  ])
  const userMap = Object.fromEntries(users.map(u => [u.id, u]))
  const pacMap = Object.fromEntries(pacientes.map(p => [p.id, p]))

  const topUser = topUsers[0]?.userId ? (userMap[topUsers[0].userId]?.name ?? '—') : '—'

  return NextResponse.json({
    total30d: total,
    exports30d: exports,
    anons30d: anons,
    topUserName: topUser,
    topUsers: topUsers.map(u => ({ user: userMap[u.userId!] ?? { id: u.userId, name: '—' }, count: u._count.id })),
    topPacientes: topPacientes.map(p => ({ paciente: pacMap[p.pacienteId] ?? { id: p.pacienteId, nome: '—' }, count: p._count.id })),
    anomalias: anomalias.map(a => ({ paciente: pacMap[a.pacienteId] ?? { id: a.pacienteId, nome: '—' }, count: a._count.id })),
  })
}
