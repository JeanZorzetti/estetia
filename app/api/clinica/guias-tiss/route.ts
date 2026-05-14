import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createGuiaConsulta, createGuiaSadt } from '@/lib/integrations/tiss/guia-service'
import { z } from 'zod'

const GuiaConsultaSchema = z.object({
  tipo: z.literal('CONSULTA'),
  operadoraId: z.string().uuid(),
  pacienteId: z.string().uuid(),
  sessionId: z.string().uuid().optional(),
  dataExecucao: z.string().datetime(),
  codigoTuss: z.string().min(1),
  descricaoTuss: z.string(),
  valorProcedimento: z.number().positive(),
  // TISS structural
  registroANS: z.string().length(6),
  codigoPrestador: z.string(),
  nomeContratado: z.string(),
  numeroBeneficiario: z.string(),
  nomePaciente: z.string(),
  dataNascimentoPaciente: z.string(),
  nomeProfissional: z.string(),
  conselhoProfissional: z.string(),
  numeroCRM: z.string(),
  ufCRM: z.string().length(2),
})

const GuiaSadtSchema = z.object({
  tipo: z.literal('SADT'),
  operadoraId: z.string().uuid(),
  pacienteId: z.string().uuid(),
  sessionId: z.string().uuid().optional(),
  dataExecucao: z.string().datetime(),
  registroANS: z.string().length(6),
  codigoPrestador: z.string(),
  nomeContratado: z.string(),
  cnes: z.string().optional(),
  numeroBeneficiario: z.string(),
  nomePaciente: z.string(),
  dataNascimentoPaciente: z.string(),
  nomeProfissional: z.string(),
  conselhoProfissional: z.string(),
  numeroCRM: z.string(),
  ufCRM: z.string().length(2),
  procedimentos: z.array(z.object({
    codigoTuss: z.string(),
    descricao: z.string(),
    quantidade: z.number().int().positive(),
    valorUnitario: z.number().positive(),
  })).min(1),
})

const CreateGuiaSchema = z.discriminatedUnion('tipo', [GuiaConsultaSchema, GuiaSadtSchema])

// GET /api/clinica/guias-tiss
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const operadoraId = searchParams.get('operadoraId')
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const limit = 20

  const guias = await prisma.guiaTiss.findMany({
    where: {
      organizationId: user.organizationId,
      ...(status ? { status: status as 'RASCUNHO' } : {}),
      ...(operadoraId ? { operadoraId } : {}),
    },
    include: {
      operadora: { select: { nome: true, codigoAns: true } },
      paciente: { select: { nome: true } },
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  })

  const total = await prisma.guiaTiss.count({
    where: {
      organizationId: user.organizationId,
      ...(status ? { status: status as 'RASCUNHO' } : {}),
      ...(operadoraId ? { operadoraId } : {}),
    },
  })

  return NextResponse.json({
    guias: guias.map((g: typeof guias[number]) => ({
      ...g,
      valorProcedimento: g.valorProcedimento ? Number(g.valorProcedimento) : null,
      valorTotal: g.valorTotal ? Number(g.valorTotal) : null,
    })),
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  })
}

// POST /api/clinica/guias-tiss — generate guia XML
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const body = await req.json()
  const parsed = CreateGuiaSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data

  // Verify operadora belongs to org
  const op = await prisma.operadora.findFirst({
    where: { id: data.operadoraId, organizationId: user.organizationId },
    select: { id: true },
  })
  if (!op) return NextResponse.json({ error: 'Operadora not found' }, { status: 404 })

  let guia
  if (data.tipo === 'CONSULTA') {
    guia = await createGuiaConsulta({
      organizationId: user.organizationId,
      ...data,
      dataExecucao: new Date(data.dataExecucao),
    })
  } else {
    guia = await createGuiaSadt({
      organizationId: user.organizationId,
      ...data,
      dataExecucao: new Date(data.dataExecucao),
    })
  }

  return NextResponse.json({ guia }, { status: 201 })
}
