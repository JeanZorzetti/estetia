import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SalaCreateSchema } from '@/lib/salas/schema'

export const dynamic = 'force-dynamic'

async function getUser() {
  const session = await getSession()
  if (!session?.user?.email) return null
  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, orgRole: true },
  })
}

export async function GET(req: Request) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  const tipo = searchParams.get('tipo')
  const ativo = searchParams.get('ativo')

  const where: Record<string, unknown> = { organizationId: user.organizationId }
  if (q) where.nome = { contains: q, mode: 'insensitive' }
  if (tipo) where.tipo = tipo
  if (ativo !== null) where.ativo = ativo === 'true'

  const salas = await prisma.clinicRoom.findMany({
    where,
    orderBy: [{ ativo: 'desc' }, { nome: 'asc' }],
    take: 200,
  })
  return NextResponse.json({ salas })
}

export async function POST(req: Request) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.orgRole === 'MEMBER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const parsed = SalaCreateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const d = parsed.data

  const sala = await prisma.clinicRoom.create({
    data: {
      organizationId: user.organizationId,
      nome: d.nome,
      tipo: d.tipo,
      equipamentos: d.equipamentos,
      cor: d.cor || null,
      capacidade: d.capacidade ?? null,
      disponibilidade: d.disponibilidade ?? undefined,
      ativo: d.ativo,
    },
  })

  return NextResponse.json({ sala }, { status: 201 })
}
