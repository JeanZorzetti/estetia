import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UpdateProcedureSchema } from '@/lib/procedures/schema'

type Params = { params: Promise<{ id: string }> }

async function getOrgId(): Promise<string | null> {
  const session = await getSession()
  if (!session?.user?.email) return null
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  return user?.organizationId ?? null
}

export async function GET(_req: NextRequest, { params }: Params) {
  const organizationId = await getOrgId()
  if (!organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const procedure = await prisma.procedure.findFirst({
    where: { id, organizationId },
  })
  if (!procedure) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    procedure: { ...procedure, valorPadrao: procedure.valorPadrao != null ? Number(procedure.valorPadrao) : null },
  })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const organizationId = await getOrgId()
  if (!organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await prisma.procedure.findFirst({ where: { id, organizationId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = UpdateProcedureSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const procedure = await prisma.procedure.update({
    where: { id },
    data: {
      ...(data.nome !== undefined && { nome: data.nome }),
      ...(data.categoria !== undefined && { categoria: data.categoria || null }),
      ...(data.descricao !== undefined && { descricao: data.descricao || null }),
      ...(data.duracaoMinutos !== undefined && { duracaoMinutos: data.duracaoMinutos }),
      ...(data.valorPadrao !== undefined && { valorPadrao: data.valorPadrao }),
      ...(data.contraindicacoesGerais !== undefined && { contraindicacoesGerais: data.contraindicacoesGerais }),
      ...(data.preCuidados !== undefined && { preCuidados: data.preCuidados || null }),
      ...(data.posCuidados !== undefined && { posCuidados: data.posCuidados || null }),
      ...(data.exigeAnamneseEspecifica !== undefined && { exigeAnamneseEspecifica: data.exigeAnamneseEspecifica }),
      ...(data.profissionaisHabilitadosIds !== undefined && { profissionaisHabilitadosIds: data.profissionaisHabilitadosIds }),
      ...(data.ativo !== undefined && { ativo: data.ativo }),
    },
  })

  return NextResponse.json({
    procedure: { ...procedure, valorPadrao: procedure.valorPadrao != null ? Number(procedure.valorPadrao) : null },
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const organizationId = await getOrgId()
  if (!organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await prisma.procedure.findFirst({ where: { id, organizationId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Soft delete — keep referential integrity with Treatment.procedureId
  await prisma.procedure.update({ where: { id }, data: { ativo: false } })

  return NextResponse.json({ ok: true })
}
