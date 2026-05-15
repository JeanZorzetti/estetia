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

  const grouped = await prisma.guiaTiss.groupBy({
    by: ['operadoraId'],
    where: { organizationId: orgId },
    _sum: { valorTotal: true },
    _count: { id: true },
    orderBy: { _sum: { valorTotal: 'desc' } },
    take: 20,
  })

  const operadoraIds = grouped.map(g => g.operadoraId)
  const operadoras = await prisma.operadora.findMany({
    where: { id: { in: operadoraIds } },
    select: { id: true, nome: true, tipo: true },
  })
  const om = Object.fromEntries(operadoras.map(o => [o.id, o]))

  const data = grouped.map(g => {
    const total = g._sum.valorTotal != null ? Number(g._sum.valorTotal) : 0
    const count = g._count.id || 1
    return {
      operadora: om[g.operadoraId]?.nome ?? 'Desconhecida',
      tipo: om[g.operadoraId]?.tipo ?? 'CONVENIO',
      total,
      guias: g._count.id,
      ticketMedio: total / count,
    }
  })

  return NextResponse.json({ data })
}
