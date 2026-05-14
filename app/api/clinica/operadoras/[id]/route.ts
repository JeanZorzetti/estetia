import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const UpdateOperadoraSchema = z.object({
  nome: z.string().min(2).optional(),
  codigoAns: z.string().optional(),
  cnpj: z.string().optional(),
  tipo: z.enum(['CONVENIO', 'PARTICULAR', 'CORTESIA']).optional(),
  contatoNome: z.string().optional(),
  contatoEmail: z.string().email().optional().or(z.literal('')),
  contatoTelefone: z.string().optional(),
  prazoRepasseDias: z.number().int().positive().optional(),
  ativo: z.boolean().optional(),
})

const ConvenioSchema = z.object({
  procedureId: z.string().uuid().optional(),
  codigoTuss: z.string().min(1),
  descricaoTuss: z.string().optional(),
  valorNegociado: z.number().positive(),
  porcentagemCo: z.number().min(0).max(100).optional(),
  vigenciaInicio: z.string().datetime().optional(),
  vigenciaFim: z.string().datetime().optional(),
})

// GET /api/clinica/operadoras/[id] — details + convenios
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const operadora = await prisma.operadora.findFirst({
    where: { id, organizationId: user.organizationId },
    include: {
      convenios: { orderBy: { codigoTuss: 'asc' } },
      guias: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          tipo: true,
          status: true,
          numeroGuia: true,
          valorTotal: true,
          dataExecucao: true,
          nfseNumero: true,
          nfseStatus: true,
        },
      },
    },
  })

  if (!operadora) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ operadora })
}

// PATCH /api/clinica/operadoras/[id] — update operadora
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const body = await req.json()
  const parsed = UpdateOperadoraSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const operadora = await prisma.operadora.updateMany({
    where: { id, organizationId: user.organizationId },
    data: parsed.data,
  })

  if (operadora.count === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}

// POST /api/clinica/operadoras/[id] — add convenio to operadora
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const operadora = await prisma.operadora.findFirst({
    where: { id, organizationId: user.organizationId },
    select: { id: true },
  })
  if (!operadora) return NextResponse.json({ error: 'Operadora not found' }, { status: 404 })

  const body = await req.json()
  const parsed = ConvenioSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const convenio = await prisma.convenio.create({
    data: {
      organizationId: user.organizationId,
      operadoraId: id,
      ...parsed.data,
      valorNegociado: parsed.data.valorNegociado,
      vigenciaInicio: parsed.data.vigenciaInicio ? new Date(parsed.data.vigenciaInicio) : undefined,
      vigenciaFim: parsed.data.vigenciaFim ? new Date(parsed.data.vigenciaFim) : undefined,
    },
  })

  return NextResponse.json({ convenio }, { status: 201 })
}
