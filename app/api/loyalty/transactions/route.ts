import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LoyaltyTransactionCreateSchema } from '@/lib/loyalty/schema'

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
  const patientId = searchParams.get('patientId')
  const tipo = searchParams.get('tipo')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const where: Record<string, unknown> = { organizationId: orgId }
  if (patientId) where.patientId = patientId
  if (tipo) where.tipo = tipo
  if (from || to) {
    where.createdAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    }
  }

  const transactions = await prisma.loyaltyTransaction.findMany({
    where,
    include: {
      patient: { select: { id: true, nome: true, telefone: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  return NextResponse.json({ transactions })
}

export async function POST(req: Request) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = LoyaltyTransactionCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const patient = await prisma.patient.findFirst({
    where: { id: parsed.data.patientId, organizationId: orgId },
    select: { id: true },
  })
  if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 })

  const pontos = parsed.data.tipo === 'GANHO'
    ? Math.abs(parsed.data.pontos)
    : -Math.abs(parsed.data.pontos)

  const transaction = await prisma.loyaltyTransaction.create({
    data: {
      organizationId: orgId,
      patientId: parsed.data.patientId,
      pontos,
      tipo: parsed.data.tipo,
      descricao: parsed.data.descricao || null,
    },
    include: {
      patient: { select: { id: true, nome: true } },
    },
  })
  return NextResponse.json({ transaction }, { status: 201 })
}
