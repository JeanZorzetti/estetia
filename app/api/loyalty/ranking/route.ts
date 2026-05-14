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

  const grouped = await prisma.loyaltyTransaction.groupBy({
    by: ['patientId'],
    where: { organizationId: orgId },
    _sum: { pontos: true },
    orderBy: { _sum: { pontos: 'desc' } },
    take: 10,
  })

  const patientIds = grouped.map(g => g.patientId)
  const patients = await prisma.patient.findMany({
    where: { id: { in: patientIds } },
    select: { id: true, nome: true, telefone: true, fotoPerfil: true },
  })
  const patientMap = Object.fromEntries(patients.map(p => [p.id, p]))

  const ranking = grouped.map((g, index) => ({
    rank: index + 1,
    patient: patientMap[g.patientId] ?? { id: g.patientId, nome: '—', telefone: null, fotoPerfil: null },
    totalPontos: g._sum.pontos ?? 0,
  }))

  return NextResponse.json({ ranking })
}
