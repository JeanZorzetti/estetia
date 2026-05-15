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

export async function GET(req: Request) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const pacienteId = searchParams.get('pacienteId')
  const action = searchParams.get('action')
  const recordType = searchParams.get('recordType')
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') ?? 50)))

  const where: Record<string, unknown> = { organizationId: orgId }
  if (userId) where.userId = userId
  if (pacienteId) where.pacienteId = pacienteId
  if (action) where.action = action
  if (recordType) where.recordType = recordType
  if (from || to) {
    where.createdAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    }
  }

  const [logs, total] = await Promise.all([
    prisma.medicalAccessLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.medicalAccessLog.count({ where }),
  ])

  // Hydrate user + paciente names
  const userIds = [...new Set(logs.map(l => l.userId).filter(Boolean) as string[])]
  const pacienteIds = [...new Set(logs.map(l => l.pacienteId))]
  const [users, pacientes] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true } }),
    prisma.patient.findMany({ where: { id: { in: pacienteIds } }, select: { id: true, nome: true } }),
  ])
  const userMap = Object.fromEntries(users.map(u => [u.id, u]))
  const pacienteMap = Object.fromEntries(pacientes.map(p => [p.id, p]))

  const hydrated = logs.map(l => ({
    ...l,
    user: l.userId ? userMap[l.userId] ?? null : null,
    paciente: pacienteMap[l.pacienteId] ?? null,
  }))

  return NextResponse.json({ logs: hydrated, total, page, pageSize })
}
