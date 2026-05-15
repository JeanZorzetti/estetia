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

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [recebidoMes, aReceber, vencidos, glosado] = await Promise.all([
    prisma.guiaTiss.aggregate({
      where: { organizationId: orgId, status: 'PAGA', updatedAt: { gte: startOfMonth } },
      _sum: { valorTotal: true },
    }),
    prisma.guiaTiss.aggregate({
      where: { organizationId: orgId, status: { in: ['ENVIADA', 'AUTORIZADA'] } },
      _sum: { valorTotal: true },
    }),
    prisma.guiaTiss.aggregate({
      where: {
        organizationId: orgId,
        status: { in: ['ENVIADA', 'AUTORIZADA'] },
        dataExecucao: { lt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000) },
      },
      _sum: { valorTotal: true },
    }),
    prisma.guiaTiss.aggregate({
      where: { organizationId: orgId, status: 'GLOSADA', updatedAt: { gte: startOfMonth } },
      _sum: { valorTotal: true },
    }),
  ])

  return NextResponse.json({
    recebidoMes: Number(recebidoMes._sum.valorTotal ?? 0),
    aReceber: Number(aReceber._sum.valorTotal ?? 0),
    vencidos: Number(vencidos._sum.valorTotal ?? 0),
    glosado: Number(glosado._sum.valorTotal ?? 0),
  })
}
