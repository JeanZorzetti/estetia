import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfessionalUpdateSchema } from '@/lib/profissionais/schema'

async function getUser() {
  const session = await getSession()
  if (!session?.user?.email) return null
  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, orgRole: true },
  })
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const professional = await prisma.professional.findFirst({
    where: { id, organizationId: user.organizationId },
    include: { user: { select: { id: true, name: true, email: true } } },
  })
  if (!professional) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ professional })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.orgRole === 'MEMBER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const existing = await prisma.professional.findFirst({
    where: { id, organizationId: user.organizationId },
    select: { id: true },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = ProfessionalUpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const d = parsed.data

  if (d.userId) {
    const userMatch = await prisma.user.findFirst({
      where: { id: d.userId, organizationId: user.organizationId },
      select: { id: true },
    })
    if (!userMatch) return NextResponse.json({ error: 'User not found in org' }, { status: 404 })
  }

  const data: Record<string, unknown> = {}
  if (d.nome !== undefined) data.nome = d.nome
  if (d.conselho !== undefined) data.conselho = d.conselho ?? null
  if (d.numeroConselho !== undefined) data.numeroConselho = d.numeroConselho || null
  if (d.ufConselho !== undefined) data.ufConselho = d.ufConselho ? d.ufConselho.toUpperCase() : null
  if (d.conselhoStatus !== undefined) data.conselhoStatus = d.conselhoStatus || null
  if (d.especialidades !== undefined) data.especialidades = d.especialidades
  if (d.bio !== undefined) data.bio = d.bio || null
  if (d.fotoUrl !== undefined) data.fotoUrl = d.fotoUrl || null
  if (d.cargaHoraria !== undefined) data.cargaHoraria = d.cargaHoraria ?? null
  if (d.procedimentosHabilitadosIds !== undefined) data.procedimentosHabilitadosIds = d.procedimentosHabilitadosIds
  if (d.userId !== undefined) data.userId = d.userId || null
  if (d.ativo !== undefined) data.ativo = d.ativo

  const professional = await prisma.professional.update({ where: { id }, data })
  return NextResponse.json({ professional })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.orgRole === 'MEMBER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const existing = await prisma.professional.findFirst({
    where: { id, organizationId: user.organizationId },
    select: { id: true },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.professional.update({ where: { id }, data: { ativo: false } })
  return NextResponse.json({ ok: true })
}
