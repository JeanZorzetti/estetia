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

function csvEscape(v: unknown): string {
  if (v == null) return ''
  const s = String(v)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export async function GET(req: Request) {
  const orgId = await getOrgId()
  if (!orgId) return new Response('Unauthorized', { status: 401 })

  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const where: Record<string, unknown> = { organizationId: orgId }
  if (action) where.action = action
  if (from || to) {
    where.createdAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    }
  }

  const logs = await prisma.medicalAccessLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 5000,
  })

  const userIds = [...new Set(logs.map(l => l.userId).filter(Boolean) as string[])]
  const pacIds = [...new Set(logs.map(l => l.pacienteId))]
  const [users, pacientes] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true } }),
    prisma.patient.findMany({ where: { id: { in: pacIds } }, select: { id: true, nome: true } }),
  ])
  const userMap = Object.fromEntries(users.map(u => [u.id, u]))
  const pacMap = Object.fromEntries(pacientes.map(p => [p.id, p]))

  const headers = ['Data/Hora', 'Usuário', 'Paciente', 'Tipo', 'Ação', 'Registro ID', 'IP']
  const rows = logs.map(l => [
    l.createdAt.toISOString(),
    l.userId ? userMap[l.userId]?.name ?? l.userId : 'Sistema',
    pacMap[l.pacienteId]?.nome ?? l.pacienteId,
    l.recordType,
    l.action,
    l.recordId,
    l.ipAddress ?? '—',
  ])

  const csv = [headers.join(','), ...rows.map(r => r.map(csvEscape).join(','))].join('\n')
  const bom = '﻿'

  return new Response(bom + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="audit-log-${Date.now()}.csv"`,
    },
  })
}
