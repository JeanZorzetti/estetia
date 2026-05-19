import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GuiaTissCreateSchema } from '@/lib/financeiro/schema'
import { requireModule } from '@/lib/guards/require-module'

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
  const gate = await requireModule('tiss')
  if (!gate.allowed) return NextResponse.json({ error: 'Módulo TISS não está ativo' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const operadoraId = searchParams.get('operadoraId')
  const q = searchParams.get('q')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const where: Record<string, unknown> = { organizationId: orgId }
  if (status) where.status = status
  if (operadoraId) where.operadoraId = operadoraId
  if (q) where.numeroGuia = { contains: q, mode: 'insensitive' }
  if (from || to) {
    where.dataExecucao = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    }
  }

  const guias = await prisma.guiaTiss.findMany({
    where,
    include: {
      operadora: { select: { id: true, nome: true } },
      paciente: { select: { id: true, nome: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  return NextResponse.json({
    guias: guias.map(g => ({
      ...g,
      valorProcedimento: g.valorProcedimento != null ? Number(g.valorProcedimento) : null,
      valorTotal: g.valorTotal != null ? Number(g.valorTotal) : null,
    })),
  })
}

export async function POST(req: Request) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const gate = await requireModule('tiss')
  if (!gate.allowed) return NextResponse.json({ error: 'Módulo TISS não está ativo' }, { status: 403 })

  const body = await req.json()
  const parsed = GuiaTissCreateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  // Verify operadora + paciente belong to org
  const [operadora, paciente] = await Promise.all([
    prisma.operadora.findFirst({ where: { id: parsed.data.operadoraId, organizationId: orgId }, select: { id: true } }),
    prisma.patient.findFirst({ where: { id: parsed.data.pacienteId, organizationId: orgId }, select: { id: true } }),
  ])
  if (!operadora) return NextResponse.json({ error: 'Operadora not found' }, { status: 404 })
  if (!paciente) return NextResponse.json({ error: 'Paciente not found' }, { status: 404 })

  const guia = await prisma.guiaTiss.create({
    data: {
      organizationId: orgId,
      operadoraId: parsed.data.operadoraId,
      pacienteId: parsed.data.pacienteId,
      sessionId: parsed.data.sessionId || null,
      tipo: parsed.data.tipo,
      numeroGuia: parsed.data.numeroGuia || null,
      codigoTuss: parsed.data.codigoTuss || null,
      valorProcedimento: parsed.data.valorProcedimento ?? null,
      valorTotal: parsed.data.valorTotal ?? parsed.data.valorProcedimento ?? null,
      dataExecucao: parsed.data.dataExecucao ? new Date(parsed.data.dataExecucao) : null,
    },
  })

  return NextResponse.json({
    guia: {
      ...guia,
      valorProcedimento: guia.valorProcedimento != null ? Number(guia.valorProcedimento) : null,
      valorTotal: guia.valorTotal != null ? Number(guia.valorTotal) : null,
    },
  }, { status: 201 })
}
