import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const OperadoraSchema = z.object({
  nome: z.string().min(2),
  codigoAns: z.string().optional(),
  cnpj: z.string().optional(),
  tipo: z.enum(['CONVENIO', 'PARTICULAR', 'CORTESIA']).default('CONVENIO'),
  contatoNome: z.string().optional(),
  contatoEmail: z.string().email().optional().or(z.literal('')),
  contatoTelefone: z.string().optional(),
  prazoRepasseDias: z.number().int().positive().optional(),
})

// GET /api/clinica/operadoras — list all operadoras for the org
export async function GET(_req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const operadoras = await prisma.operadora.findMany({
    where: { organizationId: user.organizationId },
    include: {
      _count: { select: { convenios: true, guias: true } },
    },
    orderBy: { nome: 'asc' },
  })

  return NextResponse.json({ operadoras })
}

// POST /api/clinica/operadoras — create operadora
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const body = await req.json()
  const parsed = OperadoraSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const operadora = await prisma.operadora.create({
    data: { organizationId: user.organizationId, ...parsed.data },
  })

  return NextResponse.json({ operadora }, { status: 201 })
}
