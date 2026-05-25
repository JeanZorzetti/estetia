import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getUser() {
  const session = await getSession()
  if (!session?.user?.email) return null
  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
}

export async function GET(req: Request) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  if (!from || !to) {
    return NextResponse.json({ error: 'from and to required' }, { status: 400 })
  }

  const profissionalIds = searchParams.getAll('profissionalId')
  const salaIds = searchParams.getAll('salaId')
  const statuses = searchParams.getAll('status')

  const where: Record<string, unknown> = {
    organizationId: user.organizationId,
    dataAgendada: { gte: new Date(from), lte: new Date(to) },
  }
  if (profissionalIds.length > 0) where.profissionalId = { in: profissionalIds }
  if (salaIds.length > 0) where.salaId = { in: salaIds }
  if (statuses.length > 0) where.status = { in: statuses }

  const rawSessions = await prisma.treatmentSession.findMany({
    where,
    include: {
      profissional: { select: { id: true, nome: true } },
      sala: { select: { id: true, nome: true, cor: true } },
      treatment: {
        select: {
          id: true,
          valorTotal: true,
          sessoesPrevistas: true,
          sessoesRealizadas: true,
          paciente: { select: { id: true, nome: true, telefone: true, email: true } },
          procedure: { select: { id: true, nome: true, categoria: true, valorPadrao: true, duracaoMinutos: true } },
        },
      },
    },
    orderBy: { dataAgendada: 'asc' },
    take: 1000,
  })

  const sessions = rawSessions.map(s => ({
    ...s,
    treatment: {
      ...s.treatment,
      valorTotal: s.treatment.valorTotal !== null ? Number(s.treatment.valorTotal) : null,
      procedure: s.treatment.procedure ? {
        ...s.treatment.procedure,
        valorPadrao: s.treatment.procedure.valorPadrao !== null ? Number(s.treatment.procedure.valorPadrao) : null,
      } : null,
    },
  }))

  return NextResponse.json({ sessions })
}
