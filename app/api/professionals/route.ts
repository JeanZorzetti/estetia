import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfessionalCreateSchema } from '@/lib/profissionais/schema'

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
  const detailed = searchParams.get('detailed') === 'true'
  const q = searchParams.get('q')
  const ativo = searchParams.get('ativo')
  const conselho = searchParams.get('conselho')

  const where: Record<string, unknown> = { organizationId: user.organizationId }
  if (q) where.nome = { contains: q, mode: 'insensitive' }
  if (ativo !== null) where.ativo = ativo === 'true'
  if (conselho) where.conselho = conselho

  if (!detailed) {
    const professionals = await prisma.professional.findMany({
      where,
      select: { id: true, nome: true },
      orderBy: { nome: 'asc' },
    })
    return NextResponse.json({ professionals })
  }

  const professionals = await prisma.professional.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: [{ ativo: 'desc' }, { nome: 'asc' }],
    take: 200,
  })
  return NextResponse.json({ professionals })
}

export async function POST(req: Request) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.orgRole === 'MEMBER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const parsed = ProfessionalCreateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const d = parsed.data

  // Validate userId belongs to org if provided
  if (d.userId) {
    const userMatch = await prisma.user.findFirst({
      where: { id: d.userId, organizationId: user.organizationId },
      select: { id: true },
    })
    if (!userMatch) return NextResponse.json({ error: 'User not found in org' }, { status: 404 })
  }

  const professional = await prisma.professional.create({
    data: {
      organizationId: user.organizationId,
      userId: d.userId || null,
      nome: d.nome,
      conselho: d.conselho ?? null,
      numeroConselho: d.numeroConselho || null,
      ufConselho: d.ufConselho ? d.ufConselho.toUpperCase() : null,
      conselhoStatus: d.conselhoStatus || null,
      especialidades: d.especialidades,
      bio: d.bio || null,
      fotoUrl: d.fotoUrl || null,
      cargaHoraria: d.cargaHoraria ?? undefined,
      procedimentosHabilitadosIds: d.procedimentosHabilitadosIds,
      ativo: d.ativo,
    },
  })

  return NextResponse.json({ professional }, { status: 201 })
}
