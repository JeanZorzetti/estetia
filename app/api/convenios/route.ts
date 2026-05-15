import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ConvenioCreateSchema } from '@/lib/financeiro/schema'

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
  const operadoraId = searchParams.get('operadoraId')
  const procedureId = searchParams.get('procedureId')
  const q = searchParams.get('q')

  const where: Record<string, unknown> = { organizationId: orgId }
  if (operadoraId) where.operadoraId = operadoraId
  if (procedureId) where.procedureId = procedureId
  if (q) where.OR = [
    { codigoTuss: { contains: q } },
    { descricaoTuss: { contains: q, mode: 'insensitive' } },
  ]

  const convenios = await prisma.convenio.findMany({
    where,
    include: {
      operadora: { select: { id: true, nome: true, codigoAns: true } },
    },
    orderBy: [{ ativo: 'desc' }, { createdAt: 'desc' }],
    take: 200,
  })

  return NextResponse.json({
    convenios: convenios.map(c => ({
      ...c,
      valorNegociado: c.valorNegociado != null ? Number(c.valorNegociado) : null,
    })),
  })
}

export async function POST(req: Request) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = ConvenioCreateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const operadora = await prisma.operadora.findFirst({
    where: { id: parsed.data.operadoraId, organizationId: orgId },
    select: { id: true },
  })
  if (!operadora) return NextResponse.json({ error: 'Operadora not found' }, { status: 404 })

  const convenio = await prisma.convenio.create({
    data: {
      organizationId: orgId,
      operadoraId: parsed.data.operadoraId,
      procedureId: parsed.data.procedureId || null,
      codigoTuss: parsed.data.codigoTuss || null,
      descricaoTuss: parsed.data.descricaoTuss || null,
      valorNegociado: parsed.data.valorNegociado ?? null,
      porcentagemCo: parsed.data.porcentagemCo ?? null,
      vigenciaInicio: parsed.data.vigenciaInicio ? new Date(parsed.data.vigenciaInicio) : null,
      vigenciaFim: parsed.data.vigenciaFim ? new Date(parsed.data.vigenciaFim) : null,
      ativo: parsed.data.ativo,
    },
  })

  return NextResponse.json({
    convenio: { ...convenio, valorNegociado: convenio.valorNegociado != null ? Number(convenio.valorNegociado) : null },
  }, { status: 201 })
}
