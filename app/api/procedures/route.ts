import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CreateProcedureSchema } from '@/lib/procedures/schema'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const { searchParams } = req.nextUrl
  const q = searchParams.get('q')?.trim()
  const categoria = searchParams.get('categoria')?.trim()
  const ativoParam = searchParams.get('ativo')

  const where = {
    organizationId: user.organizationId,
    ...(q && {
      nome: { contains: q, mode: 'insensitive' as const },
    }),
    ...(categoria && { categoria }),
    ...(ativoParam !== null && ativoParam !== '' && { ativo: ativoParam === 'true' }),
  }

  const procedures = await prisma.procedure.findMany({
    where,
    orderBy: [{ ativo: 'desc' }, { nome: 'asc' }],
  })

  return NextResponse.json({
    procedures: procedures.map(p => ({
      ...p,
      valorPadrao: p.valorPadrao != null ? Number(p.valorPadrao) : null,
    })),
  })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const body = await req.json()
  const parsed = CreateProcedureSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const { nome, categoria, descricao, duracaoMinutos, valorPadrao, contraindicacoesGerais, preCuidados, posCuidados, exigeAnamneseEspecifica, profissionaisHabilitadosIds, ativo } = parsed.data

  const procedure = await prisma.procedure.create({
    data: {
      organizationId: user.organizationId,
      nome,
      categoria: categoria || null,
      descricao: descricao || null,
      duracaoMinutos,
      valorPadrao: valorPadrao ?? null,
      contraindicacoesGerais: contraindicacoesGerais ?? [],
      preCuidados: preCuidados || null,
      posCuidados: posCuidados || null,
      exigeAnamneseEspecifica,
      profissionaisHabilitadosIds: profissionaisHabilitadosIds ?? [],
      ativo,
    },
  })

  return NextResponse.json({
    procedure: { ...procedure, valorPadrao: procedure.valorPadrao != null ? Number(procedure.valorPadrao) : null },
  }, { status: 201 })
}
