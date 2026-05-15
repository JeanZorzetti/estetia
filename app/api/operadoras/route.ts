import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { OperadoraCreateSchema } from '@/lib/financeiro/schema'

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
  const q = searchParams.get('q')
  const tipo = searchParams.get('tipo')
  const ativo = searchParams.get('ativo')

  const where: Record<string, unknown> = { organizationId: orgId }
  if (q) where.nome = { contains: q, mode: 'insensitive' }
  if (tipo) where.tipo = tipo
  if (ativo !== null) where.ativo = ativo === 'true'

  const operadoras = await prisma.operadora.findMany({
    where,
    include: { _count: { select: { convenios: true, guias: true } } },
    orderBy: [{ ativo: 'desc' }, { nome: 'asc' }],
    take: 200,
  })
  return NextResponse.json({ operadoras })
}

export async function POST(req: Request) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = OperadoraCreateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const operadora = await prisma.operadora.create({
    data: {
      organizationId: orgId,
      nome: parsed.data.nome,
      codigoAns: parsed.data.codigoAns || null,
      cnpj: parsed.data.cnpj || null,
      tipo: parsed.data.tipo,
      contatoNome: parsed.data.contatoNome || null,
      contatoEmail: parsed.data.contatoEmail || null,
      contatoTelefone: parsed.data.contatoTelefone || null,
      prazoRepasseDias: parsed.data.prazoRepasseDias ?? null,
      ativo: parsed.data.ativo,
    },
  })
  return NextResponse.json({ operadora }, { status: 201 })
}
